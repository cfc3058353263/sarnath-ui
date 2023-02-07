import request from '@/utils/request'
// 电站分布
export function getStationArea() {
  return request({
    url: '/system/home/stationArea',
    method: 'get',
  })
}
// 电站信息统计
export function getStationSummary() {
  return request({
    url: '/system/home/stationSummary',
    method: 'get',
  })
}

// 发电量完成情况
export function getPlantKwhLoss(query) {
  return request({
    url: '/system/home/plantKwhLoss',
    method: 'get',
    params: query
  })
}

// 列表
export function getPowerPlant(query) {
  return request({
    url: '/system/home/powerPlant',
    method: 'get',
    params: query
  })
}


// 列表
export function getDistributionFault(query) {
  return request({
    url: '/system/home/distributionFault',
    method: 'get',
    params: query
  })
}
//同期日均MW发电量对比
export function getPlantKWhGrowth(query) {
  return request({
    url: '/system/home/plantKwhGrowth',
    method: 'get',
    params: query
  })
}
//发电分析
export function getGetMwkWhLossh(query) {
  return request({
    url: '/system/home/getMwkWhLoss',
    method: 'get',
    params: query
  })
}
//电站月发电效率及完成率分布
export function getPowerRatio(query) {
  return request({
    url: '/system/home/powerRatio',
    method: 'get',
    params: query
  })
}
