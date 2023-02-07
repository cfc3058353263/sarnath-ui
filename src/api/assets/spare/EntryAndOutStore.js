import request from '@/utils/request'

// 获取备品入库单
export function getSpareOrderByPage(query) {
  return request({
    url: '/system/assetsSpareOrders/getSpareOrderByPage',
    method: 'get',
    params: query
  })
}

// 获取已入库备品单详情
export function getALLOrderInDetailByPage(query) {
  return request({
    url: '/system/assetsSpareOrdersDetail/getALLOrderInDetailByPage',
    method: 'get',
    params: query
  })
}

//添加入库单
export function addSpareOrdersIn(data) {
  return request({
    url: '/system/assetsSpareOrders/addSpareOrders/In',
    method: 'post',
    data: data
  })
}

//添加出库单
export function addSpareOrdersOut(data) {
  return request({
    url: '/system/assetsSpareOrders/addSpareOrders/Out',
    method: 'post',
    data: data
  })
}

//修改入库单
export function modifySpareOrdersIn(id,data) {
  return request({
    url: '/system/assetsSpareOrders/modifySpareOrders/In/'+id,
    method: 'put',
    data: data
  })
}

//修改入库单
export function modifySpareOrdersOut(id,data) {
  return request({
    url: '/system/assetsSpareOrders/modifySpareOrders/Out/'+id,
    method: 'put',
    data: data
  })
}




// 获取单详情
export function getDetailById(orderId) {
  return request({
    url: '/system/assetsSpareOrdersDetail/getDetailById/' + orderId,
    method: 'get',
  })
}

// 提交入库单号
export function submitOrderIn(orderIds) {
  return request({
    url: '/system/assetsSpareOrders/submitOrder/In/' + orderIds,
    method: 'put',
  })
}

// 提交入库单号
export function submitOrderOut(orderIds) {
  return request({
    url: '/system/assetsSpareOrders/submitOrder/Out/' + orderIds,
    method: 'put',
  })
}

// 按单号删除出入库单
export function deleteSpareOrders(orderIds) {
  return request({
    url: '/system/assetsSpareOrders/deleteSpareOrders/' + orderIds,
    method: 'delete',
  })
}
