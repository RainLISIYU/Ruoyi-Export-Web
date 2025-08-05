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
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleTemplate"
        >模板上传</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            :disabled="multiple"
            @click="handleGenerate"
        >生成证书</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-col :xs="24">
      <el-table v-loading="loading" :data="verifyList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="计量器具名称" align="center" key="equipmentName" prop="equipmentName" />
        <el-table-column label="出厂编号" align="center" key="factoryNumber" prop="factoryNumber" :show-overflow-tooltip="true" />
        <el-table-column label="生产厂家" align="center" key="factoryName" prop="factoryName" :show-overflow-tooltip="true" />
        <el-table-column label="准确度等级" align="center" key="accuracyClass" prop="accuracyClass" :show-overflow-tooltip="true" />
        <el-table-column label="量程" align="center" key="scaleRange" prop="scaleRange" />
        <el-table-column label="分度值" align="center" key="resolution" prop="resolution"></el-table-column>
        <el-table-column label="备注/其他单位" align="center" key="remark" prop="remark"></el-table-column>
        <el-table-column label="导入时间" align="center" prop="createdAt" width="160">
<!--          <template #default="scope">-->
<!--            <span>{{ parseTime(scope.row.createdAt) }}</span>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="生成证书" placement="top" >
              <el-button link type="primary" icon="MessageBox" @click="handleGenerate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top" >
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" >
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="query"
      />
    </el-col>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form :model="form" :rules="rules" ref="verifyRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="certificateNo">
              <el-input v-model="form.certificateNo" placeholder="请输入证书编号" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="器具名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" plcaeholder="计量器具名称" maxlength="32"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="model">
              <el-input v-model="form.model" placeholder="请输入规格型号" maxlength="32"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂编号" prop="factoryNumber">
              <el-input v-model="form.factoryNumber" placeholder="请输入出厂编号" maxlength="32" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="样品编号" prop="sampleNumber">
              <el-input v-model="form.sampleNumber" placeholder="请输入样品编号" maxlength="64"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂商" prop="factoryName">
              <el-input v-model="form.factoryName" placeholder="请输入生产厂商" maxlength="64"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="准确度等级" prop="accuracyClass">
              <el-input v-model="form.accuracyClass" placeholder="请输入准确度等级" maxlength="32"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="量程" prop="scaleRange">
              <el-input v-model="form.scaleRange" placeholder="请输入量程" maxlength="32"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分度值" prop="resolution">
              <el-input v-model="form.resolution" placeholder="请输入分度值" maxlength="32"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检定日期" prop="appraisalDate">
              <el-date-picker v-model="form.appraisalDate" value-format="YYYY-MM-DD" placeholder="请选择检定日期" maxlength="32"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="检定结果" prop="appraisalResult">
              <el-input v-model="form.appraisalResult" placeholder="请输入检定结果" maxlength="512"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="计量标准" prop="measuringStandard">
              <el-select v-model="form.measuringStandard" placeholder="请选择计量标准" >
                <el-option label="国标" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检定地点" prop="appraisalAddress">
              <el-input v-model="form.appraisalAddress" placeholder="请输入检定地点" maxlength="64"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="温度" prop="temperature">
              <el-input v-model="form.temperature" placeholder="请输入温度" >
                <template #append>℃</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="湿度" prop="humidity">
              <el-input v-model="form.humidity" placeholder="请输入湿度" >
                <template #append>%RH</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="批准人">
              <ImageUpload v-model:model-value="form.approveMap" :limit="1" :is-multiple="false" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核验员">
              <ImageUpload v-model:model-value="form.checkMap" :limit="1" :is-multiple="false" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检定员">
              <ImageUpload v-model:model-value="form.verifyMap" :limit="1" :is-multiple="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="证书文件">
              <FileUpload v-model:model-value="form.certificateUrl" :limit="1" :is-show-del="delFlag" :is-show-tip="delFlag"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

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
          :fileType="temUpload.fileType"
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
import { getPage, delCertificate, getInfo, saveOrUpdate, genCertificate, uploadTemplateUrl, importDataUrl } from '@/api/business/verify'
import FileUpload from "@/components/FileUpload/index.vue"
import ImageUpload from "@/components/ImageUpload/index.vue"

