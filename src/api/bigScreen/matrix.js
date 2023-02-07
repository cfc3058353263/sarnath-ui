import request from '@/utils/request'

// export function listNoPageDevice(query) {
//     return request({
//         url: '/system/stationMonitor/device/listNoPage',
//         method: 'get',
//         params: query
//     })
// }
export function listNoPageDevice(query) {
    return request({
        url: '/system/stationMonitor/device/selectStationMatrixInfoList',
        method: 'get',
        params: query
    })
}