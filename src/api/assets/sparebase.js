import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";


// 查询备品盘点列表
export function listLedgerData(query) {
  return request({
    url: '/system/sparebase/listLedgerPage',
    method: 'get',
    params: query
  })
}

// 查询备品列表
export function listData(query) {
  return request({
    url: '/system/sparebase/listPage',
    method: 'get',
    params: query
  })
}



// 查询备品详细
export function getInfo(id) {
  return request({
    url: '/system/sparebase/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 查询备品盘点详细
export function getInfoLedger(id) {
  return request({
    url: '/system/sparebase/getInfoLedgerById/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 新增备品
export function add(data) {
  return request({
    url: '/system/sparebase',
    method: 'post',
    data: data
  })
}

// 修改备品
export function update(data) {
  return request({
    url: '/system/sparebase',
    method: 'put',
    data: data
  })
}

// 删除备品
export function removeData(id) {
  return request({
    url: '/system/sparebase/' + id,
    method: 'delete'
  })
}

// 导出备品
export function exportData(query) {
  return request({
    url: '/system/sparebase/export',
    method: 'get',
    params: query
  })
}

// 导出备品
export function exportLedgerData(query) {
  return request({
    url: '/system/sparebase/exportLedger',
    method: 'get',
    params: query
  })
}



// 查询备品详情库存记录列表
export function stockPage(query) {
  return request({
    url: '/system/sparebase/stockPage',
    method: 'get',
    params: query
  })
}


// 查询备品详情出入库分页列表
export function orderPage(query) {
  return request({
    url: '/system/sparebase/orderPage',
    method: 'get',
    params: query
  })
}







