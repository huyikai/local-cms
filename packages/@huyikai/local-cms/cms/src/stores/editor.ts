import { arrayToTree, treeToArray } from 'tree-conver';

import { getDirectory } from '@/api/editor';

interface BaseItem {
  name: string;
  isDirectory: boolean;
  isLeaf: boolean;
  path: string;
  parentPath?: string;
  key: string;
}

interface DirectoryItem extends BaseItem {
  isDirectory: true;
  isLeaf: false;
  children: Array<DirectoryItem | FileItem>;
}

interface FileItem extends BaseItem {
  isDirectory: false;
  isLeaf: true;
}

type TreeItem = DirectoryItem | FileItem;

export const useEditor = defineStore('useEditor', () => {
  const loading = ref<boolean>(false);
  // 文件的树形结构数据
  const treeData = ref<TreeItem[]>([]);

  // 文件的扁平结构数据
  const flatData = computed<Array<BaseItem>>(
    () => treeToArray(treeData.value) as Array<BaseItem>
  );

  // 文件仅目录的树形结构数据
  const directory = computed(() =>
    arrayToTree(
      flatData.value
        .filter((item: BaseItem) => item.isDirectory)
        .map((item: BaseItem) => ({
          id: item.path,
          name: item.name,
          path: item.path,
          parentPath: item.parentPath
        })),
      {
        idKey: 'path', // custom id field, default 'id'
        pidKey: 'parentPath' // custom pid field, default 'pid'
      }
    )
  );

  // 获取文件列表方法
  const getFilesList = () => {
    loading.value = true;
    getDirectory().then((res) => {
      if (res.status === 200) {
        treeData.value = res.data; // 获取的数据转树形
        loading.value = false;
      }
    });
  };

  return {
    getFilesList,
    loading,
    treeData,
    flatData,
    directory
  };
});
