import request from '@/utils/request'

// 查询电站设备列表
export function getDeviceList(query) {
  return request({
    url: '/analysis/powerDevice/listDevicePower',
    method: 'get',
    params: query
  })
}

// 获取设备列表
export function getDevice(query) {
  return request({
    url: '/analysis/powerDevice/listInverter',
    method: 'get',
    params: query
  })
}
// 设备数据录入
export function addDevice(query) {
  return request({
    url: '/analysis/powerDevice/addDevicePower',
    method: 'post',
    data: query
  })
}
