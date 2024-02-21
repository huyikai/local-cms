export const useModal = defineStore('useModal', () => {
  // 重命名弹窗
  const renameModaldata = ref({});
  const renameModalVisible = ref<boolean>(false);
  // 新建文件弹窗
  const newFilePath = ref<string | undefined>(undefined);
  const newFileModalVisible = ref<boolean>(false);
  // 新建目录弹窗
  const newDirectoryPath = ref<string | undefined>(undefined);
  const newDirectoryModalVisible = ref<boolean>(false);
  return {
    renameModalVisible,
    renameModaldata,
    newFilePath,
    newFileModalVisible,
    newDirectoryPath,
    newDirectoryModalVisible
  };
});
