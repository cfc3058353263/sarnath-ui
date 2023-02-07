## 开发

```bash

# 进入项目目录
cd sarnath-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 框架修改记录

```bash
# 布局设置的删除
layout/components/Navbar.vue 删除布局设置按钮/源码地址/文档地址/布局大小/search搜索 
layout/components/settings/index.vue 删除文件不在显示主题风格设置
# router 路由前端写死
新增加系统管理的路由
# store/pemmission.js 中路由的获取修改
action中的GenerateRoutes路由获取方式
#自定义组件 在views/componetns/xxxx/index.vue
topSearch 顶部查询修改


# 主题配置
```