/**
 * 计划接口实现类
 */
import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";



// 查询列表
export function listData(query) {
  return request({
    url: '/system/patrolPlanRecord/listPage',
    method: 'get',
    params: query
  })
}

// 删除
export function removeData(id) {
  return request({
    url: '/system/patrolPlanRecord/' + id,
    method: 'delete'
  })
}




// 查询详细
export function getInfo(id) {
  return request({
    url: '/system/patrolPlanRecord/' + parseStrEmpty(id),
    method: 'get'
  })
}

// 查询方案详细
export function getTmpInfo(id) {
  return request({
    url: '/system/patrolTemplate/' + parseStrEmpty(id),
    method: 'get'
  })
}



// 新增
export function add(data) {
  return request({
    url: '/system/patrolPlanRecord',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/patrolPlanRecord',
    method: 'put',
    data: data
  })
}

export function getdeviceList(id) {
  return request({
    url: '/system/patrolPlanRecord/deviceList/'+ parseStrEmpty(id),
    method: 'get'
  })
}


// 查询列表 根据设备查询巡检记录
export function recordList(query) {
  return request({
    url: '/system/patrolPlanRecord/recordList',
    method: 'get',
    params: query
  })
}


//获取图片预览地址
export function preView(data) {
  return request({
    url: '/file/previewList',
    method: 'post',
    data:data
  })
}
