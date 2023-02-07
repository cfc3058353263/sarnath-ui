import request from '@/utils/request'

// 查询故障损失率
export function getList(query) {
  return request({
    url: '/analysis/lossRatioAnalysis/list/',
    method: 'get',
    params: query
  })
}
