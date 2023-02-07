import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, getStationId, removeToken, setStationId, removeStationId, getSystemId, setSystemId, removeSystemId } from '@/utils/auth'

const user = {
  state: {
    token: getToken(), //token
    name: '',          //名称
    roles: [],         //角色
    permissions: [],   //权限
    stationList: [],    //当前用户的所属电站
    currentStation: '',  //当前电站名称
    currentSystem: '',  //当前系统
    stationAll: '',  //所有电站
    routerPrefix:'', //路由前缀
    user: {},
    currentIndex: 1 
  },

  mutations: {
    SET_TOKEN: (state, token) => { //用户token 主要此处的token只会在登陆/退出系统的时候调用
      state.token = token
    },
    SET_NAME: (state, name) => { //用户名称
      state.name = name
    },
    SET_ROLES: (state, roles) => { //用户角色
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => { //用户权限
      state.permissions = permissions
    },
    SET_STATIONLIST: (state, stationList) => { //当前用户的所属电站
      state.stationList = stationList
    },
    SET_CURRENTSTATION: (state, currentStation) => { //当前电站名称
      state.currentStation = currentStation
    },
    SET_CURRENTSYSTEM: (state, currentSystem) => { //当前系统
      state.currentSystem = currentSystem
    },
    SET_USER: (state, user) => { //当前电站名称
      state.user = user
    },
    SET_CURRENTINDEX: (state, currentIndex) => { //当前电站名称
      state.currentIndex = currentIndex
    },
    SET_STATIONAll: (state, stationAll) => { //当前电站名称
      let stationAllList = [{},{}]
      for(let item of stationAll){
        if(item.system.systemId == 1){
          stationAllList[0].stationId = "light"
          stationAllList[0].stationName = item.system.systemName
          stationAllList[0].children = item.stations
        }else if(item.system.systemId == 2){
          stationAllList[1].stationId = "wind"
          stationAllList[1].children = item.stations
          stationAllList[1].stationName = item.system.systemName
        }
      }
      state.stationAll = stationAllList
    },
    SET_ROUTERPREFIX: (state,routerPrefix)=>{
      state.routerPrefix = routerPrefix
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.data.access_token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.layouts)

          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_STATIONAll', res.layouts)
          if (getStationId()) {
            commit('SET_CURRENTSTATION', +getStationId())
          }
          if (getSystemId()) {
            commit('SET_CURRENTSYSTEM', +getSystemId())
          }
          commit('SET_USER', res.user)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          removeStationId()
          removeSystemId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