const { proxy } = getCurrentInstance();
const verifyList = ref([])
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const loading = ref(false)
const total = ref(0)
const open = ref(false)
const title = ref("")
const delFlag = ref(false)

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
  url: import.meta.env.VITE_APP_BASE_API + uploadTemplateUrl,
  // 文件类型
  fileType: ["doc", "docx"]
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

/** 查询请求 */
function query() {
  loading.value = true
  getPage(queryParams.value).then(res => {
    verifyList.value = res.rows
    total.value = res.total
    loading.value = false
  })
}

/** 新增操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加导入数据";
}

/** 生成证书 */
function handleGenerate(row) {
  const genIds = row.id || ids.value
  genCertificate(genIds).then(res => {
    if (res.code !== 200) {
      proxy.$modal.msgError(res.msg)
    } else {
      proxy.$modal.msgSuccess("生成成功")
    }
  })
}

/** 更新操作 */
function handleUpdate(row) {
  reset()
  getInfo(row.id).then(response => {
    form.value = response.data
    title.value = "修改导入数据"
    open.value = true
    if (response.data.approveUrl) {
      form.value.approveMap = []
      form.value.approveMap.push({ url: response.data.approveUrl })
    }
    if (response.data.checkUrl) {
      form.value.checkMap = []
      form.value.checkMap.push({ url: response.data.checkUrl })
    }
    if (response.data.verifyUrl) {
      form.value.verifyMap = []
      form.value.verifyMap.push({ url: response.data.verifyUrl })
    }
  })
}

/** 删除操作 */
function handleDelete(row) {
  const certificateIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除导入数据？').then(() =>{
    return delCertificate(certificateIds)
  }).then(() => {
    query()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 数据重置 */
function reset() {
  form.value = {
    // 主键
    id: undefined,
    // 编号
    no: undefined,
    // 证书编号
    certificateNo: undefined,
    // 器具名称
    equipmentName: undefined,
    // 规格型号
    model: undefined,
    // 出厂编号
    factoryNumber: undefined,
    // 样品编号
    sampleNumber: undefined,
    // 生产厂商
    factoryName: undefined,
    // 准确度等级
    accuracyClass: undefined,
    // 量程
    scaleRange: undefined,
    // 分度值
    resolution: undefined,
    // 检定日期
    appraisalDate: undefined,
    // 有效周期
    effectivePeriod: undefined,
    // 检定结果
    appraisalResult: undefined,
    // 计量标准id
    measuringStandard: undefined,
    // 检定地点
    appraisalAddress: undefined,
    // 温度
    temperature: undefined,
    // 湿度
    humidity: undefined,
    // 备注
    remark: undefined,
    // 证书路径
    certificateUrl: undefined,
    // 批准人
    approveUrl: undefined,
    approveMap: [],
    // 核验员
    checkUrl: undefined,
    checkMap: [],
    // 检定员
    verifyUrl: undefined,
    verifyMap: [],
  }
  proxy.resetForm("verifyRef")
}

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
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
  query()
}

const handleTemSuccess = (response, file, fileList) => {
  temUpload.open = false
  temUpload.isUploading = false
  proxy.$refs["temUploadRef"].handleRemove(file)
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "上传结果", { dangerouslyUseHTMLString: true })
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
}

/** 模板上传 */
function submitTemForm() {
  proxy.$refs["temUploadRef"].submit();
}

/** 表单提交 */
function submitForm() {
  if (form.value.approveMap?.length > 0) {
    form.value.approveUrl = form.value.approveMap[0].url
  }
  if (form.value.checkMap?.length > 0) {
    form.value.checkUrl = form.value.checkMap[0].url
  }
  if (form.value.verifyMap?.length > 0) {
    form.value.verifyUrl = form.value.verifyMap[0].url
  }
  proxy.$refs["verifyRef"].validate(valid => {
    if (valid) {
      if (form.value.id !== undefined) {
        form.value.updatedAt = null
        saveOrUpdate(form.value).then(response => {
          if (response.code === 200) {
            proxy.$modal.msgSuccess("修改成功")
          } else {
            pproxy.$modal.msgError(response.msg)
          }
          open.value = false
          query()
        })
      } else {
        saveOrUpdate(form.value).then(response => {
          if (response.code === 200) {
            proxy.$modal.msgSuccess("新增成功")
          } else {
            proxy.$modal.msgError(response.msg)
          }
          open.value = false
          query()
        })
      }
    }
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

query()

</script>

<style scoped lang="scss">

</style>