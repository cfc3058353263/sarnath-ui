import request from '@/utils/request'

// 根据开始时间和结束时间获取周报列表:日期传2020-01-01到2020-01-07 必须是7的倍数
export function getWeekWindDataList(query) {
  return request({
    url: '/system/operationDataDayWind/getWeekWindDataList',
    method: 'get',
    params: query
  })
}

