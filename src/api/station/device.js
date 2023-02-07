import request from '@/utils/request'

// 查询电站设备列表
export function listDevice(query) {
  return request({
    url: '/system/stationMonitor/device/list',
    method: 'get',
    params: query
  })
}

// 查询电站设备列表 不分页
export function listNoPageDevice(query) {
  return request({
    url: '/system/stationMonitor/device/listNoPage',
    method: 'get',
    params: query
  })
}

// 查询电站设备详细
export function getDevice(deviceId) {
  return request({
    url: '/system/stationMonitor/device/' + deviceId,
    method: 'get'
  })
}

// 新增电站设备
export function addDevice(data) {
  return request({
    url: '/system/stationMonitor/device',
    method: 'post',
    data: data
  })
}

// 修改电站设备
export function updateDevice(data) {
  return request({
    url: '/system/stationMonitor/device',
    method: 'put',
    data: data
  })
}

// 删除电站设备
export function delDevice(deviceId) {
  return request({
    url: '/system/stationMonitor/device/' + deviceId,
    method: 'delete'
  })
}

//判断设备是否存在
export function isExist(query) {
  return request({
    url: '/system/stationMonitor/device/deviceTypeIsExist',
    method: 'get',
    params: query
  })
}
