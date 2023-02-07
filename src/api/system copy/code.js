import request from '@/utils/request'

// 获取编码列表分页查询
export function codeList(query) {
  return request({
    url: '/system/sysCodeConfig/like',
    method: 'get',
    params: query
  })
}

// 新增编码
export function codeAdd(data) {
  return request({
    url: '/system/sysCodeConfig/add',
    method: 'post',
    data: data
  })
}

// 启用编码
export function codeStart(id,date) {
  return request({
    url: '/system/sysCodeConfig/start/'+id+"/"+date,
    method: 'put'
  })
}
// 停用编码
export function codeStop(id,date) {
  return request({
    url: '/system/sysCodeConfig/stop/'+id+"/"+date,
    method: 'put'
  })
}
// 删除编码
export function codeDelete(id) {
  return request({
    url: '/system/sysCodeConfig/delete/'+id,
    method: 'delete'
  })
}
// 字典查询
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/'+dict,
    method: 'get',
  })
}
