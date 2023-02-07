import request from '@/utils/request'

// 获取入库列表分页查询
export function wareHouseList(query) {
  return request({
    url: '/system/assetsToolsOrders/likeIn',
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
//新增和编辑入库明细
export function detailedAdd(data,orderId) {
  // /assetsToolsOrdersDetail/addIn
  return request({
    url: '/system/assetsToolsOrdersDetail/addIn?orderId='+orderId,
    method: 'post',
    data:data
  })
}
// 删除入库
export function OrdersDelete(id) {
  return request({
    url: '/system/assetsToolsOrders/delete/'+id,
    method: 'delete'
  })
}
// 更改入库状态
export function OrdersIn(id) {
    return request({
    url: '/system/assetsToolsOrders/in/'+id,
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
