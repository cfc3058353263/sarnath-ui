import request from '@/utils/request'

// 获取电站列表分页查询
export function stationList(query) {
  return request({
    url: '/system/sysPowerStation/listSelect',
    method: 'get',
    params: query
  })
}

// 电站查询
export function stationSearch(query) {
  return request({
    url: '/system/sysPowerStation/like',
    method: 'get',
    params: query
  })
}
// 电站编辑
export function stationUpdate(id, data) {
  return request({
    url: '/system/sysPowerStation/update/' + id,
    method: 'put',
    data: data
  })
}

//  电站详情
export function stationDetails(id) {
  return request({
    url: '/system/sysPowerStation/get/' + id,
    method: 'get'
  })
}

//  电站删除
export function stationDelete(id) {
  return request({
    url: '/system/sysPowerStation/delete/' + id,
    method: 'delete'
  })
}

//  新增电站
export function stationAdd(data) {
  return request({
    url: '/system/sysPowerStation/add',
    method: 'post',
    data: data
  })
}

//区域获取
export function getArea() {
  return request({
    url: '/system/dict/data/type/sys_area',
    method: 'get',
  })
}
//售电方式
export function getSaleType() {
  return request({
    url: '/system/dict/data/type/sys_sale_type',
    method: 'get',
  })
}
//电站状态
export function getPowerstate() {
  return request({
    url: '/system/dict/data/type/sys_power_status',
    method: 'get',
  })
}
//获取并网等级
export function getLinklevel() {
  return request({
    url: '/system/dict/data/type/sys_link_level',
    method: 'get',
  })
}
//获取电站类型
export function getStationtype() {
  return request({
    url: '/system/dict/data/type/sys_power_type',
    method: 'get',
  })
}
//获取风电电站类型
export function getwindFieldType() {
  return request({
    url: '/system/dict/data/type/sys_windField_type',
    method: 'get',
  })
}
//获取电站业主
export function getStationOwner() {
  return request({
    url: '/system/dict/data/type/sys_power_owner',
    method: 'get',
  })
}

//获取装机容量列表
export function getStationCapacityList(query) {
  return request({
    url: '/system/sysPowerStation/getStationCapacityList',
    method: 'get',
    params: query
  })
}
//增加或减少装机容量
export function getCapacityListAdd(data) {
  return request({
    url: '/system/sysPowerStation/createStationCapacity',
    method: 'post',
    data: data
  })
}
//增加或减少装机容量
export function getCapacityListDelete(id) {
  return request({
    url: '/system/sysPowerStation/deleteStationCapacityById/' + id,
    method: 'post',
  })
}
//编辑装机容量
export function getCapacityListUpdate(data) {
  return request({
    url: '/system/sysPowerStation/updateStationCapacity',
    method: 'post',
    data: data
  })
}
