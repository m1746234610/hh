## 笔记

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
