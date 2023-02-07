import request from '@/utils/request'

// 查询发电量完成比
export function getList(query) {
  return request({
    url: '/analysis/dailyGenerationCompletionRatio/list/',
    method: 'get',
    params: query
  })
}

// 查询发电量完成比
export function getContract(query) {
  return request({
    url: '/analysis/dailyGenerationCompletionRatio/getContractTimeByStationId',
    method: 'get',
    params: query
  })
}
