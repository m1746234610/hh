<template>
  <el-dialog width="400px" v-model="visible" :title="type == 'add' ? '添加分类' : '修改分类'">
    <el-form
      ref="formRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input width="200" type="text" v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input width="200" type="number" v-model="ruleForm.rank" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, toRefs } from "vue"
import { useRoute } from 'vue-router'
import axios from "@/utils/axios"
export default {
  name: 'DialogAddCategory',
  props: {
    type: String, // add 为新增；edit 为编辑
    reload: Function, // 列表重新刷新
  },
  setup(props) {
    const formRef = ref(null)
    const route = useRoute()
    const state = reactive({
      visible: false,
      parentId: 0,
      categoryLevel: 1,
      ruleForm: {
        name: '',
        rank: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['change'] }
        ],
        rank: [
          { required: true, message: '编号不能为空', trigger: ['change'] }
        ]
      },
      id: '',
    })

    // 获取详情
    const getDetail = (id) => {
      axios.get(`/categories/${id}`).then(res => {
        state.ruleForm = {
          name: res.categoryName,
          rank: res.categoryRank
        }
        // 新增类目，从路由获取分类 level 级别和父分类 id
        state.parentId = res.parentId
        state.categoryLevel = res.categoryLevel
      })
    }

    // 开启弹窗
    const open = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        // 如果是有 id 传入，证明是修改模式
        getDetail(id)
      } else {
        // 否则为新增模式
        // 新增类目，从路由获取分类 level 级别和父分类 id
        const { level = 1, parent_id = 0 } = route.query
        state.ruleForm = {
          name: '',
          rank: '',
        }
        state.parentId = parent_id
        state.categoryLevel = level
      }
    }

    // 关闭弹窗
    const close = () => {
      state.visible = false
    }

    // 提交
    const submitForm = () => {
      formRef.value.validate((vaild) => {
        if (vaild) {
          if (props.type === 'add') {
            axios.post('/categories', {
              parentId: state.parentId, // 当前分类的父分类 id
              categoryLevel: state.categoryLevel, // 分类等级
              categoryName: state.ruleForm.name, // 分类名称
              categoryRank: state.ruleForm.rank // 分类权重
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              // 接口回调之后，运行重新获取列表方法 reload
              if (props.reload) props.reload()
            })
          } else {
            // 修改方法
            axios.put('/categories', {
              categoryId: state.id,
              parentId: state.parentId,
              categoryLevel: state.categoryLevel,
              categoryName: state.ruleForm.name,
              categoryRank: state.ruleForm.rank
            }).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              // 接口回调之后，运行重新获取列表方法 reload
              if (props.reload) props.reload()
            })
          }
        }
      })
    }

    return {
      formRef,
      ...toRefs(state),
      open,
      close,
      submitForm,
    }
  }
}
</script>

<style>
</style>