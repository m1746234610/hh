# 笔记

## 第三方
- 如何在项目中在线引用iconfont？

1. 在iconfont中将图标添加到我的项目中
2. 进入我的项目拷贝css在线地址
3. 在vue项目的index.html添加link引入
   <link rel="stylesheet" href="xxx.css">
4. 在assets文件夹下新建一个iconfont.css文件，并写入如下代码:
```
  [class^="el-icon-ali"], [class*="el-icon-ali"] {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// el-icon-ali 需要替换成创建项目时候的FontClass前缀。
// iconfont 需要替换成创建项目时候的 Font Family
``` 
5. 在main.js引入这个iconfont.css
  import './assets/iconfont.css'
6. 在代码中使用 
  <i class="el-icon-ali-hongbao1"></i>


## vue3
- 在vue3单文件组件中，setup里return出去的方法最后会出现在这个组件的实例对象身上
  比如在School.vue这个组件中创建了一个 add函数，在setup里return出去后，当School组件在其他组件中使用时，可以通过 ref.value.add使用School.vue里的add方法

- 一个组件中的路由守卫，需要组件先加载到页面上后，之后在进行路由跳转，该组件里的路由守卫才会被触发

- 当路由配置中，如果使用import按需引入，在切换路由时可能会出现页面闪烁的情况