import request from '@/utils/request'

// 查询地区信息列表
export function planMonthList(query) {
// operationPlanMonth/list
  return request({
    url: '/system/operationPlanMonth/list',
    method: 'get',
    params: query
  })
}

