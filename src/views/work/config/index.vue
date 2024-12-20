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
            @click="() => {open = true}"
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
          {{ scope.row.file }}
        </template>
      </el-table-column>
      <el-table-column label="是否部署" align="center" prop="needDeploy" >
        <template #default="scope">
          <span>{{ scope.row.needDeploy === 1 ? "是" : "否"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button size="small">部署</el-button>
          <el-button size="small">部署</el-button>
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

    <el-dialog v-model="open" :title="title" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="workflowRef" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作流名称" label-width="100px" prop="name">
              <el-input v-model="form.name" placeholder="请输入工作流名称" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="工作流文件" label-width="100px" prop="filef">
              <el-upload
                  ref="uploadRef"
                  :limit="1"
                  :headers="upload.headers"
                  :action="upload.url"
                  :disabled="upload.isUploading"
                  :on-progress="handleFileUploadProgress"
                  :on-success="handleFileSuccess"
                  :on-error="handleFileError"
                  :auto-upload="false"
                  drag
              >
                <template #trigger>
                  <el-button size="small" type="primary">选取文件</el-button>
                </template>
                <el-button style="margin-left: 10px;" size="small" type="success" :loading="upload.isUploading" @click="submitUpload">上传到服务器</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="work">

import { getWorkflow } from "@/api/work/config.js";
import Pagination from "@/components/Pagination/index.vue";
import { getToken } from "@/utils/auth.js";

const { proxy } = getCurrentInstance()

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
const form = ref({
  name: "",
  filePath: "",
  fileId: ""
})
const rules = {
  name: [{ required: true, message: "请输入工作流名称", trigger: "blur" }]
}

/** 文件上传 */
const upload = reactive({
  open: false,
  title: "",
  isUploading: false,
  headers: { Authorization: "Bearer " + getToken()},
  url: import.meta.env.VITE_APP_BASE_API + "/file/upload"
})

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.isUploading = false;
  console.log(response)
  if (response.code === 500) {
    proxy.$message.error("上传失败");
  } else {
    form.value.filePath = response.url;
    form.value.fileId = response.id;
  }
};

/** 文件上传失败处理 */
const handleFileError = (err, file, fileList) => {
  upload.isUploading = false;
  proxy.$message.error("上传失败");
};

/**文件上城 */
function submitUpload() {
  proxy.$refs["uploadRef"].submit();
}

// Promise测试
const gen = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(function (){
      if (time < 500) {
        resolve(time);
      } else {
        reject(time)
      }
    }, time)
  })
}

// 查询
function getList() {
  loading.value = true;
  gen(Math.random() * 1000)
      .then(val => {console.log("resolve", val)})
      .catch(val => {console.log("reject", val)})
      .finally(() => {console.log("finally")})
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