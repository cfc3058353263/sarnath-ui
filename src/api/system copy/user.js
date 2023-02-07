import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/sarnath";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'post',
    data: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, passWord) {
  const data = {
    userId,
    passWord
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

 // 查询用户的电站列表
export function getUserStation(userId) {
  return request({
    url: '/system/sysUserStation/getUserStation/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 查询所有电站
export function stationTreeselect() {
  return request({
    url: '/system/sysPowerStation/treeselect',
    method: 'get'
  })
}

//修改用户电站权限
export function updateUserStation(data) {
  return request({
    url: '/system/sysUserStation',
    method: 'put',
    data: data
  })
}

// 查询所有用户
export function userSelectList() {
  return request({
    url: '/system/user/selectlist',
    method: 'get'
  })
}





