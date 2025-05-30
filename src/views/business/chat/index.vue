<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="对话内容：" />
      <el-input v-model="input" type="textarea" />
      <el-button size="small" @click="goChat('simple')">简单对话</el-button>
      <el-button size="small" @click="goChat('stream')">流式对话</el-button>
      <el-button size="small" @click="chatRe(input)">文档检索</el-button>
      <el-button size="small" @click="chatForm('1')">格式化输出</el-button>
      <el-button size="small" @click="() => chatId = ''">新对话</el-button>
      <el-button size="small" @click="() => shutFlag = false">中断对话</el-button>
    </el-form>
    <el-form>
      <el-form-item label="回答："/>
<!--      <el-input v-model="answer" type="textarea" :rows="8" readonly/>-->
      <div v-html="htmlContent"></div>
    </el-form>
  </div>
</template>

<script setup>
import {simpleChat, streamChat, url, chatRetrieve, chatForm} from '@/api/business/front'
import { getToken } from "@/utils/auth.js";
import MarkdownIt from "markdown-it";
import markdownItMathjax from 'markdown-it-mathjax'
import mk from 'markdown-it-katex'
import mkl from 'markdown-it-latex'

const input = ref('')
const answer = ref('')
const chatId = ref('')
const shutFlag = ref(true)
// markdown展示输出内容
const md = new MarkdownIt()
md.use(markdownItMathjax).use(mk, {
  throwOnError: false
}).use(mkl)
const htmlContent = computed(() => md.render(answer.value))

// 对话接口
function goChat(type) {
  if (type === 'simple') {
    answer.value = '生成结果中，请稍候。。。'
    simpleChat(input.value).then(response => {
      if (typeof response === 'string') {
        console.log(response)
      }
      answer.value = response
    }).catch(() => {
      console.log('服务繁忙')
    })
  } else {
    answer.value = '生成结果中，请稍候。。。'
    // streamChat(input.value).then(response => {
    //   answer.value = response
    // })
    streamChat1()
  }

}

const streamChat1 = async () => {
  const decoder = new TextDecoder('utf-8')
  try {
    let streamUrl = 'http://localhost/dev-api/business/aiChat/stream/chat?input=' + input.value
    if (chatId.value) {
      streamUrl += '&chatId=' + chatId.value
    }
    const response = await fetch(streamUrl, {
      headers: {
        Authorization: "Bearer " + getToken()
      },
      method: 'get',
    })
    console.log(response)
    const stream = response.body
    const reader = stream.getReader()
    let buffer = ''
    while (shutFlag.value) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, {stream: true})
      const boundary = '\n\n'
      let boundaryIndex
      while ((boundaryIndex = buffer.indexOf(boundary)) !== -1) {
        const chunk = buffer.slice(0, boundaryIndex)
        buffer = buffer.slice(boundaryIndex + boundary.length)
        const data = chunk.replace(/^data:/gm, '').trim()
        let json = JSON.parse(data)
        if (json) {
          chatId.value = json.chatId
          let text = json.data
          answer.value = text.replace('<think>', '思考开始：').replace('</think>', '思考结束。\r\n').replace(/^\n?/gm, '').trim()
        }
      }
    }
  } catch (error) {
    console.error('Error fetching Ai text:', error)
  }

}

const chatRe = (data) => {
  chatRetrieve(data).then(response => {
    console.log(response)
    // answer.value = response
  })
}

</script>

<style scoped lang="scss">

</style>