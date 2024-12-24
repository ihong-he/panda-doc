---
outline: [1, 3]
---

# 权限控制

权限控制是整个系统的核心，它负责控制用户对系统的访问权限。

## 一、用户管理

### 1. 页面模板

::: details 点击查看
```vue
<template>
  <div class="user-container">
    <!-- 搜索栏 -->
    <div class="table-search card" v-show="showSearch">
      <el-form :inline="true" :model="searchForm" class="search-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" icon="Search" @click="searchUser"
          >查询</el-button
        >
        <el-button icon="Refresh" @click="handleReset">重置</el-button>
      </div>
    </div>
    <!-- 表格内容 -->
    <div class="table-main card">
      <div class="table-header">
        <div>
          <el-button type="primary" icon="Plus" @click="addUser"
            >添加用户</el-button
          >
          <el-button
            type="danger"
            icon="Delete"
            plain
            :disabled="delDisabled"
            @click="allDel"
            >批量删除</el-button
          >
          <el-button type="success" icon="Download" plain>导出</el-button>
          <el-button type="default" icon="Upload" plain>导入</el-button>
        </div>
        <div>
          <el-button
            icon="Setting"
            circle
            plain
            @click="handleSetting"
          ></el-button>
          <el-button
            icon="Refresh"
            circle
            plain
            @click="handleRefresh"
          ></el-button>
          <el-button
            icon="FullScreen"
            circle
            plain
            @click="handleFullScreen"
          ></el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading="loading"
        element-loading-text="Loading..."
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column sortable prop="id" label="ID" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="gender" label="性别">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.gender == 0">男</el-tag>
            <el-tag type="danger" v-else>女</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="avator" label="头像" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="是否启用">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="editTime" label="更新时间" />

        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default>
            <el-button link type="danger" size="small" @click="delUser">
              删除
            </el-button>
            <el-button link type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-box">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :size="size"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="40"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="addDialogVisible" title="添加用户" width="40%">
      <el-form
        :model="addForm"
        ref="addFormRef"
        label-width="80px"
        :rules="rules"
        :label-position="labelPosition"
      >
        <el-form-item label="对齐方式" label-position="right">
          <el-radio-group v-model="labelPosition" aria-label="label position">
            <el-radio-button value="left">Left</el-radio-button>
            <el-radio-button value="right">Right</el-radio-button>
            <el-radio-button value="top">Top</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="addForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="addForm.gender">
            <el-radio value="1">男</el-radio>
            <el-radio value="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="addForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch v-model="addForm.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSumbit(addFormRef)">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const currentPage = ref(1);
const pageSize = ref(10);
const size = ref("default");
const background = ref(true);
const disabled = ref(false);
const loading = ref(false);
const addDialogVisible = ref(false);
const addForm = ref({
  name: "",
  role: "",
  gender: "1",
  email: "",
  status: 0,
});
const delDisabled = ref(true);
const labelPosition = ref("right");
const rules = {
  name: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
};
const addFormRef = ref();
const showSearch = ref(true);

const handleSetting = () => {
  console.log("Setting");
};
const handleFullScreen = () => {
  console.log("refresh");
  showSearch.value = !showSearch.value;
};
const handleSumbit = async (formEl) => {
  console.log("submit", addForm.value);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      // 调用接口
      addDialogVisible.value = false;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
const handleReset = () => {
  console.log("reset");
  searchForm.value = {};
};
const searchUser = () => {
  console.log("search");
  loading.value = true;
  // 模拟数据请求
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
const handleSelectionChange = (val, row) => {
  console.log(val, row);
  delDisabled.value = !val.length;
};
const allDel = () => {
  console.log("allDel");
};
const delUser = () => {
  console.log("del");
  // 确认删除
  ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 删除操作
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({});
    });
};
const addUser = () => {
  addDialogVisible.value = true;
};

const handleRefresh = () => {
  console.log("refresh");
  loading.value = true;
  // 模拟数据请求
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};
const searchForm = ref({
  username: "",
  phone: "",
  email: "",
});
const tableData = [
  {
    id: "01",
    name: "Tom",
    role: "管理员",
    gender: 0,
    avator: "",
    email: "123@qq.com",
    status: 0,
    createTime: "2024-12-19 16:20",
    editTime: "2024-12-20 16:20",
  },
  {
    id: "02",
    name: "jerry",
    role: "管理员",
    gender: 1,
    avator: "",
    email: "456@qq.com",
    status: 0,
    createTime: "2024-12-19 16:20",
    editTime: "2024-12-20 16:20",
  },
  {
    id: "03",
    name: "panda",
    role: "管理员",
    gender: 0,
    avator: "",
    email: "789@qq.com",
    status: 1,
    createTime: "2024-12-19 16:20",
    editTime: "2024-12-20 16:20",
  },
  {
    id: "04",
    name: "bear",
    role: "管理员",
    gender: 0,
    avator: "",
    email: "100@qq.com",
    status: 1,
    createTime: "2024-12-19 16:20",
    editTime: "2024-12-20 16:20",
  },
];
</script>

<style lang="scss" scoped>
.user-container {
  .card {
    box-sizing: border-box;
    padding: 20px;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
    border-radius: 6px;
  }

  .table-search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .search-form-inline {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .table-main {
    min-height: 750px;

    .table-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .pagination-box {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
  }
}
</style>

```
:::