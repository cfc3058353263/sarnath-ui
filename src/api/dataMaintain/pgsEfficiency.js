import request from '@/utils/request'

// 查询电站设备列表
export function getPowerRatio(query) {
  return request({
    url: '/analysis/powerRatio/getPowerRatioKw',
    method: 'get',
    params: query
  })
}
