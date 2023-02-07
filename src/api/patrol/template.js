/**
 * 方案接口实现类
 */
import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";



// 查询列表
export function listData(query) {
  return request({
    url: '/system/patrolTemplate/listPage',
    method: 'get',
    params: query
  })
}



// 查询详细
export function getInfo(id) {
  return request({
    url: '/system/patrolTemplate/' + parseStrEmpty(id),
    method: 'get'
  })
}


// 新增
export function add(data) {
  return request({
    url: '/system/patrolTemplate',
    method: 'post',
    data: data
  })
}

// 修改
export function update(data) {
  return request({
    url: '/system/patrolTemplate',
    method: 'put',
    data: data
  })
}

// 修改
export function updateForm(data) {
  return request({
    url: '/system/patrolTemplate/changeForm',
    method: 'post',
    data: data
  })
}

// 删除
export function removeData(id) {
  return request({
    url: '/system/patrolTemplate/' + id,
    method: 'delete'
  })
}

// 修改状态 ids,type
export function updateStatus(data) {
  return request({
    url: '/system/patrolTemplate/changeStatus',
    method: 'post',
    params: data
  })
}





// 查询计划详细
export function getInfoPlan(id) {
  return request({
    url: '/system/patrolPlan/' + parseStrEmpty(id),
    method: 'get'
  })
}


