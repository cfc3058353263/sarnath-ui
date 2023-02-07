import request from '@/utils/request'

// 查询发电量完成比
export function getList(query) {
  return request({
    url: '/analysis/generationCompletionRatio/list/',
    method: 'get',
    params: query
  })
}
