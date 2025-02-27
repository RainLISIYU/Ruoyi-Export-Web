<template>
  <div class="app-container">
    <el-table :data="tableData">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作">
        <template #default="scope">
<!--          <el-button size="small" @click="clickWarn(scope.row)">点击</el-button>-->
          <el-button size="small" @click="() => clickTest(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendMsg, getInfo, getUser } from '@/api/business/front'
const messageList = ref([])
const message = {
  'msg': '',
  'chat': '',
}
const { proxy } = getCurrentInstance()
const input = ref('')
const answer = ref('')
const tableData = [
  {
    id: 1,
    date: '2024-09-26',
    name: 'tom',
    address: 'shhh'
  },
  {
    id: 2,
    date: '2024-09-26',
    name: 'jerry',
    address: 'xshye'
  }
]

function clickTest(row) {
  if (row.id % 2 === 1) {
    // Dubbo请求
    getInfo().then(response => {
      console.log(response.data)
    })
  } else {
    // Feign请求
    getUser().then(response => {
      console.log(response.data)
    })
  }
}

function clickWarn(row) {
  message.msg = row.name + row.address
  sendMsg(message)
}


</script>

<style scoped lang="scss">

</style>