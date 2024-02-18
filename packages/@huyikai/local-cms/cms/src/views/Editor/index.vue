<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { useEditor } from '@/stores/editor';

import {
  getFileContent,
  modifyFileContent,
  getFileGitInfo
} from '@/api/editor';
import { componentPlugin } from '@mdit-vue/plugin-component';

import { slugify } from '@mdit-vue/shared';
import { tocPlugin } from '@mdit-vue/plugin-toc';
import { titlePlugin } from '@mdit-vue/plugin-title';
import { containerPlugin } from './plugins/containers';
import { highlight } from './plugins/highlight';
import { highlightLinePlugin } from './plugins/highlightLines';
// import { imagePlugin, type Options as ImageOptions } from './plugins/image';
import { lineNumberPlugin } from './plugins/lineNumbers';
// import { linkPlugin } from './plugins/link';
import { preWrapperPlugin } from './plugins/preWrapper';
import { full as emojiPlugin } from 'markdown-it-emoji';
import anchorPlugin from 'markdown-it-anchor';
// import { snippetPlugin } from './plugins/snippet';
// import { gitHubAlertsPlugin } from './plugins/githubAlerts';
const route = useRoute();
const router = useRouter();
const useEditorStore = useEditor();

const loading = ref(false);
const content = ref('');
const renderedMarkdown = ref(''); // 使用一个普通的响应式引用来存储渲染后的Markdown

const debouncedFn = useDebounceFn(
  () => {
    const path: any = route.query.path;
    const file: any = useEditorStore.flatData.find(
      (item: any) => item.path === decodeURIComponent(path)
    );
    modifyFileContent({ content: content.value, path: file.path });
  },
  500,
  { maxWait: 5000 }
);

const getContent = (path: any) => {
  loading.value = true;
  renderedMarkdown.value = '';
  content.value = '';
  getFileContent({ path: encodeURIComponent(path) }).then(async (res) => {
    if (res.status === 200) {
      content.value = res.data;
      renderedMarkdown.value = await md();
      loading.value = false;
    }
  });
  // getFileGitInfo({ path: encodeURIComponent(path) }).then((res) => {
  //   console.log('getFileGitInfo', res);
  // });
};

watch(
  () => [route.query, useEditorStore.flatData],
  (n) => {
    if (!!n[0] && 'path' in n[0] && useEditorStore.flatData.length) {
      const path: any = n[0].path;
      const file: any = useEditorStore.flatData.find(
        (item: any) => item.path === decodeURIComponent(path)
      );
      if (file && file.path) {
        getContent(file.path);
      } else {
        router.push('/home');
      }
    }
  },
  {
    immediate: true
  }
);
const md = async () => {
  const instance = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: await highlight(
      { light: 'github-light', dark: 'github-dark' },
      {}
    )
  });
  instance
    .use(componentPlugin)
    .use(highlightLinePlugin)
    .use(preWrapperPlugin)
    .use(containerPlugin)
    .use(lineNumberPlugin)
    .use(emojiPlugin, {})
    .use(titlePlugin)
    .use(tocPlugin, {})
    .use(anchorPlugin, {
      slugify,
      permalink: anchorPlugin.permalink.linkInsideHeader({
        symbol: '&ZeroWidthSpace;',
        renderAttrs: (slug: any, state: any) => {
          // Find `heading_open` with the id identical to slug
          const idx = state.tokens.findIndex((token: any) => {
            const attrs = token.attrs;
            const id = attrs?.find((attr: any) => attr[0] === 'id');
            return id && slug === id[1];
          });
          // Get the actual heading content
          const title = state.tokens[idx + 1].content;
          return {
            'aria-label': `Permalink to "${title}"`
          };
        }
      })
    });
  return instance.render(content.value);
};
const preview = ref(null);
const editor = ref(null);
const updatePreview = async (event: any) => {
  content.value = event.target.value;
  renderedMarkdown.value = await md();
  debouncedFn();
};

const syncScroll = (event: any) => {
  const target = event.target;
  const isEditor = target.classList.contains('editor');
  const editorElement: any = editor.value;
  const previewElement: any = preview.value;
  if (!editorElement || !previewElement) return;

  let scrollPercentage = 0;
  if (isEditor) {
    scrollPercentage =
      editorElement.scrollTop /
      (editorElement.scrollHeight - editorElement.clientHeight);
    previewElement.scrollTop =
      scrollPercentage *
      (previewElement.scrollHeight - previewElement.clientHeight);
  } else {
    scrollPercentage =
      previewElement.scrollTop /
      (previewElement.scrollHeight - previewElement.clientHeight);
    editorElement.scrollTop =
      scrollPercentage *
      (editorElement.scrollHeight - editorElement.clientHeight);
  }
};
</script>
<template>
  <a-spin :spinning="loading">
    <!-- <MDEditor
      :value="content"
      :plugins="plugins"
      @change="handleChange"
    /> -->
    <!-- <div v-html="renderedMarkdown"></div> -->
    <!-- <VPContent></VPContent> -->
    <div class="editor-preview-container">
      <textarea
        class="editor"
        @input="updatePreview"
        v-model="content"
        ref="editor"
        @scroll="syncScroll"
      ></textarea>
      <div
        class="preview vp-doc"
        v-html="renderedMarkdown"
        ref="preview"
        @scroll="syncScroll"
      ></div>
    </div>
  </a-spin>
</template>
<style scoped lang="scss">
:deep(.bytemd) {
  height: calc(100vh - 60px);
}

.editor-preview-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 60px);
}
.editor,
.preview {
  flex: 1;
  overflow-y: scroll;
  height: 100%;
  box-sizing: border-box;
}
.editor {
  resize: none;
}
</style>
