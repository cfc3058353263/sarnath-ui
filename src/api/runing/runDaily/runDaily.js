import request from '@/utils/request'

// 统计分析 电站发电量统计
export function getPowerGeneration(query) {
  return request({
    url: '/analysis/powerGeneration/listPage',
    method: 'get',
    params: query
  })
}

// 根据开始时间和结束时间查询日报信息
export function getList(query) {
  // operationPlanMonth/list
  return request({
    url: '/system/operationPlanDay/list',
    method: 'get',
    params: query
  })
}

// 新增日报
export function addDaily(data) {
  return request({
    url: '/system/operationPlanDay/add',
    method: 'post',
    data: data
  })
}

//删除日报
// /operationPlanDay/delete/{id}
export function deleteDaily(id) {
  return request({
    url: '/system/operationPlanDay/delete/'+id,
    method: 'delete',
  })
}

// 编辑未提交的日报
export function updateDaily(id,data) {
  return request({
    url: '/system/operationPlanDay/update/'+id,
    method: 'put',
    data: data
  })
}

// 提交的日报
export function saveDaily(id,data) {
  return request({
    url: '/system/operationPlanDay/save/'+id,
    method: 'put'
  })
}

//日报查看中获取月报和年报 detailDay/{id}}
export function detailDay(id) {
  return request({
    url: '/system/operationPlanDay/detailDay/'+id,
    method: 'get'
  })
}

//发送邮件/operationPlanDay/sendMail/{mailTo}/{dayId}
// 发送日报邮件：传日报id和接收方邮件地址和邮件主题和邮件详情地址
export function sendMail(mailTo,dayId) {
  return request({
    url: '/system/operationDayData/sendMail/'+mailTo+"/"+dayId,
    method: 'put'
  })
}

//获取获取日报信息
export function getDayInfo(query) {
  return request({
    url: '/system/dayReportCorrect/correctByDayReportId',
    method: 'get',
    params:query
  })
}
