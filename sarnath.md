# 萨纳斯框架的vue目录结构

```
├── build 打包配置项

├── public 
	│ ├── favicon.ico title栏图标

    │ ├── index.html 总页码（第一次加载页）

├── gitignore 这个是git的选择性上传的配置文件

├── src 源码目录 这个目录里边放的是我们开放的源代码

  	│ ├── api 目录里面放所有的资源文件。
  	
  		│ ├── monitor 日志和服务监控的api接口
  		
  		│ ├── system 系统管理下的各个功能的api接口
  		
  		│ ├── tool 代码生成页请求api（平时不可见 需手动访问路径/tool/gen）
  		
  		│ ├── login 登陆/退出/验证码的api接口
  		
  		│ ├── menu.js 获取路由的api接口,所有自动生成的页面路由

    │ ├── assets 目录里面放所有的资源文件。

    │ ├── components 目录里存放公共的组件。
    
    	│ ├── Breadcrumb 面包屑导航。
    	
    	│ ├── Editor 富文本编译器组件 图片上传组件
		
		│ ├── FileUpload 上传组件详解
		
		│ ├── Hamburger 头部首页两个字的点击效果组件
		
		│ ├── HeaderSearch 头部搜索框按钮组件
		
		│ ├── IconSelect 头部搜索框按钮组件
		
			│ ├── index.vue 图标选择组件
			
			│ ├── requireIcons.js 协助图标选择组件过滤后缀非svg的文件
			
		│ ├── ImageUpload 图片上传
        
		│ ├── Pagination 分页功能
		
		│ ├── PanTHumb 
		
		│ ├── ParentView
		
		│ ├── RightPanel

		│ ├── RightToolbar el-tooltip 文字提示 right-toolbar的组件的封装
		
		│ ├── Screenfull  你的浏览器无法工作弹出框
		
		│ ├── SizeSelect  布局大小按钮
		
		│ ├── SvgIcon  图标选择组件
		
		│ ├── ThemePicker  颜色选择组件
		
		│ ├── TopNav  顶部menu功能列表展示

	│ ├── directive permission 目录里存放公共的组件。
	
		│ ├── hasPermi  操作权限处理	
		
		│ ├── TopNav  角色权限处理
		
		│ ├── index  引入
		
	│ ├── layout layout 布局
	
		│ ├── component  页面布局
		
			│ ├── settiongs 主题风格设置
			
			│ ├── sidebar
			
				│ ├── index  页面的el-menu功能列表显示
				
				│ ├── item  页面的menu功能父级功能列表设置
				
				│ ├── link  页面的menu功能跳转链接的配置、
				
				│ ├── Logo  页面的menu功能logo设置
				
				│ ├── item  页面的menu功能所有功能设置
				
			│ ├── TagsView  
			
				│ ├── index 多个功能打开顶部列表设置
				
				│ ├── ScrollPane 多个功能打开过多使用el-scrollbar来做滑动
				
			│ ├── AppMain container页面显示 使用keep-alive和router-view控制页面的路由和渲染
			
			│ ├── Navbar 顶部top的导航栏
			
		│ ├── mixin 	
			
			│ ├── ResizeHandler 首页在进行切换时保护首页状态和大小 其实是手机的兼容
			
		│ ├── index.vue 整体的页面布局，引入了之前所有的页面布局的组件
	
    │ ├── router 
    
    	│ ├── index 配置路由里面目前只有项目中自带的路由配置，生成的都保存在数据接口里
    	
    │ ├── store
    
    	│ ├── modules 内部各种的全局数据操作
    	    	
    	    │ ├── app.js 可能是切换到手机端会使用到的数据
    	    
    	    │ ├── permission.js 从后端获取路由，然后渲染数据，过滤数据，和layout配合使用
    	    
    	    │ ├── setting.js 主题风格设置数据
    	    
    	    │ ├── tagsView.js 顶部功能菜单数据保存
    	    
    	    │ ├── user.js 登录的，用户信息，刷新token，退出登录，前端 登出，这几个都调的api里面的接口
  
		│ ├── getters.js
  	
    	│ ├── index vuex的注入
    	
    │ ├── utils 工具类
    
    	│ ├── 主要是request的axios的封装
    	
    │ ├── views 所有页面的合集，在那个/permission.js的时候说过，文件名要和/permission.js后几行对应，要不然他不知道去哪找

		│ ├── permission.js 登陆的流程 其中的NProgress是出现在浏览器中顶部的进度条 主要是用来做一些进入页面的限制的就是路由拦截
    
    	│ ├── setting.js 全局主题的默认配置

按钮的样式
	│ ├── el-icon-plus primary 新增	
	│ ├── el-icon-delete danger 删除	
	│ ├── el-icon-edit primary 编辑	
	│ ├── el-icon-refresh default 重置
	│ ├── el-icon-upload2 info 导入
	│ ├── el-icon-download warning 导出	
	│ ├── el-icon-circle-check 成功确认
	│ ├── el-icon-reading 查看
element 样式修改
	│ ├── 样式标签前添加  ::v-deep .el-dialog__header 注意添加空格
element 日期禁选
	│ ├──   pickerOptions: {
				disabledDate(time) {
					// 如果要更加精确可以使用moment
				return time.getTime() < Date.now();
				},
			},
1.弹出框表单提交取消esc关闭 :close-on-press-escape="false" 和小叉号关闭 :show-close="false"	，清空验证  this.resetForm("form");this.$refs.form.resetFields(); 
  输入的最多长度20 maxlength="20"

2.关于数字Input框填写校验
  			minNum: [{ type: "number", message: "最低库存必须为数字" }],
            maxNum: [{ type: "number", message: "最高库存必须为数字" }],
			v-model.number = ""
			onkeyup="value=value.replace(/[^\d]/g,'')" //只能输入数字
			oninput="if(value.length > 15) value=value.slice(0, 15)" //输入的长度不得大于15个
	去除type="number"的上下箭头
			::v-deep input[type=number] {  
				-moz-appearance:textfield;  
			}  
			::v-deep input[type=number]::-webkit-inner-spin-button,::v-deep input[type=number]::-webkit-outer-spin-button {  
				-webkit-appearance: none;  
				margin: 0;
			}
```