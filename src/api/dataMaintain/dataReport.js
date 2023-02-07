import request from '@/utils/request'

//获取日报一览
export function getDayDataReport(query) {
  return request({
    url: '/analysis/dataReportView/getDayDataReport',
    method: 'get',
    params: query
  })
}

//获取月报一览
export function getMonthDataReport(query) {
  return request({
    url: '/analysis/dataReportView/getMonthDataReport',
    method: 'get',
    params: query
  })
}
