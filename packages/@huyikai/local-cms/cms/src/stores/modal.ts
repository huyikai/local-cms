export const useModal = defineStore('useModal', () => {
  // 重命名弹窗
  const renameModalVisible = ref(false);
  const renameModaldata = ref({});
  // 新建文件弹窗
  const newFilePath = ref(undefined);
  const newFileModalVisible = ref(false);
  // 新建目录弹窗
  const newDirectoryPath = ref(undefined);
  const newDirectoryModalVisible = ref(false);
  return {
    renameModalVisible,
    renameModaldata,
    newFilePath,
    newFileModalVisible,
    newDirectoryPath,
    newDirectoryModalVisible
  };
});
