<template>
    <div>
        <div>
            <div style="padding:10px 0">
                <el-input style="width:200px" placeholder="输入电话" suffix-icon="el-icon-search" v-model="phone">
                </el-input>
                <el-button class="ml-5" type="primary" @click="search" v-model="phone">搜索
                </el-button>
            </div>
            <b>盒子配置</b>
            <div style="margin:10px 0">
                <el-button type="primary">芝士雪豹 <i class="el-icon-download"></i></el-button>
                <el-button type="primary">芝士按钮 <i class="el-icon-circle-plus-outline"></i></el-button>
            </div>

            <el-table :data="tableData" border>
                <el-table-column prop="boxNo" label="盒子id" width="140" align="center">
                </el-table-column>
                <el-table-column prop="boxName" label="盒子名称" width="120" align="center">
                </el-table-column>
                <el-table-column prop="boxIp" label="盒子ip" align="center">
                </el-table-column>
                <el-table-column  label="第三方URL" align="center">
                    <el-table-column prop="centerThirdPartyUrls.register" label="注册接口" align="center">
                    </el-table-column>
                    <el-table-column prop="centerThirdPartyUrls.upload_message" label="上传信息接口" align="center">
                    </el-table-column>
                    <el-table-column prop="centerThirdPartyUrls.get_new_json" label="拉取配置接口" align="center">
                    </el-table-column>
                    <el-table-column prop="centerThirdPartyUrls.box_heart" label="心跳检测接口" align="center">
                    </el-table-column>

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
                            <router-link :to="{ name: 'boxConfig', params: { id: scope.row.boxNo } }">
                                <el-button type="text" icon="el-icon-setting" class="blue mr10">摄像头配置 </el-button>
                            </router-link>
                            <router-link :to="`/modify_box/${scope.row.boxNo}`">
                                <el-button type="text" icon="el-icon-news" class="blue">待生效配置</el-button>
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
        <el-dialog title="编辑盒子配置" :visible.sync="editVisible" width="40%">
            <el-form :model="editForm" label-width="120px" ref="editForm" :rules="rules">
                <el-form-item label="盒子id">
                    <h4>{{ editForm.boxNo }}</h4>
                </el-form-item>
                <el-form-item label="盒子ip"><el-input v-model="editForm.boxIp"></el-input></el-form-item>
                <el-form-item label="盒子名称" prop="boxName"><el-input v-model="editForm.boxName"></el-input></el-form-item>
                <el-form-item label="第三方url">
                    <el-select v-model="editForm.centerThirdPartyUrls" multiple filterable allow-create default-first-option
                        placeholder="输入url后点击回车">
                    </el-select>
                </el-form-item></el-form><span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { METHODS } from 'http';
import { RouterView } from 'vue-router';

export default {
    name: "box",
    data() {
        return {
            // cid: JSON.parse(localStorage.getItem("user")).cid,
            total: 0,
            pageSize: 10,
            current_page: 1,
            tableData: [],
            phone: "",
            form: {},
            boxs: [],
            editForm: {},
            dialogFormVisible: false,
            rules: {
                boxName: [{ required: true, message: '请输入盒子名称', trigger: 'blur' }],
                boxNo: [{ required: true, message: '请输入盒子id', trigger: 'blur' }]
            }
        };
    },
    props: {},
    created() {
        this.load();
    },

    methods: {
        splitJoin(theText) {
            return theText.split(', ');
        },
        search() {
        },

        handleApp() {
            this.dialogFormVisible = true;
            this.form = {};
        },
        load() {
            this.request.get("/boxConfig/getAll", {
                // params: {
                //     // cid: this.cid,
                //     current_page: this.current_page,
                //     pageSize: this.pageSize,
                // }
            }).then(res => {
                this.tableData = res.data.result;
                this.total = res.data.total;
                for (var i = 0; i < this.tableData.length; i++) {
                    this.tableData[i].centerThirdPartyUrls = JSON.parse(this.tableData[i].centerThirdPartyUrls)
                    console.log(this.tableData[i].centerThirdPartyUrls)
                    // this.tableData[i].centerThirdPartyUrlsShow = Object.entries(this.tableData[i].centerThirdPartyUrls).map(([key, value]) => ({
                    //     entry: `${key}: ${value}`
                    // }));
                    // console.log(this.tableData[i].centerThirdPartyUrlsShow)
                    // this.tableData[i].centerThirdPartyUrlsShow = (this.tableData[i].centerThirdPartyUrls || '').split(',')
                }
            });
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
        handleEdit(index, row) {
            this.editForm = { ...row };
            this.editVisible = true;
            console.log(this.editForm);
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
        async editSubmit(name) {
            this.$refs[name].validate(async valid => {
                if (valid) {
                    this.editVisible = false;
                    try {
                        this.editForm.centerThirdPartyUrls = this.editForm.centerThirdPartyUrls.join(',')
                        console.log(this.editForm)
                        await this.request.post("/boxConfig/updateBoxConfig", this.editForm).then(res => {
                            if (res.code == 200) {
                                this.$message(this.successMessage('修改成功'));
                                this.editVisible = false;
                                this.editForm = {};
                                this.load();
                            }
                            else {
                                this.$message(this.faildMessage('修改失败'));
                                this.editVisible = false;
                                this.editForm = {};
                                this.load();
                            }
                        })

                    } catch (error) {
                        this.$message(this.faildMessage('修改失败'));
                    }
                } else {
                    this.$message(this.faildMessage('请规范输入'));
                    return false;
                }
            });
        },

    },

    components: { RouterView }
}
</script>

<style scoped></style>