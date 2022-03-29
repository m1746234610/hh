<template>
  <el-card class="swiper-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="iconfont icon-tianjia2" /> 增加
        </el-button>

        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small">
              <i class="iconfont icon-shanchu" />
              批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>

    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      tooltip-effect="dark"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="轮播图" width="200">
        <!-- **
          使用插槽时，没有名字的插槽会默认添加一个default的名字:
            <template></template> ===> <template v-slot:default></template> ===> <template #default></template>
        -->
        <template v-slot="{ row, column, $index }">
          <img style="width: 150px;height: 150px" :src="row.carouselUrl" alt="轮播图" />
        </template>
      </el-table-column>
      <el-table-column label="跳转链接">
        <template v-slot="{ row, column, $index }">
          <a target="_blank" :href="row.redirectUrl">{{ row.redirectUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="carouselRank" label="排序值" width="120" />
      <el-table-column prop="createTime" label="添加时间" width="200" />
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
  <DialogAddSwiper ref="addSwiper" :reload="getCarousels" :type="type" />
</template>

<script>
import DialogAddSwiper from "@/components/DialogAddSwiper.vue"
import { onMounted, ref, reactive, toRefs, getCurrentInstance } from "vue"
import axios from "@/utils/axios"
export default {
  name: 'Swiper',
  components: {
    DialogAddSwiper
  },
  setup() {
    const addSwiper = ref(null)
    const { appContext } = getCurrentInstance()
    const appConfig = appContext.config.globalProperties
    const state = reactive({
      loading: false, // 控制加载动画
      tableData: [], // 数据列表
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页请求数
      type: 'add', // 操作类型
      multipleSelection: [],// 选中项
      total: 0, // 总条数
    })
    onMounted(() => {
      getCarousels()
    })

    // 获取轮播图列表
    const getCarousels = () => {
      state.loading = true
      axios.get('/carousels', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.tableData = res.list // 列表
        state.currentPage = res.currPage // 当前页数
        state.loading = false // 停止加载动画
        state.total = res.totalCount // 总条数
        appConfig.goTop() // 数据获取成功后，回到顶部
      })
    }

    // 页面改变触发
    const changePage = (val) => {
      state.currentPage = val
      getCarousels()
    }

    // 总页数改变触发
    const sizePage = (val) => {
      state.currentPage = val
      getCarousels()
    }

    // 手动添加轮播图片
    const handleAdd = () => {
      state.type = 'add'
      addSwiper.value.open()
    }

    // 手动修改轮播图片
    const handleEdit = (id) => {
      state.type = 'edit'
      addSwiper.value.open(id)
    }

    // 选中之后的change方法，一旦选项有变化，就会触发该方法。
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }

    // 批量删除
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }

      axios.delete('/carousels', {
        data: {
          ids: state.multipleSelection.map(v => v.carouselId)
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCarousels()
      })
    }

    return {
      ...toRefs(state),
      addSwiper,
      handleAdd,
      handleEdit,
      getCarousels,// 这里将获取轮播图列表的接口返回，因为弹窗内部添加后，需要刷新列表
      handleSelectionChange,
      handleDelete,
      changePage,
      sizePage
    }
  }
}
</script>

<style>
</style>