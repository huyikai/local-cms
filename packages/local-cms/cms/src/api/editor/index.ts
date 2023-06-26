import request from '@/utils/request';

// 获取所有目录列表
export const getDirectory = () =>
  request({
    method: 'get',
    url: '/api/directory/all'
  });

// 获取所有md文件列表
export const getFiles = () =>
  request({
    method: 'get',
    url: '/api/files/all'
  });

// 获取文件内容
export const getFileContent = (params: any) =>
  request({
    method: 'get',
    url: '/api/files',
    params
  });

// 修改文件内容
export const modifyFileContent = (data: any) =>
  request({
    method: 'put',
    url: '/api/files',
    data
  });

// 新建文件
export const newFile = (data: any) =>
  request({
    method: 'post',
    url: '/api/files',
    data
  });

// 删除文件
export const deleteFile = (data: any) =>
  request({
    method: 'delete',
    url: '/api/files',
    data
  });

// 文件重命名
export const renameFile = (data: any) =>
  request({
    method: 'put',
    url: '/api/files/rename',
    data
  });

// 获取文件 git 版本信息
export const getFileGitInfo = (params: any) =>
  request({
    method: 'get',
    url: '/api/files/git',
    params
  });

// 新建目录
export const newDirectory = (data: any) =>
  request({
    method: 'post',
    url: '/api/directories',
    data
  });

// 删除目录
export const deleteDirectory = (data: any) =>
  request({
    method: 'delete',
    url: '/api/directories',
    data
  });

// 重命名目录
export const renameDirectory = (data: any) =>
  request({
    method: 'put',
    url: '/api/directories/rename',
    data
  });
