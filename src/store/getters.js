const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  name: state => state.user.name,
  stationList: state => state.user.stationList,
  user: state => state.user.user,
  stationAll: state => state.user.stationAll,
  routerPrefix: state => state.user.routerPrefix,
  currentStation: state => state.user.currentStation,
  currentSystem: state => state.user.currentSystem,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  topbarRouters:state => state.permission.topbarRouters,
  defaultRoutes:state => state.permission.defaultRoutes,
  sidebarRouters:state => state.permission.sidebarRouters,
  addRoutes:state => state.permission.addRoutes,
  routes:state => state.permission.routes,
  currentIndex:state => state.user.currentIndex,
}
export default getters
