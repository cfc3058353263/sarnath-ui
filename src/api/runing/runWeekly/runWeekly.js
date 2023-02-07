import request from '@/utils/request'

// 根据开始时间和结束时间获取周报列表:日期传2020-01-01到2020-01-07 必须是7的倍数
export function getList(query) {
  return request({
    url: '/system/operationPlanDay/listWeek',
    method: 'get',
    params: query
  })
}

// 根据合同号id和月份时间获取日报信息
export function getPlanDay(query) {
  return request({
    url: '/system/operationPlanDay/list',
    method: 'get',
    params: query
  })
}

// 以上是原先新的系统接口
// 以下是旧系统接口
export function getWeekDataList(query) {
  return request({
    url: '/system/operationReportData/getWeekDataList',
    method: 'get',
    params: query
  })
}
export function getWeekInfoData(query) {
  return request({
    url: '/system/operationReportData/getWeekInfoData',
    method: 'get',
    params: query
  })
}
// 发送日报邮件：传日报id和接收方邮件地址和邮件主题和邮件详情地址
export function sendMail(data) {
  return request({
    url: '/system/operationDayData/sendMailWeek',
    method: 'put',
    data:data
  })
}

