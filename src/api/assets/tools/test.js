import request from '@/utils/request'

// 获取检测登记分页查询
export function testList(query) {
  // 根据工器具id获取检验登记的信息列表
  return request({
    url: '/system/assetsTestRecord/list',
    method: 'get',
    params: query
  })
}

// 根据工器具id获取检验登记的信息列表
export function testGet(toolsId, batchCode) {
  return request({
    url: '/system/assetsTestRecord/get/' + toolsId + "/" + batchCode,
    method: 'get',
  })
}

// 根据检测登记id编辑信息
export function testUpadte(data, id) {
  return request({
    url: '/system/assetsTestRecord/update/' + id,
    method: 'post',
    data: data
  })
}

// 根据工器具id,和批次号登记检测信息
export function testRegister(data) {
  return request({
    url: '/system/assetsTestRecord/register?',
    method: 'post',
    data: data
  })
}

// 字典查询
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/' + dict,
    method: 'get',
  })
}
