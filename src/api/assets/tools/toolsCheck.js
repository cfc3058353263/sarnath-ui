import request from '@/utils/request'


export function getList(query) {
  return request({
    url: '/system/assetsTools/toolsCheckList',
    method: 'get',
    params: query
  })
}

//获取安全工器具送检表
export function getCheckList(query) {
  return request({
    url: '/system/assetsTools/getCheckList',
    method: 'get',
    params: query
  })
}

//保存
export function getAdd(data) {
  return request({
    url: '/system/assetsTools/bachCheck',
    method: 'post',
    data:data
  })
}


//删除
export function deleteList(ids) {
  return request({
    url: '/system/assetsTestRecord/deleteCheck/' + ids,
    method: 'delete'
  })
}
