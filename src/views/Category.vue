<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="iconfont icon-tianjia2" />
          <span>增加</span>
        </el-button>
        <el-popconfirm
          title="确定删除吗?"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small">
              <i class="iconfont icon-shanchu" />
              <span>批量删除</span>
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </template>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="categoryName" label="分类名称" />
      <el-table-column prop="categoryRank" label="排序值" width="120" />
      <el-table-column prop="createTime" label="添加时间" width="180" />
      <el-table-column label="操作" width="300">
        <template #default="{ row }">
          <el-button type="success" @click="handleNext(row)">下级分类</el-button>
          <el-button type="primary" @click="handleEdit(row.categoryId)">修改</el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDeleteOne(row.categoryId)"
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
  <DialogAddCategory ref="addCate" :type="type" :reload="getCategory" />
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/utils/axios'
import DialogAddCategory from '@/components/DialogAddCategory.vue'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'Category',
  components: {
    DialogAddCategory
  },
  setup() {
    const addCate = ref(null)
    const route = useRoute() // 获取路由参数
    const router = useRouter() // 声明路由实例
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      total: 0, // 总条数
      pageSize: 10, // 分页大小
      currentPage: 1,// 当前页 
      type: 'add',// 操作类型
      level: 1,
      parent_id: 0,
      multipleSelection: [], // 选中项
    })

    onMounted(() => {
      getCategory()
    })

    //* 等路由跳转之后在发送请求获取数据: 如果在路由跳转之前就请求数据，route表示的还是当前路由组件，而不是下一级的路由组件，所以请求的数据还会是当前路由组件的数据
    const unwatch = router.afterEach((to) => {
      // 每次路由变化的时候，都会触发监听事件，重新获取列表数据
      if (['category', 'level2', 'level3'].includes(to.name)) {
        getCategory()
      }
    })

    onUnmounted(() => {
      unwatch()
    })

    // 请求数据
    const getCategory = () => {
      // 根据传递的query参数获取分类列表，没有query就获取默认列表
      const { level = 1, parent_id = 0 } = route.query
      state.loading = true
      axios.get('/categories', {
        params: {
          pageNumber: state.currentPage, // 当前页数
          pageSize: state.pageSize, // 分页大小
          categoryLevel: level,
          parentId: parent_id
        }
      }).then(res => {
        state.loading = false
        state.tableData = res.list
        state.total = res.totalCount
        state.level = level
        state.parent_id = parent_id
      })
    }

    // 当前页数改变时，重新请求新的数据
    const changePage = (val) => {
      state.currentPage = val
      getCategory()
    }

    // 进入下一分级
    const handleNext = (item) => {
      const level = item.categoryLevel + 1
      if (level > 3) {
        ElMessage.error('没有四级路由')
        return
      }
      router.push({
        name: `level${level}`,
        query: {
          level: level,
          parent_id: item.categoryId
        }
      })
    }

    // 添加分类
    const handleAdd = () => {
      state.type = 'add' // 传入弹窗组件用于弹窗 title 判断
      addCate.value.open()
    }

    // 修改分类
    const handleEdit = (id) => {
      state.type = 'edit' // 传入弹窗组件用于弹窗 title 判断
      addCate.value.open(id)
    }

    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }

    // 批量删除
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }

      axios.delete('/categories', {
        data: {
          ids: state.multipleSelection.map(i => i.categoryId)
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }

    // 单个删除
    const handleDeleteOne = (id) => {
      axios.delete('/categories', {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCategory()
      })
    }

    return {
      addCate,
      ...toRefs(state),
      getCategory,
      changePage,
      handleNext,
      handleAdd,
      handleEdit,
      handleSelectionChange,
      handleDelete,
      handleDeleteOne,
    }
  }
}
</script>

<style>
</style>