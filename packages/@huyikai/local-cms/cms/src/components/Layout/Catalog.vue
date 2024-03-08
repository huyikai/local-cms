<script setup lang="ts">
import { useEditor, type BaseItem } from '@/stores/editor';
import { deleteFile, deleteDirectory } from '@/api/editor';
import { useModal } from '@/stores/modal';
const useModalStore = useModal();

interface TreeNode {
  key: string | number;
  name: string;
  children?: TreeNode[];
}

const router = useRouter();
const useEditorStore = useEditor();

const treeData = computed(() => useEditorStore.treeData);
const flatData = computed(() => useEditorStore.flatData);

// 点击重命名
const handleRename = (data: BaseItem) => {
  useModalStore.renameModalVisible = true;
  useModalStore.renameModaldata = data;
};

// 获取文件 list
useEditorStore.getFilesList();

// 控制 tree 组件展开 keys
const expandedKeys = ref<(string | number)[]>([]);
// 控制 tree 组件是否自动展开父级
const autoExpandParent = ref<boolean>(true);
const onExpand = (keys: (string | number)[]) => {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
};

watch(
  () => flatData.value,
  (val) => {
    expandedKeys.value = val.map((item) => item.key);
  }
);

const searchValue = ref(''); // 定义搜索框的值
watch(
  () => searchValue.value, // 监听搜索框的值
  (value) => {
    // 监听搜索框的值的变化
    const expanded = flatData.value // 获取扁平化数据
      .map((item) => {
        if (item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
          // 如果搜索框的值在文件名中出现
          return getParentKey(item.key, treeData.value); // 获取该文件的所有父节点的 key
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
      .filter(
        (item): item is string | number => item !== null && item !== undefined
      ); // 去重并过滤掉 null 和 undefined;
    expandedKeys.value = expanded; // 展开搜索到的文件的所有父节点
    autoExpandParent.value = true; // 自动展开父节点
  }
);

// 递归获取父节点的 key
const getParentKey = (
  key: string | number,
  tree: TreeNode[]
): string | number | undefined => {
  let parentKey;
  for (const node of tree) {
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

// 点击编辑
const handleEdit = (path: string) => {
  router.push({
    name: 'editor',
    query: {
      path: encodeURIComponent(path)
    }
  });
};

// 点击删除
const handleDelete = (item: BaseItem) => {
  Modal.confirm({
    title: `确定要删除该${item.isDirectory ? '目录' : '内容'}吗？`,
    content: '删除不可撤销，请谨慎操作',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      return await new Promise((resolve, reject) => {
        (item.isDirectory ? deleteDirectory : deleteFile)({
          directory: item.path
        }).then((res) => {
          message.success(res.data);
          if (res.status === 200) {
            resolve(useEditorStore.getFilesList());
          } else {
            reject();
          }
        });
      }).catch(() => console.log('Oops errors!'));
    }
  });
};

// 点击新建文件
const handleNewFile = (item: BaseItem) => {
  useModalStore.newFileModalVisible = true;
  useModalStore.newFilePath = item.path;
};
const handleNewDirectory = (item: BaseItem) => {
  useModalStore.newDirectoryModalVisible = true;
  useModalStore.newDirectoryPath = item.path;
};
</script>
<template>
  <a-spin :spinning="useEditorStore.loading">
    <div class="catalog">
      <div class="search">
        <a-input
          v-model:value="searchValue"
          placeholder="搜索"
          allow-clear
        >
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
      </div>
      <a-tree
        show-line
        :tree-data="treeData"
        :fieldNames="{
          title: 'name'
        }"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        @expand="onExpand"
        :selectable="false"
      >
        <template #switcherIcon="{ switcherCls }">
          <down-outlined :class="switcherCls" />
        </template>
        <template #title="item">
          <a-dropdown :trigger="['contextmenu', 'click']">
            <HighlightText
              :text="item.name"
              :highlight="searchValue"
            />
            <template #overlay>
              <a-menu>
                <a-menu-item
                  class="menu-item"
                  @click="handleNewFile(item)"
                  v-if="item.isDirectory"
                >
                  <file-add-outlined />
                  <span class="text">新建文件</span>
                </a-menu-item>
                <a-menu-item
                  class="menu-item"
                  @click="handleNewDirectory(item)"
                  v-if="item.isDirectory"
                >
                  <folder-add-outlined />
                  <span class="text">新建文件夹</span>
                </a-menu-item>
                <a-menu-item
                  class="menu-item"
                  @click="handleEdit(item.path)"
                  v-if="!item.isDirectory"
                >
                  <edit-outlined />
                  <span class="text">编辑</span>
                </a-menu-item>
                <a-menu-item
                  class="menu-item"
                  @click="handleRename(item)"
                >
                  <form-outlined />
                  <span class="text">重命名</span>
                </a-menu-item>
                <a-menu-item
                  class="menu-item"
                  @click="handleDelete(item)"
                >
                  <delete-outlined />
                  <span class="text">删除</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </div>
  </a-spin>
</template>

<style scoped lang="scss">
.catalog {
  padding: 0 20px;
  overflow-y: auto;
  height: calc(100vh - 53px);
  position: relative;
  .search {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 9;
    padding: 20px 0;
  }
}
.menu-item {
  .text {
    user-select: none;
    margin-left: 6px;
  }
}
:deep(.ant-tree) {
  .ant-tree-node-content-wrapper {
    line-height: 16px;
  }
}
</style>
