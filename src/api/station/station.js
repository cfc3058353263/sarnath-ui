import request from '@/utils/request'

// 查询电站列表
export function listStation(query) {
  return request({
    url: '/station/station/list',
    method: 'get',
    params: query
  })
}

// 查询电站详细
export function getStation(stationId) {
  return request({
    url: '/station/station/' + stationId,
    method: 'get'
  })
}

// 新增电站
export function addStation(data) {
  return request({
    url: '/station/station',
    method: 'post',
    data: data
  })
}

// 修改电站
export function updateStation(data) {
  return request({
    url: '/station/station',
    method: 'put',
    data: data
  })
}

// 删除电站
export function delStation(stationId) {
  return request({
    url: '/station/station/' + stationId,
    method: 'delete'
  })
}

//人员获取
export function getUserTreeSelect(query) {
  return request({
    url: '/station/station/stationUserTreeSelect/' + query,
    method: 'get',
  })
}

//权限分配
export function userTreeUpdate(data) {
  return request({
    url: '/station/station/stationUserTreeUpdate',
    method: 'post',
    data: data
  })
}

//用户电站权限判断
export function isStationUser(query) {
  return request({
    url: '/station/station/checkStationUser?stationId=' + query.stationId + "&userId=" + query.userId,
    method: 'get',
  })
}
//所有电价获取
// http://36.134.120.252:18900/ruoyi-admin/station/eleprice/listNoPage
export function getElepriceList(query) {
  return request({
    url: '/station/eleprice/listNoPage',
    method: 'get',
  })
}

export function getStationIndex(query) {
  return request({
    url: '/system/sysPowerStation/stationIndex',
    method: 'get',
    params: query
  })
}