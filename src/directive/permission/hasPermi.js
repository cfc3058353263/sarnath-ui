 /**
 * 操作权限处理
 * Copyright (c) 2019 sarnath
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "*:*:*";
    const permissions = store.getters && store.getters.permissions
    //得到该系统下的菜单权限
    var sysMens= permissions.filter(x=>x.system.systemId==store.getters.currentSystem).map(x=>x.menus)
    
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      var allMenus=[];
      getChild(allMenus,sysMens)
      const hasPermissions = allMenus.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  },
 
}

const getChild=function(menus,item){
  if(item){
    if(item.perms){
      menus.push(item.perms);
    }
    if(item.constructor === Array){//如果是集合
      item.forEach(element => {
        menus.concat(getChild(menus,element)) 
      });
    }
    if(item.children&&item.children.length>0){
      item.children.forEach(element => {
        menus.concat(getChild(menus,element)) 
      });
    }
  }
}
