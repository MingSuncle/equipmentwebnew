<template>
    <div>
        <div>
            <b>模型管理</b>
            <div style="margin:10px 0">
                <el-button type="primary" @click="newModel">增加模型 <i class="el-icon-upload"></i></el-button>
                <el-upload class="inline-block" action="http://47.100.71.212:8888/model/uploadCode"
                        :show-file-list="false" :on-success="handleUploadSuccess" style="display:inline-block">
                    <el-button type="primary" >更新代码 <i
                            class="el-icon-upload"></i></el-button>
                    <span class="custom-span">上次更新时间:{{ codeTime }}</span>
                </el-upload>

            </div>

            <el-table :data="tableData" border>
                <el-table-column prop="modelId" label="模型Id" width="190">
                </el-table-column>
                <el-table-column prop="modelName" label="模型名称" width="200">
                </el-table-column>
                <el-table-column prop="modelNum" label="已有版本" width="75">
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
                            <router-link :to="{
                                path: '/versionManage',
                                query: {
                                    modelId: scope.row.modelId,
                                    modelName: scope.row.modelName
                                }
                            }">
                                <el-button type="text" icon="el-icon-news" class="blue">版本管理</el-button>
                            </router-link>
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
        <el-dialog title="新增模型配置" :visible.sync="createVisible" width="40%">
            <el-form :model="editForm" label-width="120px" ref="editForm">


                <el-form-item label="模型ID" prop="modelId"><el-input v-model="editForm.modelId"
                        placeholder="请输入模型ID"></el-input></el-form-item>
                <el-form-item label="模型名称" prop="modelName"><el-input placeholder="请输入模型名称"
                        v-model="editForm.modelName"></el-input></el-form-item>

            </el-form><span slot="footer" class="dialog-footer">
                <el-button @click="cancelCreate">取 消</el-button>
                <el-button type="primary" @click="handleCreate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { METHODS } from 'http';
import { RouterView } from 'vue-router';

export default {
    name: "model",
    data() {
        return {
            // cid: JSON.parse(localStorage.getItem("user")).cid,
            total: 0,
            pageSize: 10,
            current_page: 1,
            tableData: [],
            phone: "",
            form: {},
            codeTime: "",
            dialogFormVisible: false,
            createVisible: false,
            editForm: {},
        };
    },
    props: {},
    created() {
        this.load();
    },
    methods: {
        search() {
        },
        async getCodeLastModifiedTime(){
            const result = await this.$api.model.getCodeTime()
            if(result.code == 200){
                this.codeTime = result.data.time
            }
            else{
                this.codeTime = "获取失败"
            }
        },
        newModel() {
            this.createVisible = true;
        },
        handleApp() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        handleUploadSuccess(response) {
            console.log('后端返回参数:', response);
            if(response.code==200){
              this.$message.success("上传成功")
              this.load()
            }
            else{
              this.$message.error("上传失败")
              this.load()
            }
        },
        load() {
            this.request.get("/model/getAllModelByType", {
                // params: {
                //     // cid: this.cid,
                //     current_page: this.current_page,
                //     pageSize: this.pageSize,
                // }
            }).then(res => {
                this.tableData = res.data.result;
                this.total = res.data.total;
            });
            this.getCodeLastModifiedTime();
        },
        cancelCreate() {
            this.createVisible = false;
            this.editForm = {};
            this.$message({
                message: '操作已取消',
                duration: 1500,
                type: 'info'
            });
        },
        handleCreate() {
            this.request.post("/model/addModel", this.editForm).then(res => {
                if (res.code == 300) {
                    this.$message(this.faildMessage('模型已存在'));
                }
                else if (res.code == 500) {
                    this.$message(this.faildMessage('新增失败'));
                }
                else {
                    this.$message(this.successMessage('新增成功'));
                    this.createVisible = false;
                    this.editForm = {};
                    this.load();
                }
            })
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

<style scoped>
.custom-span {
    margin-left: 10px;
    font-size: 12px;
    color: #90d9ff;
    vertical-align: bottom;
}

.inline-block {
    display: inline-block;
    margin-left: 10px;
}

.margin-change {
    display: inline-block;
    margin-left: 10px;
}
</style>