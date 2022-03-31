<template>
  <el-dialog width="400px" v-model="visible" :title="type == 'add' ? '添加轮播图' : '修改轮播图'">
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <!-- 上传图片 -->
      <el-form-item label="图片" prop="url">
        <el-upload
          class="avatar-uploader"
          :action="uploadImgServer"
          accept="jpg, jpeg, png"
          :headers="{
            token: token
          }"
          :show-file-list="false"
          :before-upload="handleBeforeUpload"
          :on-success="handleUrlSuccess"
        >
          <img
            style="width: 200px; height: 100px; border: 1px solid #e9e9e9;"
            v-if="ruleForm.url"
            :src="ruleForm.url"
            class="avatar"
            alt="上传图片"
          />
          <i v-else class="iconfont icon-tianjia2" />
        </el-upload>
      </el-form-item>

      <!-- 要跳转的链接 -->
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link" />
      </el-form-item>

      <el-form-item label="排序值" prop="sort">
        <el-input type="number" v-model="ruleForm.sort"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, toRefs } from "vue"
import axios from "@/utils/axios"
import { localGet, uploadImgServer } from '@/utils'
import { ElMessage } from 'element-plus'

export default {
  name: 'DialogAddSwiper',
  props: {
    type: String, // add 为新增；edit 为编辑
    reload: Function // table 刷新的方法
  },
  setup(props) {
    // formRef 用于表单验证控制
    const formRef = ref(null)
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      visible: false,
      ruleForm: {
        url: '',
        link: '',
        sort: ''
      },
      rules: {
        url: [
          { required: true, message: '图片不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })

    // 获取详情
    const getDetail = (id) => {
      axios.get(`/carousels/${id}`).then(res => {
        state.ruleForm = {
          url: res.carouselUrl,
          link: res.redirectUrl,
          sort: res.carouselRank
        }
      })
    }

    // 上传之前，控制上传的文件
    const handleBeforeUpload = (file) => {
      console.log(file);
      const sufix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }

    // 如果图片格式通过，将图片传给ruleForm.url作为参数（上传图片）
    const handleUrlSuccess = (val) => {
      state.ruleForm.url = val.data || ''
    }

    // 开启弹窗，此方法将在父组件，通过 ref 直接调用。
    const open = (id) => {
      state.visible = true
      // 如果带着 id，则是编辑，否则为新增
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        state.ruleForm = {
          url: '',
          link: '',
          sort: ''
        }
      }
    }

    // 关闭弹窗
    const close = () => {
      state.visible = false
    }

    // 提交表单方法
    const submitForm = () => {
      formRef.value.validate((valid) => {
        // valid 是一个布尔值，表示表单是否通过了上面 rules 的规则
        if (valid) {
          // 增加用 axios.post
          if (props.type === 'add') {
            axios.post('/carousels', {
              carouselUrl: state.ruleForm.url,
              redirectUrl: state.ruleForm.link,
              carouselRank: state.ruleForm.sort
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              // 刷新table
              if (props.reload) props.reload()
            })
          } else {
            // 编辑用 axios.put
            axios.put('/carousels', {
              carouselId: state.id,
              carouselUrl: state.ruleForm.url,
              redirectUrl: state.ruleForm.link,
              carouselRank: state.ruleForm.sort
            }).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          }
        }
      })
    }

    return {
      ...toRefs(state),
      open,
      close,
      formRef,
      handleBeforeUpload,
      handleUrlSuccess,
      submitForm
    }
  }

}
</script>


<style lang="less" scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.icon-tianjia2 {
  display: block;
  width: 98px;
  height: 98px;
  font-size: 50px;
  text-align: center;
  line-height: 100px;
  border: 1px solid #e9e9e9;
}
</style>