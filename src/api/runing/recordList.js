// 记录查询
import request from '@/utils/request'

// 巡检记录查询分页接口
export function getInspection(query) {
  return request({
    url: '/system/patrolPlanRecord/recordList',
    method: 'get',
    params: query
  })
}
// 获取工单分页列表
export function getHandleIssueOrderByPage(query) {
  return request({
    url: '/system/issueOrder/getHandleIssueOrderByPage',
    method: 'get',
    params: query
  })
}

// 获取项目分页列表
export function getProjectList(query) {
  return request({
    url: '/system/maintainProject/getProjectAndLogsByLogCreateTime',
    method: 'get',
    params: query
  })
}

// 字典查询
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/'+dict,
    method: 'get',
  })
}
