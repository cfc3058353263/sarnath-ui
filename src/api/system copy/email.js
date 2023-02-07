import request from '@/utils/request'

// 邮件列表
export function crontabList() {
  return request({
    url: '/system/cronMail/list',
    method: 'get',
  })
}

//新增
export function cronMailAdd(data) {
  return request({
    url: '/system/cronMail/add',
    method: 'post',
    data:data
  })
}
//查看/cronMail/get/{id}
export function getCronMailDetail(params) {
  return request({
    url: '/system/cronMail/get',
    method: 'get',
    params:params
  })
}

// 修改邮件定时任务
export function cronMailupdate(id,data) {
  return request({
    url: '/system/cronMail/update/'+id,
    method: 'delete',
    data:data
  })
}
// 启用
export function cronMailStart(id) {
  return request({
    url: '/system/cronMail/start/'+id,
    method: 'put',
  })
}
// 停用
export function cronMailEnd(id) {
  return request({
    url: '/system/cronMail/end/'+id,
    method: 'put',
  })
}
// 删除
export function cronMailDelete(id,data) {
  return request({
    url: '/system/cronMail/delete/'+id,
    method: 'delete',
    data:data
  })
}

//获取用户
export function getUserList() {
  return request({
    url: '/system/user/selectlist',
    method: 'get',
  })
}
