<template>
  <div class="order">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>今日订单</span>
        </div>
      </template>
      <p>32542件</p>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>今日完工</span>
        </div>
      </template>
      <p>24515件</p>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>转化率</span>
        </div>
      </template>
      <p>20%</p>
    </el-card>

    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>今日流水</span>
        </div>
      </template>
      <p>300542</p>
    </el-card>
  </div>
  <div id="zoom"></div>
</template>

<script>
import { onMounted, onUnmounted } from "vue"

let myChart = null
export default {
  name: 'Home',
  setup() {
    onMounted(() => {
      if (echarts) {
        // 基于准备好的dom，初始化echarts实例
        myChart = echarts.init(document.querySelector('#zoom'))

        // 指定图表的配置项和数据
        const option = {
          title: {
            text: '系统折线图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['新增注册', '付费用户', '活跃用户', '订单数', '当日总收入']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['2021-03-11', '2021-03-12', '2021-03-13', '2021-03-14', '2021-03-15', '2021-03-16', '2021-03-17']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '新增注册',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '付费用户',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: '活跃用户',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: '订单数',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: '当日总收入',
              type: 'line',
              stack: '总量',
              label: {
                show: true,
                position: 'top'
              },
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        }

        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option)
      }
    })

    // 销毁组件后，将myChart也销毁
    onUnmounted(() => {
      myChart.dispose()
    })
  }
}
</script>

<style lang="less" scoped>
.order {
  display: flex;
  .box-card {
    flex: 1;
    margin: 20px 10px;
    text-align: center;
    cursor: default;
  }
}
#zoom {
  height: 350px;
}
</style>