<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >导入</el-button>
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleTemplate"
        >模板上传</el-button>
      </el-col>
    </el-row>
    <el-col :span="20" :xs="24">
      <el-table v-loading="loading" :data="verifyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="计量器具名称" align="center" key="equipmentName" prop="equipmentName" />
        <el-table-column label="出厂编号" align="center" key="factoryNumber" prop="factoryNumber" :show-overflow-tooltip="true" />
        <el-table-column label="生产厂家" align="center" key="factoryName" prop="factoryName" :show-overflow-tooltip="true" />
        <el-table-column label="准确度等级" align="center" key="accuracyClass" prop="accuracyClass" :show-overflow-tooltip="true" />
        <el-table-column label="量程" align="center" key="range" prop="range" />
        <el-table-column label="分度值" align="center" key="resolution" prop="resolution"></el-table-column>
        <el-table-column label="备注/其他单位" align="center" key="remark" prop="remark"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
              <el-button link type="primary" icon="Edit" @click=""></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </el-col>

    <!-- 导入框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 模板上传 -->
    <el-dialog :title="temUpload.title" v-model="temUpload.open" width="400px" append-to-body>
      <el-upload
          ref="temUploadRef"
          :limit="1"
          accept=".docx, .doc"
          :headers="temUpload.headers"
          :action="temUpload.url"
          :disabled="temUpload.isUploading"
          :on-progress="handleTemUploadProgress"
          :on-success="handleTemSuccess"
          :auto-upload="false"
          drag
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入doc、docx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitTemForm">确 定</el-button>
          <el-button @click="temUpload.open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>

import { getToken } from "@/utils/auth";
import { getPage, uploadTemplateUrl, importDataUrl } from '@/api/business/verify'

const { proxy } = getCurrentInstance();
const verifyList = ref([])
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const loading = ref(false)
const total = ref(0)
/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + importDataUrl
});

/*** 模板上传参数 */
const temUpload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: "Bearer " + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + uploadTemplateUrl
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
    userName:
        [
            { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "用户名称长度必须介于 2 和 20 之间", trigger: "blur" }],
  }
});

const { queryParams, form, rules } = toRefs(data);

function query() {
  loading.value = true
  getPage(queryParams.value).then(res => {
    verifyList.value = res.rows
    total.value = res.total
    loading.value = false
  })
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length !== 1;
  multiple.value = !selection.length;
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "数据导入";
  upload.open = true;
}

/** 模板导入按钮 */
function handleTemplate() {
  temUpload.title = "模板上传";
  temUpload.open = true;
}

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
}

/**模板上传中处理 */
const handleTemUploadProgress = (event, file, fileList) => {
  temUpload.isUploading = true;
}

/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].handleRemove(file);
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true })
}

const handleTemSuccess = (response, file, fileList) => {
  temUpload.open = false
  temUpload.isUploading = false
  proxy.$refs["temUploadRef"].handleRemove(file)
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "上传结果", { dangerouslyUseHTMLString: true })
  console.log(response.data)
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

/** 模板上传 */
function submitTemForm() {
  proxy.$refs["temUploadRef"].submit();
}

query()

</script>

<style scoped lang="scss">

</style>