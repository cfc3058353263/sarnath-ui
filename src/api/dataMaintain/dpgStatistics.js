import request from '@/utils/request'

// 查询电站设备列表
export function getDeviceDay(query,type) {
  return request({
    url: '/analysis/powerDevice/'+type,
    method: 'get',
    params: query
  })
}