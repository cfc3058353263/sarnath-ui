import request from '@/utils/request'

//合同查询
export function planMonthList(query) {
  return request({
    url: '/system/contractRecord/getContractList',
    method: 'get',
    params: query
  })
}

// 合同计算
export function calculation(data) {
  return request({
    url: '/system/contractRecord/contractDetailCalculation',
    method: 'post',
    data: data
  })
}

// 合同保存
export function addPlan(data) {
  return request({
    url: '/system/contractRecord/saveContractRecord',
    method: 'post',
    data: data
  })
}

// 获取合同信息 
export function getPlan(id) {
  return request({
    url: '/system/contractRecord/getContractByContractId/' + id,
    method: 'get'
  })
}