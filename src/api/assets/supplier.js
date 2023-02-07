import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";

// 查询供应商列表
export function findSupplierByPage(query) {
  return request({
    url: '/system/assetSupplier/findSupplierByPage',
    method: 'get',
    params: query
  })
}


// 获取供应商
export function getSupplierSelect() {
  return request({
    url: '/system/assetSupplier/getAllSupplier',
    method: 'get'
  })
}

//添加供应商
export function addSupplier(data) {
  return request({
    url: '/system/assetSupplier/addSupplier',
    method: 'post',
    data: data
  })
}

//修改供应商
export function modifySupplier(id,data) {
  return request({
    url: '/system/assetSupplier/modifySupplier/'+id,
    method: 'put',
    data: data
  })
}

//删除供应商
export function deleteSupplier(ids) {
  return request({
    url: '/system/assetSupplier/deleteSupplier/'+ids,
    method: 'delete'
  })
}

//删除供应商
export function getSupplierById(id) {
  return request({
    url: '/system/assetSupplier/getSupplierById/'+id,
    method: 'get'
  })
}
