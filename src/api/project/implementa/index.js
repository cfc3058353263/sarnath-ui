import request from '@/utils/request'

// 查询项目列表
export function getProjectList(query) {
  return request({
    url: '/system/maintainProject/getProjectList',
    method: 'get',
    params: query
  })
}

// 分页查询非新建状态的项目列表
export function getProjectListByStatusNotXj(query) {
  return request({
    url: '/system/maintainProject/getProjectListByStatusNotXj',
    method: 'get',
    params: query
  })
}

// 根据用户选择电站查询当前电站下所有用户
export function projectCheck(files){
  return request({
    url: '/system/maintainProject/projectCheck',
    method: 'post',
    data: files
  })
}
// 根据项目类型获取实施厂家列表
export function projectClose(ids){
  return request({
    url: '/system/maintainProject/projectClose/' + ids,
    method: 'post',
  })
}

export function getTaskListByProjectId(projectId){
  return request({
    url: '/system/maintainProjectTask/getTaskListByProjectId/' + projectId,
    method: 'get',
  })
}

export function addTask(data){
  return request({
    url: '/system/maintainProjectTask/addTask/' + data.projectId,
    method: 'post',
    data: data
  })
}

export function getTaskByTaskId(taskId){
  return request({
    url: '/system/maintainProjectTask/getTaskByTaskId/' + taskId,
    method: 'get',
  })
}

export function modifyTask(data){
  return request({
    url: '/system/maintainProjectTask/modifyTask/' + data.taskId,
    method: 'post',
    data: data
  })
}

export function deleteTask(taskId){
  return request({
    url: '/system/maintainProjectTask/deleteTask/' + taskId,
    method: 'delete',
  })
}

export function getLogByLogId(logId){
  return request({
    url: '/system/maintainProjectTaskLogs/getLogsByLogsId/' + logId,
    method: 'get',
  })
}

export function getLogsByTaskId(taskId){
  return request({
    url: '/system/maintainProjectTaskLogs/getLogsByTaskId/' + taskId,
    method: 'get',
  })
}

export function addLog(data){
  return request({
    url: '/system/maintainProjectTaskLogs/addLogs/' + data.taskId,
    method: 'post',
    data: data
  })
}

export function modifyLog(data){
  return request({
    url: '/system/maintainProjectTaskLogs/modifyLogs/' + data.logId,
    method: 'post',
    data: data
  })
}

export function deleteLog(logId){
  return request({
    url: '/system/maintainProjectTaskLogs/deleteLogs/' + logId,
    method: 'delete',
  })
}

