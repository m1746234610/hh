<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          type="text"
          v-model="orderNo"
          style="min-width: 200px; margin-right: 10px"
          placeholder="请输入订单号"
          size="default"
          clearable
        />
        <el-select
          @change="handleOption"
          v-model="orderStatus"
          placeholder="全部"
          size="default"
          style="min-width: 200px; margin-right: 10px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" size="default" @click="handleAdd">
          <i class="iconfont icon-shoushupeihuo" />
          <span>配货完成</span>
        </el-button>
        <el-button type="primary" size="default" @click="handleAdd">
          <i class="iconfont icon-chuku" />
          <span>出库</span>
        </el-button>
        <el-button type="danger" size="default" @click="handleAdd">
          <i class="iconfont icon-tuihuobaozhang" />
          <span>退货</span>
        </el-button>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="tableForm"
      style="width: 100%"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单号" prop="ordelNo" />
      <el-table-column label="订单总价" prop="ordelNo" />
      <el-table-column label="订单状态" prop="ordelNo">
        <template v-slot="{ row }">
          <span>{{ $filters.orderMap(row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template v-slot="{ row }">
          <span v-if="row.payType === 1">支付宝支付</span>
          <span v-else-if="row.payType === 2">微信支付</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="ordelNo" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-popconfirm
            v-if="row.orderStatus === 1"
            title="确定配货完成吗？"
            @confirm="handleConfig(row.orderId)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px">配货完成</a>
            </template>
          </el-popconfirm>

          <el-popconfirm
            v-if="row.orderStatus === 2"
            title="确定出库吗？"
            @confirm="handleSend(row.orderId)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px">出库</a>
            </template>
          </el-popconfirm>

          <el-popconfirm
            v-if="!(row.orderStatus == 4 || row.orderStatus < 0)"
            title="确定关闭订单吗？"
            @confirm="handleClose(row.orderId)"
          >
            <template #reference>
              <a style="cursor: pointer; margin-right: 10px">关闭订单</a>
            </template>
          </el-popconfirm>
          <router-link
            :to="{
              name: 'order_detail',
              query: {
                id: row.orderId
              }
            }"
          >订单详情</router-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
export default {
  name: 'Order',
  setup() {

  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  .input {
    margin-right: 30px;
  }
}
</style>

<style lang="less" scoped>
.iconfont {
  margin-right: 5px;
}
</style>