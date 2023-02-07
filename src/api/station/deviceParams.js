import request from '@/utils/request'

// 查询电站设备参数列表
export function listDeviceParams(query) {
  return request({
    url: '/system/stationMonitor/deviceParams/list',
    method: 'get',
    params: query
  })
}

// 查询电站设备参数详细
export function getDeviceParams(id) {
  return request({
    url: '/system/stationMonitor/deviceParams/' + id,
    method: 'get'
  })
}

// 新增电站设备参数
export function addDeviceParams(data) {
  return request({
    url: '/system/stationMonitor/deviceParams',
    method: 'post',
    data: data
  })
}

// 修改电站设备参数
export function updateDeviceParams(data) {
  return request({
    url: '/system/stationMonitor/deviceParams',
    method: 'put',
    data: data
  })
}

// 删除电站设备参数
export function delDeviceParams(id) {
  return request({
    url: '/system/stationMonitor/deviceParams/' + id,
    method: 'delete'
  })
}

//设备详情
export function getDeviceDetails(query) {
  return request({
    url: '/system/stationMonitor/deviceParams/dataMonitor',
    method: 'get',
    params: query
  })
}
