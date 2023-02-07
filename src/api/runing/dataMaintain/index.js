import request from '@/utils/request'

// 查询运行日报纠正列表
export function listCorrect(query) {
  return request({
    url: '/system/dayReportCorrect/list',
    method: 'get',
    params: query
  })
}

// 审核
export function getReview(data) {
  return request({
    url: '/system/dayReportCorrect/review',
    method: 'put',
    data: data
  })
}
