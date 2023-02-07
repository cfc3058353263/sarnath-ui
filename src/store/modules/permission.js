import router, { constantRoutes, parentRoutes } from '@/router'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView';

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [] //左侧功能菜单
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes = state.routes.concat(routes)
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes)
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      const index = [{
        path: 'index',
        meta: { title: '统计报表', icon: 'dashboard' }
      }]
      state.topbarRouters = routes.concat(index);
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes
    },
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, res) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        const rewriteRoutes = []
        for (let route of parentRoutes) {
          if (route.path == "/light") {
            for (let item of res.layouts) {
              if (item.system.systemName === "光伏运维") {
                let arr = filterAsyncRouter(item.menus, route.path, true)
                arr.unshift({
                  path: '/light',
                  component: Layout,
                  children: [{
                    path: 'index', name: 'light', component: (resolve) => require(['@/views/light/index'], resolve), meta: { title: '首页', icon: 'dashboard', noCache: false, breadcrumb: false }
                  }]
                })
                rewriteRoutes.push(...arr)
                commit('SET_ROUTES', [{ systemId: item.system.systemId, list: arr, systemName: item.system.systemName, stations: item.stations }])
              }
            }
          }
          else if (route.path == "/wind") {
            for (let item of res.layouts) {
              if (item.system.systemName === "风电运维") {
                let arr = filterAsyncRouter(item.menus, route.path, true)
                arr.unshift({
                  path: '/wind',
                  component: Layout,
                  children: [{
                    path: 'index', name: 'wind', component: (resolve) => require(['@/views/wind/index'], resolve), meta: { title: '首页', icon: 'dashboard', noCache: false, breadcrumb: false }
                  }]
                })
                rewriteRoutes.push(...arr)
                commit('SET_ROUTES', [{ systemId: item.system.systemId, list: arr, systemName: item.system.systemName, stations: item.stations }])
              }
            }
          }
          else if (route.path == "/statistics") {
            for (let item of res.layouts) {
              if (item.system.systemName === "统计分析") {
                let arr = filterAsyncRouter(item.menus, route.path, true)
                rewriteRoutes.push(...arr)
                commit('SET_ROUTES', [{ systemId: item.system.systemId, list: arr, systemName: item.system.systemName, stations: item.stations }])
              }
            }
          }
          else if (route.path == "/system") {
            for (let item of res.layouts) {
              if (item.system.systemName === "系统管理") {
                let arr = filterAsyncRouter(item.menus, route.path, true)
                rewriteRoutes.push(...arr)
                commit('SET_ROUTES', [{ systemId: item.system.systemId, list: arr, systemName: item.system.systemName, stations: item.stations }])
              }
            }
          }
        }
        // for (let item of res.layouts) {
        //   let arr = filterAsyncRouter(item.menus, false, true)
        //   rewriteRoutes.push(...arr)
        //   commit('SET_ROUTES',[ {systemId:item.system.systemId,list:arr,systemName:item.system.systemName}])
        // }
        // commit('SET_SIDEBAR_ROUTERS', rewriteRoutes)
        rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
        resolve(rewriteRoutes)
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, path, type = false) {
  let route = []
  for (let list of asyncRouterMap) {
    let item = {}

    if (list.children.length !== 0) {
      item.children = filterChildren(list.children)
    }
    item.path = path + list.path
    item.component = Layout
    item.alwaysShow = true
    item.redirect = "noRedirect"
    item.name = list.menuCode
    item.meta = { title: list.menuName, icon: list.icon, noCache: false }
    item.hidden = false
    route.push(item)
  }
  return route
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  for (let item of childrenMap) {
    let menu = {
      children: null
    }
    let isButton = false
    if (item.children.length !== 0) {
      for (let list of item.children) {
        if (list.path) {
          isButton = true
          break
        }
      }
    }
    if (isButton) {
      menu.children = filterChildren(item.children)
      menu.alwaysShow = true
      menu.redirect = "noRedirect"
      menu.hidden = false
      menu.component = ParentView
    } else {
      menu.component = loadView(item.path)
    }

    let arr = item.path.split('/')
    menu.path = arr[arr.length - 1]
    menu.name = arr[arr.length - 1]
    menu.meta = { title: item.menuName, icon: item.icon, noCache: false }
    children.push(menu)
  }
  return children
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views${view}`], resolve)
}

export default permission
