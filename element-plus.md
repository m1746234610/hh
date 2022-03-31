### form表单属性
<el-form
:model='userForm'
:rules='rules'

1. model: 用户输入的信息
  用途: 
  setup(){
    ...
    let state = reactive({
      userForm:{
        userAccount: '', // 账号
        userPassword: '', // 密码
      }
    })
  }

2. rules: 信息校验规则
  用途: 
    rules:[
      <!-- 
        key: 跟要校验的收集到的信息(userForm里的信息就是收集到的信息)的名字保持一致 (如果相对userForm里的userAccount做校验，那rules里也要有一个userAccount的key去匹配)
        value: 具体的验证规则
        key--value
        
        userAccount: {
          required: true // 是否必填
          message: '请输入活动名称' // 提示信息

          trigger: 'blur' // 触发检查的方式:
                              blur 失去焦点时检查
                              change 值发生改变时触发
          trigger: ['blur']

          min: 6 // 最小长度
          max: 13 // 最大长度

          pattern: /^[a-z]+$/ // 使用正则（只能输入字母）
        }
      -->
      key:{}
    ]

3. prop: 用来指定，通过rules里的哪一条规则来对input里的值进行校验（也可以在prop中自己定义规则）
   