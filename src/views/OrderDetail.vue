<template>
  <el-card class="box-card">
    <div class="top">
      <el-card class="top-box" shadow="hover">
        <template #header>
          <span class="text">订单状态</span>
        </template>
        <div class="text">{{ orderStatus }}</div>
      </el-card>
      <el-card class="top-box" shadow="hover">
        <template #header>
          <span class="text">创建时间</span>
        </template>
        <div class="text">{{ createTime }}</div>
      </el-card>
      <el-card class="top-box" shadow="hover">
        <template #header>
          <span class="text">订单号</span>
        </template>
        <div class="text">{{ orderNo }}</div>
      </el-card>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%; box-sizeing:border-box;"
      tooltip-effect="dark"
      class="abc"
    >
      <el-table-column label="商品图片">
        <template v-slot="{ row }">
          <img
            style="width:100px;"
            :key="row.goodsId"
            :src="$filters.prefix(row.goodsCoverImg)"
            alt="商品主图"
          />
        </template>
      </el-table-column>
      <el-table-column prop="goodsId" label="商品编号" />
      <el-table-column prop="goodsName" label="商品名" />
      <el-table-column prop="goodsCount" label="商品数量" />
      <el-table-column prop="sellingPrice" label="商品价格" />
    </el-table>
  </el-card>
</template>

<script>
import axios from "@/utils/axios"
import { reactive, toRefs, onMounted } from "vue"
import { useRoute } from "vue-router"
export default {
  name: 'OrderDetail',
  setup() {
    const route = useRoute()
    const { id } = route.query
    const state = reactive({
      loading: false,
      tableData: [],
      createTime: '',
      orderStatus: '',
      orderNo: '',
    })

    onMounted(() => {
      state.loading = true
      axios.get(`orders/${id}`).then(res => {
        state.loading = false
        state.tableData = res.newBeeMallOrderItemVOS
        state.orderNo = res.orderNo
        state.createTime = res.createTime
        state.orderStatus = res.orderStatusString
        console.log(state.tableData);
      })
    })

    return {
      ...toRefs(state)
    }

  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 100%;
  box-sizing: border-box;
  .top {
    display: flex;
    margin-bottom: 50px;
    .top-box {
      flex: 1;
      margin: 0 10px;
      font-size: 18px;
    }
  }

  .el-table {
    border: 1px solid rgb(235, 238, 245);
    border-bottom: none;
  }
  .has-gutter th {
    border-right: 1px solid rgb(235, 238, 245);
    &:last-child {
      border-right: none;
    }
  }
  .el-table__row td {
    border-right: 1px solid rgb(235, 238, 245);
    &:last-child {
      border-right: none;
    }
  }
}
</style>