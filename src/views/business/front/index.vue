<script setup>
import { ref } from 'vue'
import { sendMsg } from '@/api/business/front'
const title = ref('Hello World')
const message = {
  'msg': ''
}
const tableData = [
  {
    id: 12983718390123,
    date: '2024-09-26',
    name: 'tom',
    address: 'shhh'
  },
  {
    id: 8762178301298763,
    date: '2024-09-26',
    name: 'jerry',
    address: 'xshye'
  }
]

function clickWarn(row) {
  message.msg = row.name + row.address
  sendMsg(message)
}
</script>

<template>
  <div class="app-container">
    <h1>{{title}}</h1>
    <el-table :data="tableData">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="clickWarn(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">

</style>