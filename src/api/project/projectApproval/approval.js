import request from '@/utils/request'

// 查询项目列表
export function getProjectList(query) {
  return request({
    url: '/system/maintainProject/getProjectList',
    method: 'get',
    params: query
  })
}
// 根据用户选择电站查询当前电站下所有用户
export function getUserListByStationId(stationId){
  return request({
    url: '/system/user/getUserByStationId/' + stationId,
    method: 'get',
  })
}
// 根据项目类型获取实施厂家列表
export function getSupList(sup){
  return request({
    url: '/system/assetSupplier/getSupplierByType',
    method: 'get',
    params: sup
  })
}

export function addProject(data){
  return request({
    url: '/system/maintainProject/addProject',
    method: 'post',
    data: data
  })
}

export function projectCheckSuccess(ids){
  return request({
    url: '/system/maintainProject/projectcheckSuccess/' + ids,
    method: 'post',
  })
}

export function getProjectByProjectId(id){
  return request({
    url: '/system/maintainProject/getProjectByProjectId/' + id,
    method: 'get',
  })
}

export function modifyProject(data){
  return request({
    url: '/system/maintainProject/modifyProject/' + data.projectId,
    method: 'put',
    data: data
  })
}

export function delProject(id){
  return request({
    url: '/system/maintainProject/deleteProject/' + id,
    method: 'delete',
  })
}
