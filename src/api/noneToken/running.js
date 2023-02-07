import request from '@/utils/request'

// 无需token的请求

//获取 光伏 日报详情接口
export function getSolarDayDataDetailById(query) {
    return request({
        url: '/system/noneTokenApi/getSolarDayDataDetailById',
        method: 'get',
        params: query
    });
}

// 巡检记录查询分页接口
export function getInspection(query) {
    return request({
        url: '/system/noneTokenApi/recordList',
        method: 'get',
        params: query
    })
}

// 获取工单分页列表
export function getHandleIssueOrderByPage(query) {
    return request({
        url: '/system/noneTokenApi/getHandleIssueOrderByPage',
        method: 'get',
        params: query
    })
}


// 获取项目分页列表
export function getProjectList(query) {
    return request({
        url: '/system/noneTokenApi/getProjectAndLogsByLogCreateTime',
        method: 'get',
        params: query
    })
}