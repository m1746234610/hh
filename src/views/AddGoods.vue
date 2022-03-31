<template>
  <div class="add">
    <el-card class="add-containe">
      <el-form
        :model="goodsForm"
        :rules="rules"
        ref="goodsRef"
        label-width="100px"
        class="goodsForm"
      >
        <el-form-item label="商品分类">
          <el-cascader
            size="large"
            style="width: 300px"
            :placeholder="defaultCate"
            :props="category"
            @change="handleChangeCate"
          />
        </el-form-item>

        <el-form-item label="商品名称" prop="goodsName">
          <el-input
            type="text"
            style="width:300px"
            v-model="goodsForm.goodsName"
            placeholder="请输入商品名称"
          />
        </el-form-item>

        <el-form-item label="商品简介" prop="goodsIntro">
          <el-input
            type="textarea"
            rows="5"
            resize="none"
            style="width:300px"
            v-model="goodsForm.goodsIntro"
            placeholder="请输入商品简介"
          />
        </el-form-item>

        <el-form-item label="商品价格" prop="originalPrice">
          <el-input
            type="number"
            min="0"
            style="width:300px"
            v-model="goodsForm.originalPrice"
            placeholder="请输入商品价格"
          />
        </el-form-item>

        <el-form-item label="商品售卖价" prop="sellingPrice">
          <el-input
            type="number"
            min="0"
            style="width:300px"
            v-model="goodsForm.sellingPrice"
            placeholder="请输入商品卖价"
          />
        </el-form-item>

        <el-form-item label="商品库存" prop="stockNum">
          <el-input
            type="number"
            min="0"
            style="width:300px"
            v-model="goodsForm.stockNum"
            placeholder="请输入商品库存"
          />
        </el-form-item>

        <el-form-item label="商品标签" prop="tag">
          <el-input style="width:300px" v-model="goodsForm.tag" placeholder="请输入商品小标签" />
        </el-form-item>

        <el-form-item label="上架状态" prop="goodsSellStatus">
          <el-radio-group v-model="goodsForm.goodsSellStatus" size="large">
            <el-radio label="0">
              <span>上架</span>
            </el-radio>
            <el-radio label="1">
              <span>下架</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品主图" prop="goodsName">
          <el-upload
            class="avatar-uploader"
            :action="uploadImgServer"
            accept="jpg, png, jpng"
            :headers="{
              token
            }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess"
          >
            <img
              style="width: 100px; height: 100px; border: 1px solid #e9e9e9;"
              v-if="goodsForm.goodsCoverImg"
              :src="goodsForm.goodsCoverImg"
              class="avatar"
              alt="上传图片"
            />
            <i v-else class="iconfont icon-tianjia2" />
          </el-upload>
        </el-form-item>

        <el-form-item>
          <!-- 跟富文本编辑器绑定 -->
          <div ref="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd">{{ id ? '立即修改' : '立即创建' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted, getCurrentInstance, onBeforeUnmount } from "vue"
import axios from "@/utils/axios"
import WangEditor from 'wangeditor'
import { useRoute, useRouter } from "vue-router"
import { localGet, uploadImgServer, uploadImgsServer } from "@/utils"
export default {
  name: 'AddGoods',
  setup() {
    const { appContext } = getCurrentInstance()
    const appConfig = appContext.config.globalProperties
    const editor = ref(null)  // 富文本编辑器 ref
    const goodsRef = ref(null) // 表单 ref
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query // 编辑时传入的商品 id
    console.log(id);
    const state = reactive({
      uploadImgServer, // 图片上传路径
      id: id,
      categoryId: '', // 分类 id
      defaultCate: '', // 默认分类值
      token: localGet('token') || '', // 存在本地的 token
      goodsForm: {
        goodsName: '',
        goodsIntro: '',
        originalPrice: '',
        sellingPrice: '',
        stockNum: '',
        tag: '',
        goodsSellStatus: '0',
        goodsCoverImg: '',
      },
      // 鉴权
      rules: {
        goodsName: [
          { required: true, message: '请填写商品名称', trigger: ['change'] }
        ],
        originalPrice: [
          { required: true, message: '请填写商品价格', trigger: ['change'] }
        ],
        sellingPrice: [
          { required: true, message: '请填写商品售价', trigger: ['change'] }
        ],
        stockNum: [
          { required: true, message: '请填写商品库存', trigger: ['change'] }
        ],
      },
      category: { // 联动组件 props 属性
        lazy: true, // 是否动态加载子节点，需与lazyLoad方法结合使用
        lazyLoad(node, resolve) {
          console.log('node', node, resolve);
          const { level = 0, value } = node
          axios.get('/categories', {
            params: {
              pageNumber: 1,
              pageSize: 1000,
              categoryLevel: level + 1,
              parentId: value || 0
            }
          }).then(res => {
            console.log('res', res);
            const list = res.list
            const nodes = list.map(v => ({
              value: v.categoryId,
              label: v.categoryName,
              leaf: level > 1
            }))
            console.log('nodes', nodes);
            resolve(nodes)
          })
        }
      }
    })

    let instance // wangEditor 实例

    onMounted(() => {
      instance = new WangEditor(editor.value) // 初始化 wangEditor
      instance.config.showLinkImg = false
      instance.config.showLinkImgAlt = false
      instance.config.showLinkImgHref = false
      instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 最大上传大小 2M 
      instance.config.uploadFileName = 'file' // 上传时，key 值自定义
      instance.config.uploadImgHeaders = {
        token: state.token // 添加 token，否则没有权限调用上传接口
      }
      // 图片返回格式不同，需要自定义返回格式
      instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
          console.log('result', result)
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if (result.data && result.data.length) {
            result.data.forEach(item => insertImgFn(item))
          }
        }
      }
      instance.config.uploadImgServer = uploadImgsServer // 上传接口地址配置（可上传多张图片）

      // 将多个对象合并到第一个对象中（同名属性后者会覆盖前者）
      Object.assign(instance.config, {
        onchange() {
          console.log('change');
        }
      })
      instance.create()

      // id存在，表示编辑商品
      if (id) {
        axios.get(`/goods/${id}`).then(res => {
          const { goods, firstCategory, secondCategory, thirdCategory } = res
          console.log(id);
          state.goodsForm = {
            goodsName: goods.goodsName,
            goodsIntro: goods.goodsIntro,
            originalPrice: goods.originalPrice,
            sellingPrice: goods.sellingPrice,
            stockNum: String(goods.stockNum),
            tag: goods.tag,
            goodsSellStatus: String(goods.goodsSellStatus),
            goodsCoverImg: appConfig.$filters.prefix(goods.goodsCoverImg),
          }
          state.categoryId = goods.goodsCategoryId
          state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
          console.log('state.defaultCate', goods.goodsCategoryId);
          if (instance) {
            // 初始化商品详情 html
            instance.txt.html(goods.goodsDetailContent)
          }
        })
      }
    })

    onBeforeUnmount(() => {
      // 组件销毁之前，销毁 wangEditor 实例
      instance.destroy()
      instance = null
    })

    // 添加商品方法
    const submitAdd = () => {
      goodsRef.value.validate((vaild) => {
        if (vaild) {
          let httpOption = axios.post
          let params = {
            goodsCategoryId: state.categoryId,
            goodsCoverImg: state.goodsForm.goodsCoverImg,
            goodsDetailContent: instance.txt.html(),
            goodsIntro: state.goodsForm.goodsIntro,
            goodsName: state.goodsForm.goodsName,
            goodsSellStatus: state.goodsForm.goodsSellStatus,
            originalPrice: state.goodsForm.originalPrice,
            sellingPrice: state.goodsForm.sellingPrice,
            stockNum: state.goodsForm.stockNum,
            tag: state.goodsForm.tag
          }
          console.log('params', params);
          if (id) {
            params.goodsId = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('/goods', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({ path: '/goods' })
          })
        }
      })
    }

    // 上传之前，判断一下文件格式
    const handleBeforeUpload = (val) => {
      const sufix = val.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }

    // 图片上传成功后的回调
    const handleUrlSuccess = (val) => {
      state.goodsForm.goodsCoverImg = val.data || ''
    }

    // 三级联动变化后的回调
    const handleChangeCate = (val) => {
      console.log(val);
      state.categoryId = val[2] || 0
    }

    return {
      ...toRefs(state),
      goodsRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      handleChangeCate,
    }
  }
}
</script>

<style lang="less" scoped>
.add {
  display: flex;
  .add-containe {
    flex: 1;
    height: 100%;
    .avatar-uploader {
      width: 100px;
      height: 100px;
      color: #ddd;
      .icon-tianjia2 {
        display: block;
        width: 100px;
        height: 100%;
        box-sizing: border-box;
        border: 1px solid #e9e9e9;
        padding: 32px 17px;
        font-size: 30px;
        text-align: center;
      }
    }
  }
}
</style>

<style scoped>
span {
  cursor: pointer;
}
</style>