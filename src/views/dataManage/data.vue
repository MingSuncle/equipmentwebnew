<template>
    <div>
        <div style="padding:10px 0">
            <el-form :model="queryParams" ref="queryParams" :inline="true">
                <el-form-item label="员工电话:" prop="phone">
                    <el-input v-model="phone" placeholder="请输入员工电话" clearable size="small" style="width: 160px" />
                </el-form-item>
                <el-form-item label="健康码状态" prop="health_color">
                    <el-select v-model="health_multipleStatus" multiple clearable placeholder="请选择" size="mini"
                        style="width:200px;">
                        <el-option v-for="item in colorsStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="行程码状态" prop="travel_color">
                    <el-select v-model="travel_multipleStatus" multiple clearable placeholder="请选择" size="mini"
                        style="width:200px;">
                        <el-option v-for="item in colorsStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="核酸检测结果" prop="detect_result">
                    <el-select v-model="detect_multipleStatus" multiple clearable placeholder="请选择" size="mini"
                        style="width:200px;">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="核酸检测时间">
                    <el-date-picker v-model="dateArray" type="datetimerange" range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']" @change="changeDate" style="width:360px;">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="途径地">
                    <el-cascader :options="options" v-model="selectedOptions" :props="{ multiple: true }"
                        @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="small" @click="search">
                        搜索
                    </el-button>
                    <el-button icon="el-icon-refresh" size="small" @click="resetForm()">重置</el-button>

                </el-form-item>
            </el-form>
        </div>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="七天旅居地">
                            <span>{{ props.row.travelPlace }}</span>
                        </el-form-item>
                        <el-form-item label="核酸检测时间">
                            <span>{{ props.row.detectTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="员工姓名" prop="name">
            </el-table-column>
            <el-table-column label="员工电话" prop="phone">
            </el-table-column>
            <el-table-column label="两码一证">
                <el-table-column prop="healthColor" label="健康码" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="
                          scope.row.healthColor == 'green'
                            ? 'success'
                            : scope.row.healthColor == 'yellow'
                              ? 'warning'
                              :scope.row.healthColor =='red'?'danger'
                              : 'info'
                        " disable-transitions>{{
                        scope.row.healthColor == 'green'
                        ? '绿码'
                        : scope.row.healthColor == 'yellow'
                        ? '黄码'
                        :scope.row.healthColor =='red'? '红码'
                        :'无法识别'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="travelColor" label="行程码" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="
                          scope.row.travelColor == 'green'
                            ? 'success'
                            : scope.row.travelColor == 'yellow'
                              ? 'warning'
                              :scope.row.travelColor == 'red'
                              ? 'danger'
                                :'info'
                        " disable-transitions>{{
                        scope.row.travelColor == 'green'
                        ? '绿码'
                        : scope.row.travelColor == 'yellow'
                        ? '黄码'
                        :scope.row.travelColor == 'red'?
                        '红码'
                        :'无法识别'
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="detectResult" label="核酸检测报告" width="300">
                    <template slot-scope="scope">
                        <el-tag :type="
                          scope.row.detectResult == 'negative'
                            ? 'success'
                            : scope.row.detectResult == 'positive'
                              ? 'danger'
                              : 'info'
                        " disable-transitions>{{
                        scope.row.detectResult == 'negative'
                        ? '阴性'
                        : scope.row.detectResult == 'positive'
                        ? '阳性'
                        : '无法识别'
                        }}</el-tag>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="审核结果" prop="result">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.result === '通过' ? 'success' : 'warning'" disable-transitions>
                        {{scope.row.result}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" header-align="center">
                <template v-slot="scope">
                    <el-button type="primary" style="margin-left:10%" @click="checkImg(scope.row)">
                        查看两码一证
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding:10px 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="current_page" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog title="查看两码一证" :visible.sync="dialogFormVisible" style="text-align:center">
            <el-form :model="form" inline="true">
                <template>
                    <div id="banner">
                        <el-carousel :interval="4000" type="card">
                            <el-carousel-item v-for="item in srcList" :key="item">
                                <el-image style="width: 100%; height : inherit;max-width: 100%;max-height: 100%;"
                                    :src="item" :preview-src-list="srcList">
                                </el-image>
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </template>
                <el-form-item label="健康码">
                    <el-select v-model="form.healthColor" :placeholder="form.healthColor == 'green'? '绿码'
                    :form.healthColor == 'yellow' ? '黄码'
                    :form.healthColor == 'red' ? '红码'
                    :'无法识别'">
                        <el-option v-for="item in colorsStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行程码">
                    <el-select v-model="form.travelColor" :placeholder="form.travelColor == 'green'? '绿码'
                    :form.travelColor == 'yellow' ? '黄码'
                    :form.travelColor == 'red' ? '红码'
                    :'无法识别'">
                        <el-option v-for="item in colorsStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="核酸检测结果">
                    <el-select v-model="form.detectResult" :placeholder="form.detectResult == 'negative'? '阴性'
                    :form.detectResult == 'positive' ? '阳性'
                    :'无法识别'">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="核酸检测时间">
                    <el-date-picker v-model="form.detectTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="七天途径地">
                    <el-tooltip class="item" effect="dark" content="复核时请用中文逗号，分隔" placement="bottom">
                        <el-input v-model="form.travelPlace"></el-input>
                    </el-tooltip>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handledialogClick">复 核</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>

import { provinceAndCityData, CodeToText } from 'element-china-area-data'


export default {
    name: "User",
    data() {
        return {
            cid: JSON.parse(localStorage.getItem("user")).cid,
            total: 0,
            pageSize: 10,
            current_page: 1,
            tableData: [],
            phone: "",
            dialogFormVisible: false,
            health_color: "",
            travel_color: "",
            travel_place: "",
            detect_result: "",
            bgn_date: "",
            end_date: "",
            name: "",
            travel_place: "",
            form: [],
            srcList: [],
            options: provinceAndCityData,
            selectedOptions: [],
            // 查询参数
            queryParams: {

            },
            health_multipleStatus: [],
            travel_multipleStatus: [],
            detect_multipleStatus: [],
            colorsStatusOptions: [
                {
                    value: "green",
                    label: "绿码"
                },
                {
                    value: "yellow",
                    label: "黄码"
                },
                {
                    value: "red",
                    label: "红码"
                }
            ],
            statusOptions: [
                {
                    value: "negative",
                    label: "阴性"
                },
                {
                    value: "positive",
                    label: "阳性"
                },

            ],
            dateArray: [], //选择时间


        }
    },

    created() {
        this.load()
    },
    methods: {
        handledialogClick() {
            console.log(this.form)
            this.dialogFormVisible = false
            this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success'
            })
        },
        checkImg(row) {
            console.log(row)
            this.form = row
            this.srcList = []
            this.dialogFormVisible = true
            this.srcList.push(row.healthCode)
            this.srcList.push(row.travelCode)
            this.srcList.push(row.report)
            console.log(this.srcList)
        },
        handleChange(value) {
            // text = CodeToText(value)
            let area_list = "";
            for (var i = 0; i < value.length; i++) {
                let area = ""
                let codeArray = value[i]
                switch (codeArray.length) {
                    case 1:
                        area += CodeToText[codeArray[0]];
                        break;
                    case 2:
                        area += CodeToText[codeArray[0]] + CodeToText[codeArray[1]];
                        break;
                    case 3:
                        area +=
                            CodeToText[codeArray[0]] +
                            CodeToText[codeArray[1]] +
                            CodeToText[codeArray[2]];
                        break;
                    default:
                        break;
                }
                area_list = area.replace("市辖区", "") + "," + area_list
            }
            this.travel_place = area_list.substring(0, area_list.length - 1)
            console.log(this.travel_place)
        },
        changeDate(e) {
            console.log("changeDate 时间选择 ->", e);
            if (e) {
                this.bgn_date = e[0];
                this.end_date = e[1];
            } else {
                this.bgn_date = "";
                this.end_date = "";
            }
        },

        resetForm() {
            this.$nextTick(() => {
                this.phone = "",
                    this.health_multipleStatus = [],
                    this.travel_multipleStatus = [],
                    this.detect_multipleStatus = [],
                    this.dateArray = []
                this.pagesize = 1,
                    this.health_color = "",
                    this.travel_color = "",
                    this.travel_place = "",
                    this.detect_result = "",
                    this.bgn_date = "",
                    this.end_date = "",
                    this.selectedOptions = [],
                    this.load()
            });

        },

        search() {
            this.health_color = this.health_multipleStatus.toString()
            this.travel_color = this.travel_multipleStatus.toString()
            this.detect_result = this.detect_multipleStatus.toString()

            this.load()
        },
        handleApp() {
            this.dialogFormVisible = true
            this.form = {}
        },


        load() {
            this.request.get("http://47.100.71.212:8877/DataManage/selectStaff", {
                params: {
                    cid: 1,
                    pageSize: this.pageSize,
                    current_page: this.current_page,
                    phone: this.phone,
                    health_color: this.health_color,
                    travel_color: this.travel_color,
                    travel_place: this.travel_place,
                    detect_result: this.detect_result,
                    bgn_date: this.bgn_date,
                    end_date: this.end_date,
                    name: this.name
                }
            }).then(res => {
                this.tableData = res.result
                this.total = res.total

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

<style>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}
</style>