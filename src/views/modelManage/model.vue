<template>
    <div>
        <div>
        <div style="padding:10px 0">
            <el-input style="width:200px" placeholder="输入电话" suffix-icon="el-icon-search" v-model="phone">
            </el-input>
            <el-button class="ml-5" type="primary" @click="search" v-model="phone">搜索
            </el-button>
        </div>
        <b>模型管理</b>
        <div style="margin:10px 0">
            <el-button type="primary" >增加模型 <i class="el-icon-upload"></i></el-button>
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
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)"
                            >修改
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除
                        </el-button>
                        <el-row>
                            <router-link :to="{
                            path: '/versionManage',
                            query: {
                                modelId:scope.row.modelId
                                
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
            dialogFormVisible: false,
        };
    },
    props: {},
    created() {
        this.load();
    },
    methods: {
        search() {
        },

        handleApp() {
            this.dialogFormVisible = true;
            this.form = {};
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
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.load();
        },
        handleCurrentChange(current_page) {
            this.current_page = current_page;
            this.load();
        },
    },
    components: { RouterView }
}
</script>

<style scoped>

</style>