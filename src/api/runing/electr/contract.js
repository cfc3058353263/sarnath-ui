import request from '@/utils/request'

//月计划查询
export function getContractPlanList(query) {
  return request({
    url: '/system/operationContract/getContractPlanList',
    method: 'get',
    params: query
  })
}

//根据合同保存月计划电量
export function addContractPlan(data) {
  return request({
    url: '/system/operationContract/addContractPlan',
    method: 'post',
    data: data
  })
}

//根据合同id获取计划发电量列个表
export function getContractInfo(contractId) {
  return request({
    url: '/system/operationContract/getContractInfo/' + contractId,
    method: 'get',
  })
}

//修改风电月计划
export function updateWindMonPlan(id,data) {
  return request({
    url: '/system/operationContract/updateWindMonPlan/'+id,
    method: 'put',
    data: data
  })
}
