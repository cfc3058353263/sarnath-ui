import request from '@/utils/request'

//获取天气
export function getList(query) {
  return request({
    url: '/analysis/weatherAnalysis/list',
    method: 'get',
    params: query
  })
}
