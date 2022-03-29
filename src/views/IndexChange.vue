<template>
  <el-card class="index-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="iconfont icon-tianjia2" />
          增加
        </el-button>
        <el-popconfirm
          title="确定删除吗"
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
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="configName" label="商品名称" />
      <el-table-column label="跳转链接">
        <template #default="{ row }">
          <a target="_blank" :href="row.redirectUrl">{{ row.redirectUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="configRank" label="排序值" width="120" />
      <el-table-column prop="goodsId" label="商品编号" width="200" />
      <el-table-column prop="createTime" label="添加时间" width="200" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" @click="handleEdit(scope.row.configId)">修改</el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDeleteOne(scope.row.configId)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--总数超过一页，再展示分页器-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-model="currentPage"
      @current-change="changePage"
    />
  </el-card>
  <DialogAddGoods ref="addGood" :reload="getIndexChage" :type="type" :indexType="indexType" />
</template>

<script>
import { onUnmounted, onMounted, reactive, ref, toRefs } from "vue"
import { useRoute, useRouter } from "vue-router"
import axios from '@/utils/axios'
import DialogAddGoods from '@/components/DialogAddGoods.vue'
// 首页配置类型参数
const indexTypes = {
  hot: 3,
  new: 4,
  recommend: 5
}

export default {
  name: 'IndexChange',
  components: {
    DialogAddGoods
  },
  setup() {
    const addGood = ref(null)
    const multipleTable = ref(null)
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      loading: false, // 是否开启加载动画
      tableData: [], // 请求的数据列表
      total: 0, // 总页数
      currentPage: 1, // 当前页数
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      indexType: 3, // 3-热销商品 4-新品上线 5-为你推荐
      multipleSelection: [], // 选中项
    })

    // 添加商品
    const handleAdd = () => {
      state.type = 'add',
        addGood.value.open()
    }

    // 修改商品
    const handleEdit = (id) => {
      state.type = 'edit'
      addGood.value.open(id)
    }

    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }

    // 删除
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }

      axios.post('/indexConfigs/delete', {
        data: {
          ids: state.multipleSelection.map(v => v.configId)
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getIndexChage()
      })
    }

    // 单个删除
    const handleDeleteOne = (id) => {
      axios.post('/indexConfigs/delete', {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getIndexChage()
      })
    }

    // 接收路由守卫返回的函数
    const unRoute = router.beforeEach((to) => {
      if (['hot', 'new', 'recommed'].includes(to.name)) {
        // 通过 to.name 去匹配不同路径下，configType 参数也随之变化
        state.indexType = indexTypes[to.name]
        state.currentPage = 1
        getIndexChage()
      }
    })

    // 初始化
    onMounted(() => {
      state.indexType = indexTypes[route.name]
      getIndexChage()
    })

    // 在切换路径后，组件会被销毁重构，但可能会发生: 之前组件的路由守卫未清除的情况，会导致若是在回调方法内直接根据路径的变化，请求不同的接口，一次性会有多个请求发出
    onUnmounted(() => {
      // 通过声明周期清除上一次的路由守卫
      unRoute()
    })

    // 获取数据
    const getIndexChage = () => {
      state.loading = true
      axios.get('/indexConfigs', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize,
          configType: state.indexType
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
      })
    }

    // 当前页数改变时触发
    const changePage = (val) => {
      state.currentPage = val
      getIndexChage()
    }

    return {
      addGood,
      multipleTable,
      ...toRefs(state),
      handleSelectionChange,
      handleAdd,
      handleEdit,
      handleDelete,
      handleDeleteOne,
      getIndexChage,
      changePage,
    }
  }
}
</script>

<style lang="less" scoped>
</style>