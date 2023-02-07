import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/sarnath";

// 已发布列表
export function publishListData(query) {
  return request({
    url: '/workflow/activiti_process/listData',
    method: 'get',
    params: query
  })
}

//获取节点
export function getProcessNode(data) {
  return request({
    url: '/workflow/activiti_process/getProcessNode',
    method: 'post',
    data: data
  })
}

// 已发布模型删除
export function publishDelByIds(data) {
  return request({
    url: '/workflow/activiti_process/delByIds',
    method: 'post',
    data: data
  })

}
