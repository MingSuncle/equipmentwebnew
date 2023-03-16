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
            <el-button type="primary" >芝士雪豹 <i class="el-icon-download"></i></el-button>
            <el-button type="primary" >芝士按钮 <i class="el-icon-circle-plus-outline"></i></el-button>
        </div>

        <el-table :data="tableData" border>
            <el-table-column prop="boxNo" label="盒子id" width="140">
            </el-table-column>
            <el-table-column prop="boxName" label="盒子名称" width="120">
            </el-table-column>
            <el-table-column prop="boxIp" label="盒子ip">
            </el-table-column>
            <el-table-column prop="boxIp" label="盒子ip">
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
                            <router-link :to="`/ipc/${scope.row.boxNo}`">
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
            this.request.get("/boxConfig/getAll", {
            // params: {
            //     // cid: this.cid,
            //     current_page: this.current_page,
            //     pageSize: this.pageSize,
            // }
            }).then(res => {
                console.log(res.data.result);
                this.tableData = res.data.result;
                console.log(this.tableData);
                this.total = res.data.total;
                console.log(this.total);
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