import request from '@/utils/request'

// 计算 光伏发电效率
export function calculateSolarRatio(query) {
  return request({
    url: '/system/operationDayData/calculateSolarRatio',
    method: 'get',
    params: query
  })
}

// 添加日报接口
export function addDayData(data) {
  return request({
    url: '/system/operationDayData/addDayData',
    method: 'post',
    data: data
  });
}

// 修改日报接口
export function updateDayData(id, data) {
  return request({
    url: '/system/operationDayData/updateDayData/' + id,
    method: 'put',
    data: data
  });
}

//提交日报接口
export function submitDayData(id) {
  return request({
    url: '/system/operationDayData/submitDayData/' + id,
    method: 'put',
  });
}

// 删除日报接口
export function deleteDayData(ids) {
  return request({
    url: '/system/operationDayData/deleteDayData/' + ids,
    method: 'delete',
  });
}


//获取日报列表接口
export function getDayDataList(query) {
  return request({
    url: '/system/operationDayData/getDayDataList',
    method: 'get',
    params: query
  });
}

//获取 光伏 日报详情接口
export function getSolarDayDataDetail(id) {
  return request({
    url: '/system/operationDayData/getSolarDayDataDetail/'+id,
    method: 'get',
  });
}

//获取 风电 日报详情接口
export function getWindDayDataDetail(id) {
  return request({
    url: '/system/operationDayData/getWindDayDataDetail/'+id,
    method: 'get',
  });
}


//获取保存日报信息
export function getpreservationInfo(data) {
  return request({
    url: '/system/dayReportCorrect/save',
    method: 'post',
    data:data
  })
}

//获取提交日报信息
export function getSubmitInfo(data) {
  return request({
    url: '/system/dayReportCorrect/submit',
    method: 'put',
    data:data
  })
}