<script setup lang="ts">
import { useModal } from '@/stores/modal';
const useModalStore = useModal();
const router = useRouter();
const route = useRoute();
</script>
<template>
  <a-layout-sider
    width="240"
    style="background-color: #fff; border-right: 1px solid #eee"
  >
    <header>
      <a-button
        type="text"
        @click="router.push('/home')"
        v-if="route.path !== '/home'"
        title="首页"
      >
        <template #icon>
          <home-outlined />
        </template>
      </a-button>
      <div class="btn-group">
        <a-tooltip>
          <template #title>新建文件</template>
          <a-button
            type="text"
            @click="useModalStore.newFileModalVisible = true"
          >
            <template #icon>
              <file-add-outlined />
            </template>
          </a-button>
        </a-tooltip>
        <a-tooltip>
          <template #title>新建目录</template>
          <a-button
            type="text"
            @click="useModalStore.newDirectoryModalVisible = true"
          >
            <template #icon>
              <folder-add-outlined />
            </template>
          </a-button>
        </a-tooltip>
      </div>
    </header>
    <Catalog></Catalog>
  </a-layout-sider>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 15px;
  box-sizing: border-box;
  .btn-group {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: auto;
  }
}
</style>
