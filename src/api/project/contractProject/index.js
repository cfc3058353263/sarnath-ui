import request from '@/utils/request'

// 查询合同项目列表
export function getContractProjectList(query) {
  return request({
    url: '/system/maintainContractProject/getContractProjectList',
    method: 'get',
    params: query
  })
}

// 根据用户选择电站查询当前电站下所有用户
export function getContractProjectById(id){
  return request({
    url: '/system/maintainContractProject/getContractProjectById/' + id,
    method: 'get',
  })
}

export function saveContractProject(data){
  return request({
    url: '/system/maintainContractProject/saveContractProject/' +data.id,
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
