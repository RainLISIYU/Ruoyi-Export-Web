<template>
  <el-dialog v-model="open" :title="title" width="600px" @close="closeAdd" append-to-body>
    <el-form :model="form" :rules="rules" ref="workflowRef" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="工作流名称" label-width="100px" prop="name">
            <el-input v-model="form.name" placeholder="请输入工作流名称" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工作流文件" label-width="100px" prop="file">
            <FileUpload v-model:model-value="form.fileList" :limit="1" :file-type="['xml']" />
          </el-form-item>
          <el-form-item label="工作流图片" label-width="100px" prop="file">
            <ImageUpload v-model:model-value="form.imgList" :limit="1" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="closeAdd">取消</el-button>
      <el-button type="primary" @click="confirmSave">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { getToken } from "@/utils/auth.js";
import { saveWorkFlow } from "@/api/work/config.js";
import ImageUpload from "@/components/ImageUpload/index.vue";
import FileUpload from "@/components/FileUpload/index.vue";

const { proxy } = getCurrentInstance()
const open = ref(false)
const rules = {
  name: [{
    required: true,
    message: "请输入工作流名称",
    trigger: "blur"
  }]
}
const props = defineProps({
  getList: Function
})

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
watch(() => form.imgList, (list) => {
  if (list?.length > 0) {
    form.imgId = list[0].id
    form.imgName = list[0].name
    form.imgPath = list[0].url
  }
})
watch(() => form.fileList, (list) => {
  if (list?.length > 0) {
    form.fileId = list[0].id
    form.fileName = list[0].name
    form.filePath = list[0].url
  }
})
computed(() => {
  return form.imgPath && form.imgPath.length > 0
});
/** 文件上传 */
const upload = reactive({
  open: false,
  title: "",
  isUploading: false,
  headers: { Authorization: "Bearer " + getToken()},
  url: import.meta.env.VITE_APP_BASE_API + "/file/upload"
})

// 新增初始
const openAdd = () => {
  open.value = true
  initAdd()
}
// 关闭初始
const closeAdd = () => {
  open.value = false
  initAdd()
}
// 初始化新增弹框
const initAdd = () => {
  form.id = ''
  form.name = ''
  form.fileId = ''
  form.filePath = ''
  form.fileName = ''
  form.fileList = []
  form.imgId = ''
  form.imgName = ''
  form.imgPath = ''
  form.imgList = []
}

// 编辑
const initEdit = (data) => {
  form.id = data.id
  form.name = data.name
  form.fileName = data.fileName
  form.filePath = data.filePath
  form.fileId = data.fileId
  if (data.fileName && data.fileName !== '') {
    let file = {
      id: data.fileId,
      url: data.filePath,
      name: data.fileName,
    }
    form.fileList.push(file)
  }
  form.imgId = data.imgId
  form.imgPath = data.imgPath
  form.imgName = data.imgName
  if (data.imgName && data.imgName !== '') {
    let img = {
      id: data.imgId,
      url: data.imgPath,
      name: data.imgName,
    }
    form.imgList.push(img)
  }
  open.value = true
}

// 新增确定
const confirmSave = () => {
  if (!form.name || form.name === "") {
    proxy.$message.error("请输入工作流名称");
    return;
  }
  if (!form.filePath || form.filePath === "") {
    proxy.$message.error("请上传工作流文件");
    return;
  }
  saveWorkFlow(form).then(res => {
    closeAdd()
    if (res.code === 500) {
      proxy.$message.error(res.msg);
      return;
    }
    proxy.$message.success(res.msg)
    props.getList()
  }).catch(res => {
    proxy.$message.error(res.msg)
  })
}

// 暴露方法
defineExpose({
  openAdd,
  initEdit,
})
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
  display: none;
}
</style>