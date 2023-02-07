import request from '@/utils/request'

// 查询岗位列表
export function findAllPageList(query) {
  return request({
    url: '/system/sysPosition/findAllPageList',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPosition(data) {
  return request({
    url: '/system/sysPosition/addPosition',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function modifyPosition(data) {
  return request({
    url: '/system/sysPosition/modifyPosition',
    method: 'post',
    data: data
  })
}

// 删除岗位
export function deletePosition(postId) {
  return request({
    url: '/system/sysPosition/deletePosition/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}


// 查询岗位下拉框列表
export function listPostSelect(query) {
  return request({
    url: '/system/sysPosition/getPositionList',
    method: 'get',
    params: query
  })
}
