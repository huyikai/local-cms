<script setup lang="ts">
import { useEditor, type BaseItem } from '@/stores/editor';
import { renameFile, renameDirectory } from '@/api/editor';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    data: BaseItem;
  }>(),
  { visible: false }
);

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'update:data', value: BaseItem): void;
}>();
const _visible = computed({
  get() {
    newname.value = oldName.value as string;
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
    if (!val) {
      newname.value = '';
    }
  }
});

const _data = computed<BaseItem>({
  get() {
    return props.data || '';
  },
  set(val) {
    emit('update:data', val);
  }
});

const oldName = computed<string | number | undefined>(() =>
  _data.value.path.split('/').pop()?.replace(/\.md$/, '')
);

const useEditorStore = useEditor();
const newname = ref('');

const handleOk = () => {
  const isDirectory = _data.value.isDirectory;
  (isDirectory ? renameDirectory : renameFile)({
    name: newname.value,
    directory: _data.value.path
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
    v-model:open="_visible"
    title="重命名"
    @ok="handleOk"
    ok-text="确定"
    cancel-text=" 取消"
    destroy-on-close
    :ok-button-props="{ disabled: !!!newname || oldName === newname }"
  >
    <a-form>
      <a-form-item label="名称">
        <a-input
          v-model:value="newname"
          :placeholder="oldName"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped lang="scss"></style>
