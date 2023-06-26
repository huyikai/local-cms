import { getDirectory } from '@/api/editor';
import { arrayToTree, treeToArray } from 'tree-conver';
export const useEditor = defineStore('useEditor', () => {
  const loading = ref(false);
  // 文件的树形结构数据
  const treeData = ref([]);

  // 文件的扁平结构数据
  const flatData = computed(() => treeToArray(treeData.value));

  // 文件仅目录的树形结构数据
  const directory = computed(() =>
    arrayToTree(
      flatData.value
        .filter((item: any) => item.isDirectory)
        .map((item: any) => ({
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
