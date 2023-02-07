import request from '@/utils/request'

// 根据开始时间和结束时间查询日报信息:日期传2020-01-01格式
export function getMonthWindDataList(query) {
  return request({
    url: '/system/operationReportData/getMonthDataList',
    method: 'get',
    params: query
  })
}

// /operationPlanDay/getPlanDayById
// 根据合同号id和月份时间获取日报信息
export function getPlanDay(query) {
  return request({
    url: '/system/operationPlanDay/getPlanDayById',
    method: 'get',
    params: query
  })
}
