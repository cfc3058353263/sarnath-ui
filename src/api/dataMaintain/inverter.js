import request from '@/utils/request'

//获取逆变器离散率
export function getInverterDivergence(query) {
  return request({
    url: '/analysis/inverter/getInverterDivergence',
    method: 'get',
    params: query
  })
}
