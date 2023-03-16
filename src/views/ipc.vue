<template>
    <div>
        <div style="padding:10px 0">
            <el-input style="width:200px" placeholder="输入电话" suffix-icon="el-icon-search" v-model="phone">
            </el-input>
            <el-button class="ml-5" type="primary" @click="search" v-model="phone">搜索
            </el-button>
        </div>
        <b>摄像头配置</b>
        <div style="margin:10px 0">
            <el-button type="primary" >芝士雪豹 <i class="el-icon-download"></i></el-button>
            <el-button type="primary" >芝士按钮 <i class="el-icon-circle-plus-outline"></i></el-button>
        </div>

        <el-table :data="IPCs" class="table" header-cell-class-name="table-header">
                <el-table-column align="center" label="摄像头id" prop="ipcId"></el-table-column>
                <el-table-column align="center" label="摄像头名称" prop="ipcName"></el-table-column>
                <el-table-column align="center" label="摄像头ip" prop="ipcIp"></el-table-column>
                <el-table-column align="center" label="摄像头url" prop="ipcUrl" min-width="150"></el-table-column>
                <el-table-column align="center" label="摄像头位置" prop="ipcposition"></el-table-column>
                <el-table-column align="center" label="监测区域" prop="ipcDetectArea" min-width="150"></el-table-column>
                <el-table-column align="center" label="所属盒子id" prop="ipcBoxNo"></el-table-column>"
                <el-table-column align="center" label="fps" prop="ipcFps"></el-table-column>
                <el-table-column align="center" label="监测时间">
                    <el-table-column align="center" label="开始" prop="ipcDetectTimeBgn"></el-table-column>"
                    <el-table-column align="center" label="结束" prop="ipcDetectTimeEnd"></el-table-column>"
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" class="blue" @click="handleEdit(scope.$index, scope.row)"
                            >修改
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除
                        </el-button>
                        <el-row>
                            <router-link :to="`/ipc-event/${scope.row.ipcId}`">
                                <el-button type="text" icon="el-icon-setting" class="blue mr10">事件配置 </el-button>
                            </router-link>
                            <router-link :to="`/modify_ipc/${scope.row.ipcId}`">
                                <el-button type="text" icon="el-icon-news" class="blue">待生效配置 </el-button>
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
</template>

<script>
import axios from 'axios';
import { METHODS } from 'http';

export default {
    name: "ipc",
    data() {
        return {
            boxId: this.$route.params.boxId,
            // cid: JSON.parse(localStorage.getItem("user")).cid,
            total: 0,
            pageSize: 10,
            current_page: 1,
            tableData: [],
            phone: "",
            form: {},
            dialogFormVisible: false,
        }
    },
    props: {

    },
    created() {
        this.$watch(
            () => this.$route.params.boxId,
            newId => {
                this.currentPage = 1;
                this.boxId = newId;
                this.getIPCs();
            }
        );
        this.load()
    },
    methods: {

        search() {

        },
        handleApp() {
            this.dialogFormVisible = true
            this.form = {}
        },

        load() {
            this.request.get("/ipcConfig/getIpcConfigList", {
                params: {
                    ipc_boxNo: this.boxId,
                    current_page: this.current_page,
                    pageSize: this.pageSize,
                }
            }).then(res => {
                console.log(res.data)
                this.tableData = res.data.result
                console.log(this.tableData)
                this.total = res.data.total
                console.log(this.total)
            })

        },

        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.load()
        },
        handleCurrentChange(current_page) {
            this.current_page = current_page
            this.load()
        },
    }
}
</script>

<style scoped>

</style>