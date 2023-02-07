import request from '@/utils/request'

/**全局公用请求实现类 */


/** 根据类型查询是否已经启用了编码 
 * 编码对应参考字典管理--》编码类型
 * 设备编号     1
 * 工器具编号   2
 * 备品编号     3
 * 工单编号     4
 * 工作票编号   5
 * 操作票编号   6
*/
export function getIsEnableCode(dictValue) {
  return request({
    url: '/system/sysCodeConfig/get/'+dictValue,
    method: 'get',
  })
}

/** 获取数据字典 */
export function getdictList(dict) {
  return request({
    url: '/system/dict/data/type/'+dict,
    method: 'get',
  })
}

/** 获取当前用户电站接口 */
export function getStationByUser(query) {
  return request({
    url: '/system/user/getStationByUser',
    method: 'get',
    params:query
  })
}

/** 获取当前用户电站接口 */
export function getPowerAllSummary() {
  return request({
    url: '/system/home/powerAllSummary',
    method: 'get',
  })
}
