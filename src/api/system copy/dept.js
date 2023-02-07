import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/sysDepartment/like',
    method: 'get',
    params: query
  })
}

// 修改部门
export function updateDept(id,data) {
  return request({
    url: '/system/sysDepartment/update/'+id,
    method: 'put',
    data: data
  })
}
// 新增部门
export function addDept(data) {
  return request({
    url: '/system/sysDepartment/add',
    method: 'post',
    data: data
  })
}

// 查询部门下拉树结构 下拉框用
export function treeselectInput() {
  return request({
    url: '/system/sysDepartment/treeselect',
    method: 'get'
  })
}

// 查询部门下拉树结构
export function treeselect() {
  return request({
    url: '/system/sysDepartment/tree',
    method: 'get'
  })
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
  return request({
    url: '/system/dept/roleDeptTreeselect/' + roleId,
    method: 'get'
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/sysDepartment/delete/' + deptId,
    method: 'delete'
  })
}