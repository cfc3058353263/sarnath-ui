import request from '@/utils/request'

// 获取工器具列表分页查询
export function infoList(query) {
  return request({
    url: '/system/assetsTools/like',
    method: 'get',
    params: query
  })
}

//获取供应商
// /assetSupplier/getAllSupplier
export function getAllSupplier(query) {
  return request({
    url: '/system/assetSupplier/getAllSupplier',
    method: 'get'
  })
}

// 新增编码
export function infoAdd(data) {
  return request({
    url: '/system/assetsTools/add',
    method: 'post',
    data: data
  })
}
// 编辑编码
export function infoUpdate(data,id) {
  return request({
    url: '/system/assetsTools/update/'+id,
    method: 'put',
    data: data
  })
}

// 删除编码
export function infoDelete(id) {
  return request({
    url: '/system/assetsTools/delete/'+id,
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
