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
// import { useCodeGroups } from 'vitepress/dist/client/app/composables/codeGroups.js';
// import { snippetPlugin } from './plugins/snippet';
// import { gitHubAlertsPlugin } from './plugins/githubAlerts';
import { useCodeGroups } from './composables/codeGroups';
import { useCopyCode } from './composables/copyCode';
useCodeGroups();
useCopyCode();

const route = useRoute();
const router = useRouter();
const useEditorStore = useEditor();

const loading = ref(false);
const undoStack: any = ref([]);
const redoStack: any = ref([]);
const content: any = ref('');
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
  undoStack.value.push(JSON.parse(JSON.stringify(content.value)));
  content.value = event.target.value;
  redoStack.value = [];
  renderedMarkdown.value = await md();
  debouncedFn();
};

// 撤销操作
const undo = async () => {
  if (undoStack.value.length > 0) {
    redoStack.value.push(JSON.parse(JSON.stringify(content.value))); // 将当前状态推入重做栈
    const lastState = undoStack.value.pop();
    content.value = lastState; // 更新内容为上一个状态
    renderedMarkdown.value = await md();
    debouncedFn();
  }
};

// 重做操作
const redo = async () => {
  if (redoStack.value.length > 0) {
    undoStack.value.push(JSON.parse(JSON.stringify(content.value))); // 将当前状态推入撤销栈
    const nextState = redoStack.value.pop();
    content.value = nextState; // 更新内容为下一个状态
    renderedMarkdown.value = await md();
    debouncedFn();
  }
};

const clear = async () => {
  undoStack.value.push(JSON.parse(JSON.stringify(content.value)));
  content.value = '';
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
const applyFormat = async (formatType: any) => {
  const editorElement: any = editor.value;
  if (!editorElement) return;

  let formatText = '';
  switch (formatType) {
    case 'bold':
      formatText = '**';
      break;
    case 'italic':
      formatText = '*';
      break;
    case 'strikethrough':
      formatText = '~~';
      break;
    case 'h1':
      formatText = '# ';
      break;
    case 'h2':
      formatText = '## ';
      break;
    case 'h3':
      formatText = '### ';
      break;
    case 'h4':
      formatText = '#### ';
      break;
    case 'h5':
      formatText = '##### ';
      break;
    case 'h6':
      formatText = '###### ';
      break;
  }

  const startPos = editorElement.selectionStart;
  const endPos = editorElement.selectionEnd;
  const selectedText = editorElement.value.substring(startPos, endPos);
  const originalText = editorElement.value;

  // 如果有选中内容，则给选中的内容增加格式
  if (selectedText) {
    editorElement.value =
      originalText.substring(0, startPos) +
      formatText +
      selectedText +
      (['bold', 'italic', 'strikethrough'].includes(formatType)
        ? formatText
        : '') +
      originalText.substring(endPos);
    // 更新选中区域，包括新增的格式文本
    editorElement.setSelectionRange(
      startPos,
      endPos +
        formatText.length +
        (['bold', 'italic', 'strikethrough'].includes(formatType)
          ? formatText.length
          : 0)
    );
  } else {
    // 对于标题，插入格式文本后不需要重复的格式符号
    let insertText =
      formatText +
      (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(formatType)
        ? '标题文本'
        : formatText); // 默认插入文本为格式符号
    editorElement.value =
      originalText.substring(0, startPos) +
      insertText +
      originalText.substring(endPos);
    // 更新光标位置到插入文本之后
    editorElement.setSelectionRange(
      startPos + insertText.length,
      startPos + insertText.length
    );
  }

  editorElement.dispatchEvent(new Event('input'));
  renderedMarkdown.value = await md();
  debouncedFn();
};
</script>
<template>
  <a-spin :spinning="loading">
    <div class="tool-bar">
      <undo-outlined @click="undo" />
      <redo-outlined @click="redo" />
      <clear-outlined @click="clear" />
      <a-divider type="vertical" />

      <a-dropdown>
        <div class="tool-item">
          H
          <caret-down-outlined class="menu-arrow" />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="applyFormat('h1')"> 一级标题 </a-menu-item>
            <a-menu-item @click="applyFormat('h2')"> 二级标题 </a-menu-item>
            <a-menu-item @click="applyFormat('h3')"> 三级标题 </a-menu-item>
            <a-menu-item @click="applyFormat('h4')"> 四级标题 </a-menu-item>
            <a-menu-item @click="applyFormat('h5')"> 五级标题 </a-menu-item>
            <a-menu-item @click="applyFormat('h6')"> 六级标题 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <bold-outlined @click="applyFormat('bold')" />
      <italic-outlined @click="applyFormat('italic')" />
      <strikethrough-outlined @click="applyFormat('strikethrough')" />
    </div>
    <div class="editor-preview-container">
      <textarea
        class="editor"
        @input="updatePreview"
        :value="content"
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
.editor-preview-container {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  box-sizing: border-box;
  height: calc(100vh - 80px);
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

.tool-bar {
  height: 40px;
  // padding: 0 10px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 15px;
  .tool-item {
    cursor: pointer;
    user-select: none;
    .menu-arrow {
      font-size: 10px;
    }
  }
}
</style>
