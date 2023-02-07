import request from '@/utils/request'

// 提交工单
export function addIssueOrder(params) {
  return request({
    url: '/system/issueOrder/addIssueOrder',
    method: 'post',
    data: params
  })
}

// 修改工单
export function modifyIssueOrder(id, params) {
  return request({
    url: '/system/issueOrder/modifyIssueOrder/' + id,
    method: 'put',
    data: params
  })
}

// 提交工单
export function submitNewIssueOrder(ids) {
  return request({
    url: '/system/issueOrder/submitNewIssueOrder/' + ids,
    method: 'put',
  })
}

// 获取工单分页列表
export function getIssueOrderByPage(query) {
  return request({
    url: '/system/issueOrder/getIssueOrderByPage',
    method: 'get',
    params: query
  })
}

//删除工单
export function deleteIssueOrder(ids) {
  return request({
    url: '/system/issueOrder/deleteIssueOrder/' + ids,
    method: 'delete'
  })
}

// 根据id获取工单信息
export function getIssueOrderById(id) {
  return request({
    url: '/system/issueOrder/getIssueOrderById/' + id,
    method: 'get',
  })
}

// 获取处理工单分页列表
export function getHandleIssueOrderByPage(query) {
  return request({
    url: '/system/issueOrder/getHandleIssueOrderByPage',
    method: 'get',
    params: query
  })
}

// 根据工单Id获取详情列表
export function getIssueDetailsListById(id) {
  return request({
    url: '/system/issueOrderDetails/getDetailsListById/'+id,
    method: 'get',
  })
}

// 提交工单详细信息
export function addIssueDetails(params) {
  return request({
    url: '/system/issueOrderDetails/addIssueDetails',
    method: 'post',
    data: params
  })
}

//删除工单详情
export function deleteIssueDetails(ids) {
  return request({
    url: '/system/issueOrderDetails/deleteIssueDetails/' + ids,
    method: 'delete'
  })
}

// 修改工单处理记录
export function modifyIssueDetails(id, params) {
  return request({
    url: '/system/issueOrderDetails/modifyIssueDetails/' + id,
    method: 'put',
    data: params
  })
}

//根据设备id获取工单记录
export function getIssueOrderByDeviceId(query) {
  return request({
    url: '/system/issueOrder/getIssueOrderByDeviceId',
    method: 'get',
    params: query
  })
}

//根据工单id获取损失电量信息
export function getLossKwhByIssueId(issueId) {
  return request({
    url: '/system/issueOrderDetails/getLossKwhByIssueId/'+issueId,
    method: 'get',
  })
}

//根据工单id获取工单设备数据列表
export function getOrderDeviceList(issueId) {
  return request({
    url: '/system/issueOrderDevice/getIssueOrderDeviceByOrderId/'+issueId,
    method: 'get',
  })
}

