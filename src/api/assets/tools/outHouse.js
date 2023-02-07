// OutHouseList
// assetsToolsOrders/likeOut
import request from '@/utils/request'

// 获取出库列表分页查询
export function OutHouseList(query) {
  return request({
    url: '/system/assetsToolsOrders/likeOut',
    method: 'get',
    params: query
  })
}
//明细获取
export function detailedList(orderId) {
  return request({
    url: '/system/assetsToolsOrdersDetail/list/'+orderId,
    method: 'get',
  })
}

// 出库提交之前拉取的库存批次信息
export function likeBatch(query) {
  return request({
    url: '/system/assetsTools/likeBatch',
    method: 'get',
    params: query
  })
}

//新增和编辑出库明细
export function detailedAdd(data,orderId) {
  return request({
    url: '/system/assetsToolsOrdersDetail/addOut?orderId='+orderId,
    method: 'post',
    data:data
  })
}

// 删除出库
export function OrdersDelete(id) {
  return request({
    url: '/system/assetsToolsOrders/delete/'+id,
    method: 'delete'
  })
}
// 更改出库状态
export function OrdersIn(id) {
    return request({
    url: '/system/assetsToolsOrders/out/'+id,
    method: 'get'
  })
}

// 字典查询
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/'+dict,
    method: 'get',
  })
}

//获取工器具编码
export function getCodeList(query) {
  return request({
    url: '/system/assetsTools/getOutList',
    method: 'get',
    params: query
  })
}
