import request from '@/utils/request'

// 新增日报
export function addWindDayData(data) {
  return request({
    url: '/system/operationPlanDayWind/addWindDayData',
    method: 'post',
    data: data
  })
}

// 获取日报数据列表
export function getWindDayPlanAndData(query) {
  return request({
    url: '/system/operationPlanDayWind/getWindDayPlanAndData',
    method: 'get',
    params: query
  })
}

// 提交日报数据
export function submitWindReport(id) {
  return request({
    url: '/system/operationPlanDayWind/submitWindReport/' + id,
    method: 'put',
  })
}

// 删除日报数据
export function deleteWindReport(ids) {
  return request({
    url: '/system/operationPlanDayWind/deleteWindReport/' + ids,
    method: 'delete',
  })
}

// 更新日报数据
export function updateWindDayData(id, data) {
  return request({
    url: '/system/operationPlanDayWind/updateWindDayData/' + id,
    method: 'put',
    data: data
  })
}

//根据合同id获取当月日报列表
export function getDayListByContractId(query) {
  return request({
    url: '/system/operationPlanDayWind/getDayListByContractId',
    method: 'get',
    params: query
  })
}

//获取日报详情
export function getDayDetailByContractId(query) {
  return request({
    url: '/system/operationPlanDayWind/getDayDetailByContractId',
    method: 'get',
    params: query
  })
}

export function sendDayDetail(mailTo, data) {
  return request({
    url: '/system/operationPlanDayWind/sendDayDetail/' + mailTo,
    method: 'put',
    data: data
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

export function exportDayReport() {

}

