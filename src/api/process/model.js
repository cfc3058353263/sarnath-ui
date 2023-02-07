import request from '@/utils/request'

// 列表
export function getList(query) {
  return request({
    url: '/workflow/models/modelListData',
    method: 'get',
    params: query
  })
}
// 创建
export function getCreate(query) {
  return request({
    url: '/workflow/models/create',
    method: 'get',
    params: query
  })
}
// 删除
export function getRemove(id) {
  return request({
    url: '/workflow/models/delete/'+id,
    method: 'delete',
  })
}
// 发布
export function getRelease(id) {
  return request({
    url: '/workflow/models/deployment/'+id,
    method: 'get',
  })
}
