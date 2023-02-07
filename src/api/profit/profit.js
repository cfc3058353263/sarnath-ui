import request from '@/utils/request'

// 查询日收益等临时列表
export function listProfit(query) {
  return request({
    url: '/system/profit/list',
    method: 'get',
    params: query
  })
}

// 查询日收益等临时详细
export function getProfit(id) {
  return request({
    url: '/system/profit/' + id,
    method: 'get'
  })
}

// 新增日收益等临时
export function addProfit(data) {
  return request({
    url: '/system/profit',
    method: 'post',
    data: data
  })
}

// 修改日收益等临时
export function updateProfit(data) {
  return request({
    url: '/system/profit',
    method: 'put',
    data: data
  })
}

// 删除日收益等临时
export function delProfit(id) {
  return request({
    url: '/system/profit/' + id,
    method: 'delete'
  })
}
