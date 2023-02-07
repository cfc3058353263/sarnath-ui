import request from '@/utils/request'
// 提交工单
export function addIssueOrder(params) {
    return request({
      url: '/system/issueOrder/addIssueOrder',
      method: 'post',
      data: params
    })
  }
  