<template>
  <div class="app-container">
    <el-table :data="tableData">
      <el-table-column prop="date" label="日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="clickWarn(scope.row)">消息</el-button>
          <el-button size="small" @click="() => clickTest(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>header</span>
        </div>
      </template>
      <p v-for="[k, v] in map" :key="k">{{ v }}</p>
      <template #footer>
        <div>
          <span>footer</span>
        </div>
      </template>
    </el-card>
    <canvas height="600" width="600"></canvas>
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
const map = reactive(new Map())
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
  message.msg = row.name + row.address + (Math.random() * 100)
  sendMsg(message)
}

onBeforeMount(() => {
  map.set('ak', 'a')
  map.set('bk', 'b')
  map.set('ck', 'c')
  map.set('jk', 'j')
  map.set('ik', 'q')
})

async function foo() {
  try {
    await doAnything()
    await doSomething()
  } catch (e) {
    console.log(e)
  }
}

class Shape {
  name
  length
  #area

  constructor(name, length) {
    this.name = name
    this.length = length
  }

  calArea() {
    this.#area = this.length * 2.53
  }

  printArea() {
    console.log(`${this.name}的面积是${this.#area}`)
  }
}

const shape = new Shape("自定义形状", 3.22)
shape.calArea()
shape.printArea()

const objTest = () => {
  let obj = shape
  while (obj) {
    console.log(obj)
    obj = Object.getPrototypeOf(obj)
  }
}

objTest()

const doSomething = async () => {
  map.set('dk', 'df')
  map.set('fk', 'ff')
}

const doAnything = async () => {
  map.set('ek', 'ee')
}

foo()
</script>

<style scoped lang="scss">
canvas {
  border: 1px solid #000;
}
</style>