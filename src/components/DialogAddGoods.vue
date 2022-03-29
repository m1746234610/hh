<template>
  <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" v-model="visible" width="400px">
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model.trin="ruleForm.name" type="text" />
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input v-model.trin="ruleForm.link" type="text" />
      </el-form-item>
      <el-form-item label="商品编号" prop="id">
        <el-input v-model.trin="ruleForm.id" type="number" />
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input v-model="ruleForm.sort" type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "@/utils/axios"
import { ref, reactive, toRefs } from 'vue'
export default {
  name: 'DialogAddGoods',
  props: {
    type: String,
    indexType: Number,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      ruleForm: {
        name: '',
        id: '',
        link: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['change'] }
        ],
        id: [
          { required: true, message: '编号不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })

    // 获取详情
    const getDetail = (id) => {
      axios.get(`/indexConfigs/${id}`).then(res => {
        console.log(id, res);
        state.ruleForm = {
          name: res.configName,
          id: res.goodsId,
          link: res.redirectUrl,
          sort: res.configRank
        }
      })
    }

    // 开启弹窗
    const open = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        state.ruleForm = {
          name: '',
          id: '',
          link: '',
          sort: '',
        }
      }
    }

    // 增加/修改数据
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (state.ruleForm.id < 0 || state.ruleForm.id > 200) {
            ElMessage.error('商品编号不能小于 0 或大于 200')
            return
          }
          // add: 添加
          if (props.type === 'add') {
            console.log(23123);
            axios.post('/indexConfigs', {
              configType: props.indexType || 3,
              configName: state.ruleForm.name,
              goodsId: state.ruleForm.id,
              redirectUrl: state.ruleForm.link,
              configRank: state.ruleForm.sort
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              // 刷新table
              if (props.reload) props.reload()
            })
          } else {
            // 不是add: 编辑
            axios.put('/indexConfigs', {
              configId: state.id,
              configType: props.indexType || 3,
              configName: state.ruleForm.name,
              redirectUrl: state.ruleForm.link,
              goodsId: state.ruleForm.id,
              configRank: state.ruleForm.sort
            }).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              // 刷新table
              if (props.reload) props.reload()
            })
          }
        }
      })
    }

    // 关闭弹窗
    const close = () => {
      state.visible = false
    }

    return {
      formRef,
      ...toRefs(state),
      open,
      close,
      submitForm
    }
  }
}
</script>

<style>
</style>