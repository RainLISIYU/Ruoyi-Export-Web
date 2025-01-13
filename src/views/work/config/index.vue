<template>
  <div class="app-container">
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="任务名称">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入工作流名称"
          clearable
          style="width: 200px"
          @keyup.enter="getList"
        />
      </el-form-item>
      <el-form-item label="查询条件">
        <el-input
          v-model="queryParams.other"
          placeholder="查询条件"
          clearable
          style="width: 200px"
          @keyup.enter=""
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="openAdd"
        >新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="workList">
      <el-table-column label="序号" width="50" type="index" align="center" >
        <template #default="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工作流名称" allign="center" prop="name" />
      <el-table-column label="工作流文件" align="center" prop="file">
        <template #default="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>
      <el-table-column label="是否部署" align="center" prop="needDeploy" >
        <template #default="scope">
          <span>{{ scope.row.needDeploy === 1 ? "是" : "否"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="initEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="primary">部署</el-button>
          <el-button size="small" type="danger" @click="deleteFlow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pafination="getList"
    />

    <Save ref="save" v-model:form="form" :getList="getList"/>

  </div>
</template>

<script setup name="work">

import { getWorkflow, saveWorkFlow, deleteWorkFlow } from "@/api/work/config.js";
import Pagination from "@/components/Pagination/index.vue";
import { getToken } from "@/utils/auth.js";
import Save from './components/save.vue'

const { proxy } = getCurrentInstance()

const save = ref('save')

/** 查询参数 */
const queryParams = ref({
  name: "",
  other: "",
  pageNum: 1,
  pageSize: 10
})

/** 列表数据 */
const loading = ref(true);
const workList = ref([]);
const total = ref(0);
const open = ref(false)

/** 添加弹框 */
const title = ref("添加")
const form = reactive({
  name: '',
  fileName: '',
  filePath: '',
  fileId: '',
  fileList: [],
  imgName: '',
  imgPath: '',
  imgId: '',
  imgList: [],
})

/** 文件上传 */
const upload = reactive({
  open: false,
  title: "",
  isUploading: false,
  headers: { Authorization: "Bearer " + getToken()},
  url: import.meta.env.VITE_APP_BASE_API + "/file/upload"
})

// 初始化新增弹框
const openAdd = () => {
  save.value.openAdd()
}
// 编辑
const initEdit = (data) => {
  save.value.initEdit(data)
}

// 删除
const deleteFlow = (data) => {
  proxy.$modal.confirm("是否删除该工作流？").then(() => {
    let ids = ref([])
    ids.value.push(data.id)
    return deleteWorkFlow(ids.value)
  }).then(res => {
    if (res.code === 200) {
      proxy.$message.success(res.msg);
    } else {
      proxy.$message.error(res.msg);
    }
    getList()
  })
}

// 查询
function getList() {
  loading.value = true;
  getWorkflow(queryParams.value).then(res => {
    workList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  })
}

// 重置
function reset() {
  queryParams.value = {
    name: "",
    other: ""
  };
  getList();
}

getList();
</script>

<style scoped lang="scss">

</style>