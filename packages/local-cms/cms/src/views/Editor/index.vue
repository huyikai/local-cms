<script setup lang="ts">
import { useEditor } from '@/stores/editor';
import gfm from '@bytemd/plugin-gfm';
import 'bytemd/dist/index.css';
import {
  getFileContent,
  modifyFileContent,
  getFileGitInfo
} from '@/api/editor';
const route = useRoute();
const router = useRouter();
const useEditorStore = useEditor();

const loading = ref(false);
const content = ref('');
const plugins = [gfm()];

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
const handleChange = (v: string) => {
  content.value = v;
  debouncedFn();
};
const getContent = (path: any) => {
  loading.value = true;
  getFileContent({ path: encodeURIComponent(path) }).then((res) => {
    if (res.status === 200) {
      content.value = res.data;
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
</script>
<template>
  <a-spin :spinning="loading">
    <MDEditor
      :value="content"
      :plugins="plugins"
      @change="handleChange"
    />
  </a-spin>
</template>
<style scoped lang="scss">
:deep(.bytemd) {
  height: calc(100vh - 60px);
}
</style>
