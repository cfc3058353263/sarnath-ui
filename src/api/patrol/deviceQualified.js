/**
 * 计划接口实现类
 */
import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";



// 查询列表
export function listData(query) {
  return request({
    url: '/system/patrolPlanRecord/deviceQualified',
    method: 'get',
    params: query
  })
}

// 查询列表
export function listDetailData(query) {
  return request({
    url: '/system/patrolPlanRecord/deviceQualifiedDetail',
    method: 'get',
    params: query
  })
}
