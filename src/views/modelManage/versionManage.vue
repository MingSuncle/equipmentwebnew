<template>
    <div>
        <div>
            <div style="padding:10px 0">
                <el-input style="width:200px" placeholder="输入电话" suffix-icon="el-icon-search" v-model="phone">
                </el-input>
                <el-button class="ml-5" type="primary" @click="search" v-model="phone">搜索
                </el-button>
            </div>
            <b>版本管理</b>
            <div style="margin:10px 0">
                <el-button type="primary" @click="goBack">返回 <i class="el-icon-back"></i></el-button>
            </div>

            <el-table :data="tableData" border>
                <el-table-column prop="modelId" label="模型Id" width="100">
                </el-table-column>
                <el-table-column prop="modelName" label="模型名称" width="200">
                </el-table-column>
                <el-table-column prop="modelVersion" label="版本号" width="75">
                </el-table-column>
                <el-table-column prop="modelFile" label="模型文件位置" width="500">
                </el-table-column>
                <el-table-column prop="modelRemark" label="模型描述" width="400">
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" class="blue"
                            @click="handleEdit(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                        <el-row>
                            <el-upload action="http://localhost:8888/model/upload"
                                :data="{ model_id: scope.row.modelId, model_version: scope.row.modelVersion }"
                                :show-file-list="false" :on-success="handleUploadSuccess" style="display:inline-block">
                                <el-button type="text" icon="el-icon-upload2">上传模型 </el-button>
                            </el-upload>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>

            <div style="padding:10px 0">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="current_page" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>

        </div>
        <el-dialog title="编辑模型配置" :visible.sync="editVisible" width="40%">
            <el-form :model="editForm" label-width="120px" ref="editForm" :rules="rules">


                <el-form-item label="版本号" prop="modelVersion"><el-input
                        v-model="editForm.modelVersion"></el-input></el-form-item>
                <el-form-item label="模型说明" prop="modelRemark"><el-input
                        v-model="editForm.modelRemark"></el-input></el-form-item>

            </el-form><span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { METHODS, request } from 'http';
import { RouterView } from 'vue-router';

export default {
    name: "versionManage",
    data() {
        return {
            // cid: JSON.parse(localStorage.getItem("user")).cid,
            modelId: this.$route.query.modelId,
            total: 0,
            pageSize: 10,
            current_page: 1,
            tableData: [],
            phone: "",
            form: {},
            dialogFormVisible: false,
            editVisible: false,
            editForm: {},
            rules: {
                boxName: [{ required: true, message: '请输入盒子名称', trigger: 'blur' }],
                boxNo: [{ required: true, message: '请输入盒子id', trigger: 'blur' }]
            }
        };
    },
    props: {},
    created() {
        this.$watch(
            () => this.$route.params.modelId,
            newId => {
                this.current_page = 1;
                this.modelId = newId;
                this.load();
            }
        )
        this.load();
    },
    methods: {
        search() {
        },
        goBack() {
            this.$router.go(-1);
        },
        handleApp() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        handleEdit(index, row) {

            this.editForm = { ...row };
            this.editVisible = true;
            console.log(this.editForm)
        },
        load() {
            console.log(this.modelId)
            this.request.get("/model/getModelById", {
                params: {
                    model_id: this.modelId
                    // current_page: this.current_page,
                    // pageSize: this.pageSize,
                }
            }).then(res => {
                this.tableData = res.data.result;
                this.total = res.data.total;
            });
        },

        async editSubmit(name) {
            this.$refs[name].validate(async valid => {
                if (valid) {
                    this.editVisible = false;
                    try {

                        this.request.post("/model/modifyModel", this.editForm).then(res => {
                                this.load()
                        })
                        this.$message(this.successMessage('修改成功'));

                    } catch (error) {
                        console.log(error)
                        this.$message(this.faildMessage('修改失败'));
                    }
                } else {
                    this.$message(this.faildMessage('请规范输入'));
                    return false;
                }
            });
        },
        cancelEdit() {
            this.editVisible = false;
            this.editForm = {};
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
            this.$refs['editForm'].clearValidate();
        },
        handleUploadSuccess() {
            this.$message.success("上传成功")
            this.load()
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.load();
        },
        handleCurrentChange(current_page) {
            this.current_page = current_page;
            this.load();
        },
        successMessage(msg) {
            return {
                message: msg,
                duration: 2000,
                type: 'success'
            };
        },
        faildMessage(msg) {
            return {
                message: msg,
                duration: 2000,
                type: 'error'
            };
        },
    },
    components: { RouterView }
}
</script>

<style scoped></style>