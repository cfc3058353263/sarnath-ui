import request from '@/utils/request'

// 邮件列表
export function appList(query) {
  return request({
    url: '/system/appUpgrade/listPage',
    method: 'get',
    params: query
  })
}

//新增
export function appAdd(data) {
  return request({
    url: '/system/appUpgrade',
    method: 'post',
    data:data
  })
}

//编辑
export function appUpdate(data) {
  return request({
    url: '/system/appUpgrade',
    method: 'put',
    data:data
  })
}

//发布
export function appRelease(data) {
  return request({
    url: '/system/appUpgrade/commit',
    method: 'post',
    params:data
  })
}

//编辑
export function appDelete(data) {
  return request({
    url: '/system/appUpgrade',
    method: 'delete',
    params:data
  })
}