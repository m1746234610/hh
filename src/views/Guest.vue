<template>
  <el-card class="guest-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" @click="handleSolve">
          <i class="iconfont icon-jiechu" />
          <span>解禁账户</span>
        </el-button>
        <el-button type="danger" size="small" @click="handleForbid">
          <i class="iconfont icon-jinyong" />
          <span>禁用账户</span>
        </el-button>
      </div>
    </template>

    <Table ref="table" action="/users">
      <template #column>
        <el-table-column width="55" type="selection" />
        <el-table-column label="昵称" prop="nickName" />
        <el-table-column label="登录名" prop="loginName" />
        <el-table-column label="身份状态">
          <template v-slot="{ row }">
            <span
              :style="{ 'color': row.lockedFlag == 0 ? 'green' : 'red' }"
            >{{ row.lockedFlag == 0 ? '正常' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否注销">
          <template v-slot="{ row }">
            <span
              :style="row.lockedFlag == 0 ? 'color: green;' : 'color: red;'"
            >{{ row.isDeleted == 0 ? '正常' : '注销' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createTime" />
      </template>
    </Table>
  </el-card>
</template>

<script>
import Table from '@/components/Table.vue'
import axios from 'axios'
import { ref, reactive, toRefs } from 'vue'
export default {
  name: 'Guest',
  components: {
    Table
  },
  setup() {
    const table = ref(null)

    /**
     * 封装方法
     */
    // 解禁、禁用用户
    const SolveForbid = (status) => {
      if (!table.value.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }

      axios.put(`users/${status}`, {
        ids: table.value.multipleSelection.map(v => v.userId)
      }).then(() => {
        ElMessage.success(status === 0 ? '解除成功' : '禁用成功')
        table.value.getList()
      })
    }

    // 解禁用户
    const handleSolve = () => {
      SolveForbid(0)
    }

    // 禁用用户
    const handleForbid = () => {
      SolveForbid(1)
    }

    return {
      table,
      handleSolve,
      handleForbid,
    }
  }
}
</script>

<style>
</style>