<script setup lang="ts">
import { useEditor } from '@/stores/editor';
import { newFile } from '@/api/editor';

const props = defineProps<{
  visible: boolean;
  path?: string | undefined;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'update:path', value: string | undefined): void;
}>();
const _visible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
    if (!val) {
      _path.value = undefined;
      filename.value = '';
    }
  }
});

const useEditorStore = useEditor();
const _path: any = computed({
  get() {
    return props.path || undefined;
  },
  set(val) {
    emit('update:path', val);
  }
});
const filename = ref('');

const fieldNames = { children: 'children', label: 'name', value: 'path' };
const treeData = computed(() => {
  return [
    {
      name: '根目录',
      path: '/',
      children: useEditorStore.directory
    }
  ];
});

const handleOk = () => {
  newFile({
    filename: filename.value,
    directory: _path.value
  }).then((res) => {
    if (res.status === 200) {
      message.success(res.data);
      _visible.value = false;
      useEditorStore.getFilesList();
    }
  });
};
</script>
<template>
  <a-modal
    v-model:visible="_visible"
    title="新建内容"
    @ok="handleOk"
    ok-text="确定"
    cancel-text=" 取消"
    :ok-button-props="{ disabled: !!!_path || !!!filename }"
  >
    <a-form>
      <a-form-item label="选择目录">
        <a-tree-select
          v-model:value="_path"
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          allow-clear
          tree-default-expand-all
          :tree-data="treeData"
          :fieldNames="fieldNames"
          placeholder="选择要新建文件的目录"
        />
      </a-form-item>
      <a-form-item label="文件名称">
        <a-input
          v-model:value="filename"
          placeholder="文件名称"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="scss"></style>
