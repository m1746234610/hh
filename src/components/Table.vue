<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width:100%"
    @selection-change="handleSelectionChange"
  >
    <slot name="column"></slot>
  </el-table>
  <el-pagination
    background
    layout="prev,pager,next"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="changePage"
  />
</template>

<script>
import { onMounted, reactive, toRefs } from "vue"
import axios from "@/utils/axios"
export default {
  name: 'Table',
  props: {
    action: String // 父组件传入的列表请求地址
  },
  setup(props) {
    const state = reactive({
      loading: false,
      tableData: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      multipleSelection: []
    })

    onMounted(() => {
      getList()
    })

    // 获取列表
    const getList = () => {
      state.loading = true
      axios.get(props.action, {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.loading = false
        state.tableData = res.list
        state.total = res.totalPage
        state.currentPage = res.currPage
      })
    }

    // 选中框
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    
    // 翻页
    const changePage = (val) => {
      state.currentPage = val
      getList()
    }

    return {
      ...toRefs(state),
      getList,
      handleSelectionChange,
      changePage,
    }
  }
}
</script>

<style>
</style>