import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import TopNav from '@/TopNavigation'
import ParentView from '@/components/ParentView';

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

export const parentRoutes = [ //父级菜单路由
  {
    path: '/light',
    component: TopNav,
    hidden: true,
    children: []
  },
  {
    path: '/wind',
    component: TopNav,
    hidden: true,
    children: []
  },
  {
    path: '/statistics',
    component: TopNav,
    hidden: true,
    children: []
  },
  {
    path: '/system',
    component: TopNav,
    hidden: true,
    children: []
  },
]

// 公共路由
export const constantRoutes = [
  {
    path: '/index',
    component: (resolve) => require(['@/views/index'], resolve),
    name: '首页',
    meta: { title: '首页', icon: 'dashboard', noCache: true, breadcrumb: false }
  },
  // { //首页
  //   path: '',
  //   component: Layout,
  //   redirect: 'index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: (resolve) => require(['@/views/index'], resolve),
  //       name: '首页',
  //       meta: { title: '首页', icon: 'dashboard', noCache: true, breadcrumb: false }
  //     },
  //     {
  //       path: '/stationIndex',
  //       component: (resolve) => require(['@/views/bigScreen/station'], resolve),
  //       hidden: true
  //     }, 
  //     { //方阵
  //       path: '/matrix',
  //       component: (resolve) => require(['@/views/bigScreen/matrix'], resolve),
  //       hidden: true
  //     },
  //     { //方阵详情
  //       path: '/matrixDetail',
  //       component: (resolve) => require(['@/views/bigScreen/matrixDetail'], resolve),
  //       hidden: true
  //     },
  //     { //逆变器详情
  //       path: '/inverterDetail',
  //       component: (resolve) => require(['@/views/bigScreen/matrixDetail/inverter/inverterDetail'], resolve),
  //       hidden: true
  //     },
  //   ]
  // },
  { //光伏运维首页
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'light',
        component: (resolve) => require(['@/views/light'], resolve),
        name: '光伏首页',
        meta: { title: '光伏首页', icon: 'dashboard', noCache: true, breadcrumb: false }
      }
    ]
  },
  { //风电运维首页
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'wind',
        component: (resolve) => require(['@/views/wind'], resolve),
        name: '风电首页',
        meta: { title: '风电首页', icon: 'dashboard', noCache: true, breadcrumb: false }
      }
    ]
  },
  { //道生电站首页
    path: '/stationIndex',
    component: (resolve) => require(['@/views/bigScreen/station'], resolve),
    hidden: true
  },
  { //方阵
    path: '/matrix',
    component: (resolve) => require(['@/views/bigScreen/matrix'], resolve),
    hidden: true
  },
  { //方阵详情
    path: '/matrixDetail',
    component: (resolve) => require(['@/views/bigScreen/matrixDetail'], resolve),
    hidden: true
  },
  { //逆变器详情
    path: '/inverterDetail',
    component: (resolve) => require(['@/views/bigScreen/matrixDetail/inverter/inverterDetail'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },

  /**
   * 静态的页面，无需登陆
   */
  {
    path: '/staticView/dayReportInfo',
    component: (resolve) => require(['@/views/staticView/dayReportInfo'], resolve),
    hidden: true
  },


  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  /**system */
  {
    path: '/system/system',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'station/data',
        component: (resolve) => require(['@/views/system/station/data'], resolve),
        name: 'stationDetails',
        meta: { title: '电站详情', icon: '', noCache: true }
      },
      {
        path: 'station/capacity',
        component: (resolve) => require(['@/views/system/station/capacity'], resolve),
        name: 'capacity',
        meta: { title: '装机容量', icon: '', noCache: true }
      },
      {
        path: 'station/devcieConfig',
        component: (resolve) => require(['@/views/system/station/devcieConfig'], resolve),
        name: 'devcieConfig',
        meta: { title: '设备管理', icon: '', noCache: true }
      },
      {
        path: 'station/deviceParams',
        component: (resolve) => require(['@/views/system/station/deviceParams'], resolve),
        name: 'deviceParams',
        meta: { title: '设备测点管理', icon: '', noCache: true }
      },
    ]
  },
  /**system */
  // 光伏资产详细页面路由
  {
    path: '/light/assets',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'devices/info',
        component: (resolve) => require(['@/views/assets/devices/info'], resolve),
        name: 'devicesinfo',
        meta: { title: '设备详情', icon: '', noCache: true }
      },
      {
        path: 'supplier/info',
        component: (resolve) => require(['@/views/assets/supplier/info'], resolve),
        name: 'SupplierInfo',
        meta: { title: '供应商详情', icon: '', noCache: true }
      },
      {
        path: 'wareHouse/data',
        component: (resolve) => require(['@/views/assets/tools/wareHouse/data'], resolve),
        name: 'wareInfo',
        meta: { title: '工器具入库', icon: '', noCache: true }
      },
      {
        path: 'spare/ledgerinfo',
        component: (resolve) => require(['@/views/assets/spare/ledger/info'], resolve),
        name: 'spareledgerinfo',
        meta: { title: '备品盘点详情', icon: '', noCache: true }
      },
      {
        path: 'stock/data',
        component: (resolve) => require(['@/views/assets/tools/stock/data'], resolve),
        name: 'stockInfo',
        meta: { title: '工器具盘点详情', icon: '', noCache: true }
      },
      {
        path: 'stock/test',
        component: (resolve) => require(['@/views/assets/tools/stock/test'], resolve),
        name: 'stockTest',
        meta: { title: '检测登记', icon: '', noCache: true }
      },
      {
        path: 'outHouse/data',
        component: (resolve) => require(['@/views/assets/tools/outHouse/data'], resolve),
        name: 'outInfo',
        meta: { title: '工器具出库', icon: '', noCache: true }
      },
      {
        path: 'spare/entryStore/data',
        component: (resolve) => require(['@/views/assets/spare/entryStore/data'], resolve),
        name: 'spareentrystoredata',
        meta: { title: '备品信息', icon: '' }
      },
      {
        path: 'spare/outStore/data',
        component: (resolve) => require(['@/views/assets/spare/outStore/data'], resolve),
        name: 'spareOutStoreInfo',
        meta: { noCache: true, title: '备品出库信息', icon: '' }
      },
      {
        path: 'toolsCheck/inspection',
        component: (resolve) => require(['@/views/assets/tools/toolsCheck/inspection'], resolve),
        name: 'inspection',
        meta: { noCache: true, title: '新增安全工具送检', icon: '' }
      }
    ]
  },
  // 风电资产详细页面路由
  {
    path: '/wind/assets',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'devices/info',
        component: (resolve) => require(['@/views/assets/devices/info'], resolve),
        name: 'devicesinfo',
        meta: { title: '设备详情', icon: '', noCache: true }
      },
      {
        path: 'supplier/info',
        component: (resolve) => require(['@/views/assets/supplier/info'], resolve),
        name: 'SupplierInfo',
        meta: { title: '供应商详情', icon: '', noCache: true }
      },
      {
        path: 'wareHouse/data',
        component: (resolve) => require(['@/views/assets/tools/wareHouse/data'], resolve),
        name: 'wareInfo',
        meta: { title: '工器具入库', icon: '', noCache: true }
      },
      {
        path: 'spare/ledgerinfo',
        component: (resolve) => require(['@/views/assets/spare/ledger/info'], resolve),
        name: 'spareledgerinfo',
        meta: { title: '备品盘点详情', icon: '', noCache: true }
      },
      {
        path: 'stock/data',
        component: (resolve) => require(['@/views/assets/tools/stock/data'], resolve),
        name: 'stockInfo',
        meta: { title: '详情', icon: '', noCache: true }
      },
      {
        path: 'stock/test',
        component: (resolve) => require(['@/views/assets/tools/stock/test'], resolve),
        name: 'stockTest',
        meta: { title: '检测登记', icon: '', noCache: true }
      },
      {
        path: 'outHouse/data',
        component: (resolve) => require(['@/views/assets/tools/outHouse/data'], resolve),
        name: 'outInfo',
        meta: { title: '工器具出库', icon: '', noCache: true }
      },
      {
        path: 'spare/entryStore/data',
        component: (resolve) => require(['@/views/assets/spare/entryStore/data'], resolve),
        name: 'spareentrystoredata',
        meta: { title: '备品信息', icon: '' }
      },
      {
        path: 'spare/outStore/data',
        component: (resolve) => require(['@/views/assets/spare/outStore/data'], resolve),
        name: 'spareOutStoreInfo',
        meta: { noCache: true, title: '备品出库信息', icon: '' }
      },
      {
        path: 'toolsCheck/inspection',
        component: (resolve) => require(['@/views/assets/tools/toolsCheck/inspection'], resolve),
        name: 'inspection',
        meta: { noCache: true, title: '新增安全工具送检', icon: '' }
      }
    ]
  },
  // 光伏运行管理
  {
    path: '/light/runing',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'electr/planMonth',
        component: (resolve) => require(['@/views/runing/electr/planMonth'], resolve),
        name: 'planMonth',
        meta: { title: '新增合同', icon: '', noCache: true }
      },
      {
        path: 'electr/monthUpdate',
        component: (resolve) => require(['@/views/runing/electr/monthUpdate'], resolve),
        name: 'monthUpdate',
        meta: { title: '月计划修改', icon: '', noCache: true }
      },
      {
        path: 'runDaily/info',
        component: (resolve) => require(['@/views/runing/runDaily/info'], resolve),
        name: 'dailyInfo',
        meta: { title: '查看日报', icon: '', noCache: true }
      },
      {
        path: 'runWeekly/info',
        component: (resolve) => require(['@/views/runing/runWeekly/info'], resolve),
        name: 'weeklyInfo',
        meta: { title: '查看周报', icon: '', noCache: true }
      },
      {
        path: 'runMonthly/info',
        component: (resolve) => require(['@/views/runing/runMonthly/info'], resolve),
        name: 'MonthlyInfo',
        meta: { title: '查看月报', icon: '', noCache: true }
      },
    ]
  },
  // 风行运行管理
  {
    path: '/wind/runningWind',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'contract/PlanMonthWind',
        component: (resolve) => require(['@/views/runningWind/contract/PlanMonthWind'], resolve),
        name: 'PlanMonthWind',
        meta: { title: '月计划', icon: '', noCache: true }
      },
      {
        path: 'contract/MonthUpdate',
        component: (resolve) => require(['@/views/runningWind/contract/MonthUpdate'], resolve),
        name: 'WindMonthUpdate',
        meta: { title: '月计划修改', icon: '', noCache: true }
      },
      {
        path: 'reportDay/info',
        component: (resolve) => require(['@/views/runningWind/reportDay/info'], resolve),
        name: 'windDayReportInfo',
        meta: { title: '查看日报', icon: '', noCache: true }
      },
      {
        path: 'reportWeek/info',
        component: (resolve) => require(['@/views/runningWind/reportWeek/info'], resolve),
        name: 'windWeekReportInfo',
        meta: { title: '查看周报', icon: '', noCache: true }
      },
      {
        path: 'reportMonth/info',
        component: (resolve) => require(['@/views/runningWind/reportMonth/info'], resolve),
        name: 'windMonthReportInfo',
        meta: { title: '查看月报', icon: '', noCache: true }
      },
    ]
  },
  // 光伏工单
  {
    path: '/light/issue',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'submit/data',
        component: (resolve) => require(['@/views/issue/submit/data'], resolve),
        name: 'issueSubmitData',
        meta: { title: '提交工单', icon: '', noCache: true }
      },
      {
        path: 'handle/data',
        component: (resolve) => require(['@/views/issue/handle/data'], resolve),
        name: 'issueHandleData',
        meta: { title: '处理工单', icon: '', noCache: true }
      },
      {
        path: 'handle/info',
        component: (resolve) => require(['@/views/issue/handle/info'], resolve),
        name: 'issueHandleInfo',
        meta: { title: '工单信息查看', icon: '', noCache: true }
      },
    ]
  },
  // 风电工单
  {
    path: '/wind/issue',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'submit/data',
        component: (resolve) => require(['@/views/issue/submit/data'], resolve),
        name: 'issueSubmitData',
        meta: { title: '提交工单', icon: '', noCache: true }
      },
      {
        path: 'handle/data',
        component: (resolve) => require(['@/views/issue/handle/data'], resolve),
        name: 'issueHandleData',
        meta: { title: '处理工单', icon: '', noCache: true }
      },
      {
        path: 'handle/info',
        component: (resolve) => require(['@/views/issue/handle/info'], resolve),
        name: 'issueHandleInfo',
        meta: { title: '工单信息查看', icon: '', noCache: true }
      },
    ]
  },
  // 光伏巡检
  {
    path: '/light/patrol',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'plan/selectTemp',
        component: (resolve) => require(['@/views/patrol/plan/selectTemp'], resolve),
        name: 'selectTemp',
        meta: { title: '方案计划', icon: '', noCache: true }
      },
      {
        path: 'plan/selectNew',
        component: (resolve) => require(['@/views/patrol/plan/selectNew'], resolve),
        name: 'selectNew',
        meta: { title: '新建计划', icon: '', noCache: true }
      },
      {
        path: 'plan/info',
        component: (resolve) => require(['@/views/patrol/plan/info'], resolve),
        name: 'planInfo',
        meta: { title: '计划详情', icon: '', noCache: true }
      },
      {
        path: 'record/info',
        component: (resolve) => require(['@/views/patrol/record/record'], resolve),
        name: 'recordInfo',
        meta: { title: '巡检详情', icon: '', noCache: true }
      },
      {
        path: 'deviceQualified/info',
        component: (resolve) => require(['@/views/patrol/analysis/deviceQualifiedDetail'], resolve),
        name: 'deviceQualifiedDetail',
        meta: { title: '设备合格率详情', icon: '', noCache: true }
      }

    ]
  },
  // 风电巡检
  {
    path: '/wind/patrol',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'plan/selectTemp',
        component: (resolve) => require(['@/views/patrol/plan/selectTemp'], resolve),
        name: 'selectTemp',
        meta: { title: '方案计划', icon: '', noCache: true }
      },
      {
        path: 'plan/selectNew',
        component: (resolve) => require(['@/views/patrol/plan/selectNew'], resolve),
        name: 'selectNew',
        meta: { title: '新建计划', icon: '', noCache: true }
      },
      {
        path: 'plan/info',
        component: (resolve) => require(['@/views/patrol/plan/info'], resolve),
        name: 'planInfo',
        meta: { title: '计划详情', icon: '', noCache: true }
      },
      {
        path: 'record/info',
        component: (resolve) => require(['@/views/patrol/record/record'], resolve),
        name: 'recordInfo',
        meta: { title: '巡检详情', icon: '', noCache: true }
      },
      {
        path: 'deviceQualified/info',
        component: (resolve) => require(['@/views/patrol/analysis/deviceQualifiedDetail'], resolve),
        name: 'deviceQualifiedDetail',
        meta: { title: '设备合格率详情', icon: '', noCache: true }
      }

    ]
  },
  {
    path: '/recordapp',
    component: (resolve) => require(['@/views/patrol/record/recordapp'], resolve),
    name: 'recordInfoapp',
    meta: { title: '巡检填报', icon: '', noCache: true }
  },
  {
    path: '/recordappinfo',
    component: (resolve) => require(['@/views/patrol/record/recordAppInfo'], resolve),
    name: 'recordInfoappi',
    meta: { title: '巡检填报', icon: '', noCache: true }
  },
  //光伏项目管理
  {
    path: '/light/project',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'projectApproval/index',
        component: (resolve) => require(['@/views/project/projectApproval/index'], resolve),
        name: 'projectApproval',
        meta: { title: '项目立项', icon: '', noCache: true }
      },
      {
        path: 'implementa/projectTrack',
        component: (resolve) => require(['@/views/project/implementa/projectTrack'], resolve),
        name: 'projectTrack',
        meta: { title: '项目跟踪', icon: '', noCache: true }
      },
    ]
  },
  //风电项目管理
  {
    path: '/wind/project',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'projectApproval/index',
        component: (resolve) => require(['@/views/project/projectApproval/index'], resolve),
        name: 'projectTrack',
        meta: { title: '项目立项', icon: '', noCache: true }
      },
      {
        path: 'implementa/projectTrack',
        component: (resolve) => require(['@/views/project/implementa/projectTrack'], resolve),
        name: 'projectTrack',
        meta: { title: '项目跟踪', icon: '', noCache: true }
      },
    ]
  },
  //光伏项目管理
  {
    path: '/light/twovotes',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'workTicket/info',
        component: (resolve) => require(['@/views/twovotes/workTicket/info'], resolve),
        name: 'workTicket',
        meta: { title: '新增工作牌', icon: '', noCache: true }
      },
    ]
  },
  //风电项目管理
  {
    path: '/wind/twovotes',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'workTicket/info',
        component: (resolve) => require(['@/views/twovotes/workTicket/info'], resolve),
        name: 'workTicket',
        meta: { title: '新增工作牌', icon: '', noCache: true }
      },
    ]
  },

  {
    path: '/statistics/statistics',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'dataMaintain/addDeviceDay',
        component: (resolve) => require(['@/views/dataMaintain/addDeviceDay'], resolve),
        name: 'addDeviceDay',
        meta: { title: '录入日发电量', icon: '', noCache: true }
      },
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  // mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
