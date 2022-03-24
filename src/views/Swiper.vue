<template>
  <el-card class="swiper-container">
    <el-table :data="tableData" v-loading="loading" style="width: 100%" tooltip-effect="dark">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="轮播图" width="200">
        <template #default="{row}">
          {{row}}
          <!-- <img style="width: 150px;height: 150px" :src="scope.row.carouselUrl" alt="轮播图" /> -->
        </template>
      </el-table-column>
      <el-table-column label="跳转链接">
        <template #default="scope">
          <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.redirectUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="排序" label="排序值" width="120"></el-table-column>
      <el-table-column prop="添加时" label="添加时间" width="200"></el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from "vue"
import axios from "@/utils/axios"
export default {
  name: 'Swiper',
  setup() {
    const state = reactive({
      loading: false, // 控制加载动画
      tableData: [], // 数据列表
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页请求数
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
        state.tableData = res.list
        console.log(state.tableData);
        state.loading = false
      })
    }

    return {
      ...toRefs(state)
    }
  }
}
</script>

<style>
</style>