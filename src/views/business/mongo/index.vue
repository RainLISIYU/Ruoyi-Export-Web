<template>
  <el-container>
    <el-main>
      <el-row>
        <el-form :model="movieParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="电影名称" prop="title">
            <el-input
                v-model="movieParams.title"
                placeholder="请输入电影名称"
                clearable
                style="width: 240px"
                @keyup.enter="listMovies"
            />
          </el-form-item>
          <el-form-item label="体裁" prop="genre">
            <el-select
                v-model="movieParams.genre"
                clearable
                style="width: 240px">
              <el-option v-for="gen in genres" :key="gen.value" :label="gen.label" :value="gen.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button id="search-btn" type="primary" icon="Search" @click="listMovies">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-col>
        <el-row :span="18"></el-row>
        <el-col :span="6">
          <el-button type="primary" @click="openDialog"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="primary" @click="syncHand" :loading="syncLoading"><el-icon><Plus /></el-icon>同步</el-button>
        </el-col>
      </el-col>
      <el-table :data="movieList" v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="title" label="电影名称" align="center"></el-table-column>
        <el-table-column prop="genres" label="体裁" align="center"></el-table-column>
        <el-table-column prop="rated" label="分级" align="center"></el-table-column>
        <el-table-column prop="director" label="导演" align="center">
          <template #default="scope">
            {{ scope.row.director.country }} - {{ scope.row.director.name }}
          </template>
        </el-table-column>
        <el-table-column prop="runtime" label="时长" align="center"></el-table-column>
        <el-table-column prop="year" label="年份" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openDialog">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="movieParams.pageNum"
          v-model:limit="movieParams.pageSize"
          @pagination="listMovies"
      />
    </el-main>

    <!--  新增  -->
    <el-dialog destroy-on-close title="新增" v-model="visible" @close="clearMovie">
      <el-form ref="movieRef" :label-position="'right'" label-width="120px">
        <el-form-item label="电影名称" prop="title">
          <el-input v-model="movie.title"></el-input>
        </el-form-item>
        <el-form-item label="体裁" prop="genres">
          <el-checkbox-group v-model="movie.genres">
            <el-checkbox v-for="gen in genres" :value="gen.value" :label="gen.label"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="时长" prop="runtime">
          <el-input-number :min="inputNumberMin" controls-position="right" v-model="movie.runtime"></el-input-number>
        </el-form-item>
        <el-form-item label="导演" prop="director">
          <el-row :gutter="20" justify="end">
            <el-col :span="4" >
              姓名：
            </el-col>
            <el-col :span="8">
              <el-input v-model="movie.director.name"></el-input>
            </el-col>
            <el-col :span="4">
              国家：
            </el-col>
            <el-col :span="8">
              <el-select v-model="movie.director.country">
                <el-option v-for="item in country" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="分级" prop="rated">
          <el-radio v-model="movie.rated" value="PG-8">PG-8</el-radio>
          <el-radio v-model="movie.rated" value="PG-13">PG-13</el-radio>
          <el-radio v-model="movie.rated" value="PG-18">PG-18</el-radio>
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-date-picker v-model="movie.year" type="year" placeholder="选择年份" value-format="YYYY" :disabled-date="disableDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="图片" prop="file">
          <ImageUpload v-model:model-value="movie.file" :limit="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="saveLoading" type="primary" @click="confirm">确定</el-button>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
  </el-container>
  <router-view />
</template>

<script setup>

import {Plus} from "@element-plus/icons-vue";
import ImageUpload from "@/components/ImageUpload/index.vue";
import { saveMongo, getMovies, syncMovies } from "@/api/business/mongo.js";

const visible = ref(false)
const show = ref(true)
const movie = reactive({
  id: '',
  title: '',
  genres: [],
  runtime: 0,
  director: {
    name: '',
    country: ''
  },
  rated: '',
  year: '',
  file: [],
  fileIds: ''
})
// 国家
const country = ref([
  {
    value: 'CN',
    label: '中国'
  },
  {
    value: 'USA',
    label: '美国'
  },
  {
    value: 'JP',
    label: '日本'
  }
])
// 体裁
const genres = ref([
  {
    value: '动作',
    label: '动作'
  },
  {
    value: '喜剧',
    label: '喜剧'
  },
  {
    value: '剧情',
    label: '剧情'
  },
  {
    value: '历史',
    label: '历史'
  },
  {
    value: '动漫',
    label: '动漫'
  }
])

const movieList = ref([])
const movieParams = reactive({
  title: '',
  genre: '',
  pageNum: 1,
  pageSize: 10
})
const total = ref(0)
const loading = ref(false)
const syncLoading = ref(false)
const inputNumberMin = ref(0)
const { proxy } = getCurrentInstance()
const saveLoading = ref(false)

const openDialog = () => {
  visible.value = true
}

// 清空数据
const clearMovie = () => {
  movie.id = ''
  movie.title = ''
  movie.genres = []
  movie.runtime = 0
  movie.director.name = ''
  movie.director.country = ''
  movie.rated = ''
  movie.year = ''
  movie.file = []
  movie.fileIds = ''
}

// 保存
const confirm = () => {
  saveLoading.value = true
  movie.fileIds = movie.file.map(item => item.id).join(',')
  const data = {
    id: movie.id,
    title: movie.title,
    genres: movie.genres,
    runtime: movie.runtime,
    director: {
      name: movie.director.name,
      country: movie.director.country
    },
    rated: movie.rated,
    year: movie.year,
    fileIds: movie.fileIds
  }
  // 请求
  saveMongo(data).then(res => {
    console.log(res)
    if (res.code === 200) {
      proxy.$modal.msgSuccess(res.msg)
      resetQuery()
    } else {
      proxy.$modal.msgError(res.msg)
    }
  })
  saveLoading.value = false
  close()
}

const resetQuery = () => {
  movieParams.title = ''
  movieParams.genre = ''
  listMovies()
}

const random = (number) => {
  return Math.floor(Math.random() * (number + 1))
}

const listMovies = () => {
  loading.value = true
  getMovies(movieParams)
      .then(res => {
        if (res.code === 200) {
          movieList.value = res.data.records
          total.value = res.data.total
          loading.value = false
        } else {
          proxy.$message.error(res.msg)
        }
      })
}

onMounted(() => {
  const searchBtn = document.querySelector('#search-btn')
  searchBtn?.addEventListener('click', (event) => {
    searchBtn.style.backgroundColor = `rgb(${random(255)}, ${random(255)}, ${random(255)})`
  })
})

const disableDate = (date) => {
  return date.getTime() > Date.now()
}

const syncHand = () => {
  syncLoading.value = true
  syncMovies().then(res => {
    syncLoading.value = false
    if (res.code === 200) {
      proxy.$message.success(res.msg)
    } else {
      proxy.$message.error(res.msg)
    }
  })
}

listMovies()

// 关闭弹窗
const close = () => {
  visible.value = false
}
</script>

<style>
.col-style {
  color: #000000;
  border-radius: 4px;
  height: 20px;
  text-align: center;
}

.video-form {
  border: 1px solid #dcdfe6;
  width: 400px;
  height: 300px;
}

.video-error-content {
  margin-top: 100px;
  text-align: center;
  font-size: 20px;
  color: red;
}

.fade-enter-active {
  transition: all 0.3s ease-out;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>