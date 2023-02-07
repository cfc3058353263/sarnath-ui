import request from '@/utils/request'

// 获取预警分页列表
export function getList(query) {
    return request({
        url: '/system/stationWarning/stationWarningListPage',
        method: 'get',
        params: query
    })
}
// 新增预警
export function addWain(params) {
    return request({
        url: '/system/stationWarning/createStationWarning',
        method: 'post',
        data: params
    })
}

// 修改预警
export function updateWain(params) {
    return request({
        url: '/system/stationWarning/updateStationWarning',
        method: 'post',
        data: params
    })
}
export function changeType(id) {
    return request({
        url: '/system/stationWarning/updateStationWarningIsEnable/'+id,
        method: 'post',
    })
}