<template>
  <el-card class="container">
    <template #header>
      <el-button type="primary" size="small" @click="handleAdd">
        <i class="iconfont icon-tianjia2" />
        <span>新增商品</span>
      </el-button>
    </template>

    <el-table v-loading="loading" :data="tableData" style="width:100%" tooltip-effect="dark">
      <el-table-column label="商品编号" prop="goodsId" />
      <el-table-column label="商品名" prop="goodsName" />
      <el-table-column label="商品简介" prop="goodsIntro" />
      <el-table-column label="商品图片" width="150px">
        <template v-slot="{ row }">
          <!-- 这里调用一个定义在全局的方法: 商品主图可能会返回一些绝对路径，导致图片加载失败 -->
          <img
            style="width:100px;height:100px;"
            :src="$filters.prefix(row.goodsCoverImg)"
            alt="商品主图"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品库存" prop="stockNum" />
      <el-table-column label="商品售价" prop="sellingPrice" />
      <el-table-column label="上架状态">
        <template v-slot="{ row }">
          <span style="color: green;" v-if="row.goodsSellStatus === 0">销售中</span>
          <span style="color: red;" v-else>已下架</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="160">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleEdit(row.goodsId)">修改</el-button>
          <el-button
            type="warning"
            v-if="row.goodsSellStatus === 0"
            @click="handleStatus(row.goodsId, 1)"
          >下架</el-button>
          <el-button type="primary" v-else @click="handleStatus(row.goodsId, 0)">上架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-model="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
import axios from "@/utils/axios"
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from "vue"
import { useRouter } from 'vue-router'
export default {
  name: 'Goods',
  setup() {
    const router = useRouter()
    const { appContext } = getCurrentInstance()
    const appConfig = appContext.config.globalProperties
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10 // 分页大小
    })

    onMounted(() => {
      getGoodList()
    })

    // 获取数据
    const getGoodList = () => {
      state.loading = true
      axios.get('/goods/list', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.loading = false
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        appConfig.goTop() // 数据获取成功后，回到顶部
      })
    }

    // 添加商品，跳转到/add路径下
    const handleAdd = () => {
      router.push({ path: '/add' })
    }

    // 修改商品，带 id 跳转 /add 路径
    const handleEdit = (id) => {
      router.push({
        name: 'add',
        query: {
          id
        }
      })
    }

    // 翻页
    const changePage = (val) => {
      state.id = val
      getGoodList()
    }

    // 商品上、下架
    const handleStatus = (id, status) => {
      axios.put(`/goods/status/${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改完成')
        getGoodList()
      })
    }

    return {
      ...toRefs(state),
      getGoodList,
      handleAdd,
      handleEdit,
      changePage,
      handleStatus
    }
  }
}
</script>

<style>
</style>