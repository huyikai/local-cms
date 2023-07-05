<script setup lang="ts">
import { useModal } from '@/stores/modal';
const useModalStore = useModal();
</script>
<template>
  <Rename
    v-model:visible="useModalStore.renameModalVisible"
    v-model:data="useModalStore.renameModaldata"
  >
  </Rename>
  <NewFile
    v-model:visible="useModalStore.newFileModalVisible"
    v-model:path="useModalStore.newFilePath"
  ></NewFile>
  <NewDirectory
    v-model:visible="useModalStore.newDirectoryModalVisible"
    v-model:path="useModalStore.newDirectoryPath"
  >
  </NewDirectory>
</template>
