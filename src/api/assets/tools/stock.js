import request from '@/utils/request'

// 获取库存列表分页查询
export function stockList(query) {
  return request({
    url: '/system/assetsTools/likeRepertory',
    method: 'get',
    params: query
  })
}

//根据工器具id获取近一年的库存记录
export function stockRepertory(query) {
  return request({
    url: '/system/assetsTools/getRepertory',
    method: 'get',
    params: query
  })
}
//根据工器具id获取近一年的入库记录
export function stockIn(query) {
  return request({
    url: '/system/assetsTools/getIn',
    method: 'get',
    params: query
  })
}
//根据工器具id获取近一年的出口记录
export function stockoyt(query) {
  return request({
    url: '/system/assetsTools/getOut',
    method: 'get',
    params: query
  })
}
//根据工器具id获取近一年的检测记录
export function stockTest(query) {
  return request({
    url: '/system/assetsTools/getTest',
    method: 'get',
    params: query
  })
}
// 字典查询
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/' + dict,
    method: 'get',
  })
}
