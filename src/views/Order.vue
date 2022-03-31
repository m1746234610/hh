<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          type="text"
          v-model="orderNo"
          style="min-width: 200px; width: 200px; margin-right: 10px"
          placeholder="请输入订单号"
          size="default"
          clearable
        />
        <el-select
          @change="handleOption"
          v-model="orderStatus"
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
        <!-- 加()是为了防止事件触发后，默认会将event作为第一个参数传给事件对象 -->
        <el-button type="primary" size="default" @click="handleConfig()">
          <i class="iconfont icon-shoushupeihuo" />
          <span>配货完成</span>
        </el-button>
        <el-button type="primary" size="default" @click="handleSend()">
          <i class="iconfont icon-chuku" />
          <span>出库</span>
        </el-button>
        <el-button type="danger" size="default" @click="handleClose()">
          <i class="iconfont icon-tuihuobaozhang" />
          <span>退货</span>
        </el-button>
      </div>
    </template>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="订单号" prop="orderNo" />
      <el-table-column label="订单总价" prop="totalPrice" />
      <el-table-column label="订单状态" prop="orderStatus">
        <template v-slot="{ row }">
          <span>{{ $filters.orderMap(row.orderStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式">
        <template v-slot="{ row }">
          <span v-if="row.payType === 1">支付宝</span>
          <span v-else-if="row.payType === 2">微信</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" />
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
            v-if="!(row.orderStatus === 4 || row.orderStatus < 0)"
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
import { ref, reactive, toRefs, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "@/utils/axios"
export default {
  name: 'Order',
  setup() {
    const router = useRouter()
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总数量
      pageSize: 10, // 分页大小
      currentPage: 1, // 当前页
      orderNo: '', // 订单号
      orderStatus: '', // 订单状态码
      options: [{
        value: '',
        label: '全部',
      }, {
        value: 0,
        label: '待支付',
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '配货完成'
      }, {
        value: 3,
        label: '出库成功'
      }, {
        value: 4,
        label: '交易成功'
      }, {
        value: -1,
        label: '手动关闭'
      }, {
        value: -2,
        label: '超时关闭'
      }, {
        value: -3,
        label: '商家关闭'
      }]
    })

    /**
     * 公共方法
     */

    // 订单状态
    const orderStatusChange = (id, api) => {
      let status = {
        checkDone: '配货完成',
        checkOut: '出库成功',
        close: '关闭成功',
      }

      console.log(id, api);

      let params
      // 单个订单操作
      if (id) {
        params = [id]
      } else {
        // 多个订单操作
        if (state.multipleSelection.length) {
          params = state.multipleSelection.map(v => v.orderId)
          // console.log(params);
        } else {
          ElMessage.error('请选择项')
          return
        }
      }


      axios.put(`/orders/${api}`, {
        ids: params
      }).then(() => {
        ElMessage.success(status[api])
        getOrderList()
      })
    }

    // 加载页面
    onMounted(() => {
      getOrderList()
    })

    // 获取列表
    const getOrderList = () => {
      state.loading = true
      axios.get('/orders', {
        params: {
          orderNo: state.orderNo,
          pageSize: state.pageSize,
          pageNumber: state.currentPage,
          orderStatus: state.orderStatus,
        }
      }).then(res => {
        state.loading = false
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
      })
    }

    // 触发过滤项方法
    const handleOption = () => {
      state.currentPage = 1
      getOrderList()
    }

    // 选中
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
      // console.log(state.multipleSelection);
    }

    // 翻页
    const changePage = (val) => {
      state.currentPage = val
      getOrderList()
    }

    // 配货完成
    const handleConfig = (id) => {
      // console.log(id);
      orderStatusChange(id, 'checkDone')
    }

    // 出库
    const handleSend = (id) => {
      let params
      if (id) {
        params = [id]
      } else {
        if (state.multipleSelection.length) {
          params = state.multipleSelection.map(v => v.orderId)
          console.log(params);
        } else {
          ElMessage.error('请选择项')
          return
        }
      }

      axios.put('/orders/checkOut', {
        ids: params
      }).then(() => {
        ElMessage.success('出库成功')
        getOrderList()
      })
    }

    // 关闭订单
    const handleClose = (id) => {
      let params
      if (state.multipleSelection.length) {
        params = state.multipleSelection.map(v => v.orderId)
      } else {
        ElMessage.error('请选择项')
        return
      }

      axios.put('/orders/close', {
        ids: params
      }).then(() => {
        ElMessage.success('关闭成功')
        getOrderList()
      })
    }

    return {
      ...toRefs(state),
      changePage,
      getOrderList,
      handleSelectionChange,
      handleConfig,
      handleOption,
      handleSend,
      handleClose,
    }
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