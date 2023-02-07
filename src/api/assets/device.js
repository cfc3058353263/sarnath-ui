import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";

// 查询设备列表
export function listData(query) {
  return request({
    url: '/system/device/listPage',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getInfo(deviceId) {
  return request({
    url: '/system/device/' + parseStrEmpty(deviceId),
    method: 'get'
  })
}

// 新增设备
export function add(data) {
  return request({
    url: '/system/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function update(data) {
  return request({
    url: '/system/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function removeData(deviceId) {
  return request({
    url: '/system/device/' + deviceId,
    method: 'delete'
  })
}

// 导出设备
export function exportData(query) {
  return request({
    url: '/system/device/export',
    method: 'get',
    params: query
  })
}

// 查询设备下拉树结构 下拉框用
export function treeselectInput() {
  return request({
    url: '/system/device/treeselect',
    method: 'get'
  })
}

// 查询设备下拉树结构 下拉框用
export function selectByType(type) {
  return request({
    url: '/system/device/selectByType',
    method: 'get',
    params: {deviceType:type}
  })
}

// 添加报废记录
export function addDiscard(data) {
  return request({
    url: '/system/device/editDiscard',
    method: 'put',
    data: data
  })
}

// 导出设备二维码
export function exportDataQrcode(query) {
  return request({
    url: '/system/device/exportQrcode',
    method: 'get',
    params: query
  })
}


// 查询设备下拉树结构 下拉框用
export function treeselectForStations(query) {
  return request({
    url: '/system/device/treeselectForStations',
    method: 'get',
    params: query
  })
}



    