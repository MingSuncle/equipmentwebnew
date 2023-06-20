<template>
    <div v-loading="loading">
      <h4 style="margin-top: 0">设备配置</h4>
      <div class="content-header">
        <!-- 通道配置表单 -->
        <el-dialog title="编辑" :visible.sync="dialogVisible" width="70%" @close="handleClose" v-loading="loading">
          <el-form ref="editForm" :rules="rules" :model="editForm" :inline="true" label-width="150px">
            <el-form-item label="摄像头名称" prop="video_name">
              <el-input v-model="editForm.video_name"></el-input>
            </el-form-item>
            <el-form-item label="摄像头ID" prop="video_id">
              <el-input v-model="editForm.video_id"></el-input>
            </el-form-item>
            <el-form-item label="摄像头品牌" prop="video_brand">
              <el-select v-model="editForm.video_brand">
                <el-option v-for="(item, index) in video_brand_list" :key="index" :value="item" :label="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头IP" prop="video_ip">
              <el-input v-model="editForm.video_ip" maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="video_username">
              <el-input v-model="editForm.video_username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="video_password">
              <el-input v-model="editForm.video_password"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="video_port">
              <el-input v-model="editForm.video_port"></el-input>
            </el-form-item>
            <el-form-item label="监测间隔(单位/s)" prop="video_fps">
              <el-input v-model="editForm.video_fps"></el-input>
            </el-form-item>
            <el-form-item label="优先码流" prop="video_stream">
              <el-select v-model="editForm.video_stream">
                <el-option label="主码流" value="主码流"></el-option>
                <el-option label="子码流" value="子码流"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="监测类型" prop="AIevent_id">
              <el-select v-model="editForm.AIevent_id">
                <el-option v-for="(value, key) in eventList" :key="key" :label="value" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </span>
        </el-dialog>
      </div>
  
      <div class="other-config">
        <el-row :gutter="20">
          <!-- 盒子名称配置 -->
          <el-col :span="12">
            <el-row type="flex" justify="space-between">
              <!-- boxName desc -->
              <el-input v-model="box_name" style="margin-bottom: 20px;" :disabled="boxNameEditable">
                <template slot="prepend">盒子名称</template>
                <el-button slot="append" icon="el-icon-edit" size="small" @click="boxNameEdit"></el-button>
              </el-input>
              <!-- button -->
              <el-col :span="2">
                <div v-if="!boxNameEditable" class="url-buttons">
                  <el-button type="primary" @click="boxNameSave">保存</el-button>
                  <el-button @click="boxNameEditCancle">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!-- 项目id配置 -->
          <el-col :span="12">
            <el-row type="flex" justify="space-between">
              <!-- projectID desc -->
              <el-input v-model="project_id" style="margin-bottom: 20px;" :disabled="projIdEditable">
                <template slot="prepend">项目ID</template>
                <el-button slot="append" icon="el-icon-edit" size="small" @click="projIdEdit"></el-button>
              </el-input>
              <!-- button -->
              <el-col :span="2">
                <div v-if="!projIdEditable" class="url-buttons">
                  <el-button type="primary" @click="projIdSave">保存</el-button>
                  <el-button @click="projIdEditCancle">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
  
        <!-- 第三方url配置 -->
        <el-row type="flex" justify="space-between">
          <!-- url desc -->
          <el-col :span="21">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="第三方URL">
                <el-form ref="third_party_url_list" :model="third_party_url_list" :inline="true" label-width="110px">
                  <el-col :span="12">
                    <el-form-item label="注册" prop="register" style="width: 100%;">
                      <el-input v-model="third_party_url_list.register" :disabled="urlEditable"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="心跳" prop="box_heart" style="width: 100%;">
                      <el-input v-model="third_party_url_list.box_heart" :disabled="urlEditable"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="消息推送" prop="upload_message" style="width: 100%;">
                      <el-input v-model="third_party_url_list.upload_message" :disabled="urlEditable"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="获取云平台配置" prop="get_new_json" style="width: 100%;">
                      <el-input v-model="third_party_url_list.get_new_json" :disabled="urlEditable"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <!-- button -->
          <el-col :span="2">
            <el-button v-if="urlEditable" type="primary" plain @click="urlEdit"
              style="position:absolute;right:0%;">编辑</el-button>
            <div v-if="!urlEditable" class="url-buttons">
              <el-button type="primary" @click="urlSave">保存</el-button>
              <el-button @click="urlEditCancle">取消</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
  
      <div class="config-table">
        <!-- 首行 -->
        <div class="add-raw">
          <!-- 下载算法 -->
          <!-- <el-button @click="handleGetModel()" type="primary" plain style="margin-right: auto;">下载算法</el-button> -->
          <!-- 通道计数 -->
          <div class="channel-info">
            {{ channel_used }} / {{ channelLimit }}
          </div>
          <!-- 新增按钮 -->
          <el-button @click="handleAdd()" type="primary" plain
            :disabled="channel_used == channelLimit ? true : false">新增通道</el-button>
          <!-- 算法重启 配置更新 -->
          <div class="status-info">
            <div :style="{ color: (aiboxStatus.status == '正在运行' ? '#25e02e' : '#e65858') }">运行状态：{{ aiboxStatus.status }}
            </div>
            <div>状态时间：{{ aiboxStatus.time }}</div>
          </div>
        </div>
        <div class="table-bar">
          <el-table :data="tableData" border stripe style="width: 100%" :header-cell-style="tableHeaderStyle"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column type="index" label="序号" width="60" fixed>
            </el-table-column>
            <el-table-column prop="video_name" label="摄像头名称"></el-table-column>
            <el-table-column prop="video_id" label="摄像头ID"></el-table-column>
            <el-table-column prop="video_brand" label="摄像头品牌">
            </el-table-column>
            <el-table-column prop="video_ip" label="摄像头IP"></el-table-column>
            <el-table-column prop="video_username" label="用户名"></el-table-column>
            <el-table-column prop="video_password" label="密码"></el-table-column>
            <el-table-column prop="video_port" label="端口号" width="90"></el-table-column>
            <el-table-column prop="video_fps" label="监测间隔(单位/秒)" width="90"></el-table-column>
            <el-table-column prop="video_stream" label="优先码流" width="90"></el-table-column>
            <el-table-column prop="AIevent_id" label="监测类型">
              <template slot-scope="scope">
                <span>{{ eventList[scope.row.AIevent_id] }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="state" label="状态" width="90">
              <template slot-scope="scope">
                <span>{{ scope.row.state == 1 ? '在线' : '离线' }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="210px" fixed="right">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="handleCopy(scope.$index, scope.row)" type="text" size="small">复制</el-button>
                <el-button @click="handleAreaSetting(scope.$index, scope.row)" type="text" size="small">监测区域设置</el-button>
                <el-button @click="handleDelete(scope.$index)" type="danger" size="mini" icon="el-icon-delete"
                  circle></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="deleteVisible" width="30%" :before-close="cancleDelete" v-loading="loading">
          <span>确认删除该通道配置？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancleDelete">取 消</el-button>
            <el-button type="primary" @click="doDelete">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        deleteVisible: false, //删除确认框
        deleteIndex: -1, //删除行index
        dialogVisible: false, //编辑框
        editForm: {},
        editRow: "",
        boxConfigList: [],
        eventList: {}, //允许的事件List
        video_brand_list: ["海康", "TP_LINK", "大华"],
        rules: { // 表单限制
          AIevent_id: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error('请选择监测类型'));
              } else {
                var isSame = false;
                for (var i = 0; i < this.tableData.length; i++) {
                  var channel = this.tableData[i];
                  if (this.editForm.video_ip == channel.video_ip && this.editRow != i && value == channel.AIevent_id) {
                    isSame = true;
                    break;
                  }
                }
                if (isSame) {
                  callback(new Error('该摄像头已配置此类监测, 请重新选择'));
                } else {
                  callback();
                }
              }
            },
            trigger: ['blur', 'change']
          }],
          video_name: [{ required: true, message: "请输入摄像头名称" }],
          video_id: [{ required: true, message: "请输入摄像头ID" }],
          video_brand: [{ required: true, message: "请输入摄像头品牌" }],
          video_ip: [{
            required: true,
            validator: (rule, value, callback) => {
              var regexIP = /^(([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])$/;
              if (value === "") {
                callback(new Error('请输入摄像头IP'));
              } else if (!regexIP.test(value)) {
                callback(new Error('IP格式有误, 请重新输入'));
              } else {
                callback();
              }
            },
            trigger: ['blur', 'change']
          }],
          video_username: [{ required: true, message: "请输入用户名" }],
          video_password: [{ required: true, message: "请输入密码" }],
          video_port: [{ required: true, message: "请输入端口号" }],
          video_fps: [{ required: true, message: "请输入监测间隔" }],
          video_stream: [{ required: true, message: "请选择优先码流" }],
        },
        tableData: [],
        channelLimit: 0, //最大通道数
        channel_used: 0, //已配置通道数
        loading: false,
  
        third_party_url_list: {},
        url_before_edit: {},
        urlEditable: true,
  
        project_id: "",
        projId_before_edit: "",
        projIdEditable: true,
  
        box_name: "",
        boxName_before_edit: "",
        boxNameEditable: true,
  
        aiboxStatus: {
          status: "",
          time: ""
        },
        timerAIBoxStatus: null, //算法服务状态定时器
      };
    },
    created() {
      this.getBoxConfig();
  
      this.getAIBoxStatus();
      this.timerAIBoxStatus = window.setInterval(() => {
        setTimeout(() => {
          this.getAIBoxStatus()
        }, 0);
      }, 600000); //ms todo
      console.log('定时器开启 timer:', this.timerAIBoxStatus);
    },
    methods: {
      async getBoxConfig() {
        // const params = {
        //   params: 'getBoxConfigs',
        // };
        this.loading = true;
        try {
          // const res = await this.$api.boxConfig.getBoxConfig(params);
          const result = await this.$api.boxConfig.getBoxConfig();
          const res = result.data.result;
          console.log(res)
          this.boxConfigList = res;
          this.tableData = this.boxConfigList.channel_list;
          this.channelLimit = this.boxConfigList.channelLimit;
          this.channel_used = this.boxConfigList.channel_list.length;
          this.eventList = this.boxConfigList.eventList;
          this.third_party_url_list = this.boxConfigList.third_party_url_list;
          this.project_id = this.boxConfigList.project_id;
          this.box_name = this.boxConfigList.box_name;
          this.loading = false;
          sessionStorage.setItem("boxID", this.boxConfigList.box_id);
  
          // 更新盒子私网ip
          // this.$set(this.boxConfigList, "box_ip", window.location.hostname);
          // console.log("boxConfigList 2:", this.boxConfigList);
          // let params2 = {
          //   boxConfigList: this.boxConfigList,
          // };
          // try {
          //   await this.$api.boxConfig.updateBoxConfig(params2);
          // } catch (error) {
          //   this.$message({
          //     message: '盒子ip更新失败',
          //     duration: 2000,
          //     type: 'error'
          //   });
          // }
        } catch (error) {
          this.loading = false;
          this.$message({
            message: '获取配置失败',
            duration: 2000,
            type: 'error'
          });
          console.log(error);
        }
      },
  
      // 摄像头rtsp video_url拼接
      setVideoUrl() {
        var editForm = this.editForm;
        switch (editForm.video_brand) {
          case "海康":
            // rtsp://admin:Admin123456@192.168.1.51:554/Streaming/Channels/101
            this.editForm.video_url = `rtsp://${editForm.video_username}:${editForm.video_password}@${editForm.video_ip}:${editForm.video_port}/Streaming/Channels/10`;
            if ("主码流" === editForm.video_stream) {
              this.editForm.video_url += "1";
            } else {
              this.editForm.video_url += "2";
            }
            break;
          case "大华":
            // rtsp://admin:Admin123456@192.168.1.104:554/cam/realmonitor?channel=1&subtype=0
            this.editForm.video_url = `rtsp://${editForm.video_username}:${editForm.video_password}@${editForm.video_ip}:${editForm.video_port}/cam/realmonitor?channel=1&subtype=`;
            if ("主码流" === editForm.video_stream) {
              this.editForm.video_url += "0";
            } else {
              this.editForm.video_url += "1";
            }
            break;
          case "TP_LINK":
            // rtsp://admin:Admin123456@192.168.1.50:554/Streaming/stream1
            this.editForm.video_url = `rtsp://${editForm.video_username}:${editForm.video_password}@${editForm.video_ip}:${editForm.video_port}/Streaming/stream`;
            if ("主码流" === editForm.video_stream) {
              this.editForm.video_url += "1";
            } else {
              this.editForm.video_url += "2";
            }
            break;
  
          default:
            break;
        }
      },
  
      //提交表单
      submit() {
        this.$refs.editForm.validate(async (valid) => {
          if (valid) {
            // 后续对表单数据处理
            // console.log("this.editForm:", this.editForm);
            // video_url拼接
            this.setVideoUrl();
            // 转为int存储
            // this.editForm.AIevent_id = parseInt(this.editForm.AIevent_id);
            this.editForm.video_fps = parseInt(this.editForm.video_fps);
            this.$set(this.tableData, this.editRow, this.editForm);
            this.channel_used = this.tableData.length;
            // begin new 循环所有通道，统一同摄像头ip的相关属性
            var channel, i;
            for (i = 0; i < this.tableData.length; i++) {
              channel = this.tableData[i];
              if (this.editForm.video_ip == channel.video_ip && this.editRow != i) {
                this.tableData[i].video_id = this.editForm.video_id;
                this.tableData[i].video_name = this.editForm.video_name;
                this.tableData[i].video_brand = this.editForm.video_brand;
                this.tableData[i].video_username = this.editForm.video_username;
                this.tableData[i].video_password = this.editForm.video_password;
                this.tableData[i].video_port = this.editForm.video_port;
                this.tableData[i].video_fps = this.editForm.video_fps;
                this.tableData[i].video_stream = this.editForm.video_stream;
                this.tableData[i].video_url = this.editForm.video_url;
              }
            }
            // end new
            this.$set(this.boxConfigList, "channel_list", this.tableData);
            // console.log("this.boxConfigList:",this.boxConfigList);
            this.loading = true;
            let params = {
              boxConfigList: this.boxConfigList,
            };
            try {
              // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
              await this.$api.boxConfig.updateBoxConfig(params);
              this.loading = false;
              this.$message({
                message: '操作成功',
                duration: 2000,
                type: 'success'
              });
            } catch (error) {
              this.loading = false;
              this.$message({
                message: '操作失败',
                duration: 2000,
                type: 'error'
              });
            }
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      // 通道编辑取消
      cancle() {
        this.handleClose();
      },
      handleClose() {
        this.dialogVisible = false;
        this.editForm = {};
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate();
        });
      },
  
      //下载算法
      async handleGetModel() {
        const params = {
          params: 'getModel',
        };
        this.loading = true;
        try {
          await this.$api.model.getModel(params);
          this.loading = false;
          this.$message({
            message: '下载成功',
            duration: 2000,
            type: 'success'
          });
        } catch (error) {
          this.loading = false;
          this.$message({
            message: '下载算法失败',
            duration: 2000,
            type: 'error'
          });
          console.log(error);
        }
      },
  
      //新增通道
      handleAdd() {
        this.dialogVisible = true;
        this.editRow = this.channel_used;
  
        this.$set(this.editForm, "AIevent_id", "");
        // 默认数据
        this.$set(this.editForm, "video_port", '554');
        this.$set(this.editForm, "video_stream", "主码流");
        this.$set(this.editForm, "state", 0); //todo 通过rtsp/开放api获取？
        this.$set(this.editForm, "detect_area_list", []);
        var detect_area = {};
        this.$set(detect_area, "area_name", "全屏全时段（若有其他具体配置，请删除该区域）");
        this.$set(detect_area, "AIevent_level", 1);
        this.$set(detect_area, "AIevent_processmode", "2");
        this.$set(detect_area, "AIevent_processparam", {});
        this.$set(detect_area, "detect_time_List", [["00:00", "23:59"]]);
        this.$set(detect_area, "detect_area_scope", [[0, 0], [0, 1], [1, 1], [1, 0]]);
        this.$set(this.editForm.detect_area_list, 0, detect_area);
      },
  

  
      // 通道编辑
      handleEdit(index, row) {
        this.dialogVisible = true;
        console.log(index);
        // row.AIevent_id = row.AIevent_id.toString(); // 事件类型不显示label的问题
        this.editForm = {};
        this.editForm = JSON.parse(JSON.stringify(row));
        this.editRow = index;
      },
  
      // 通道复制
      handleCopy(index, row) {
        console.log(index);
        this.editForm = {};
        this.editForm = JSON.parse(JSON.stringify(row));
        this.$set(this.editForm, "AIevent_id", "");
        this.$set(this.editForm, "detect_area_list", []);
        var detect_area = {};
        this.$set(detect_area, "area_name", "全屏全时段（若有其他具体配置，请删除该区域）");
        this.$set(detect_area, "AIevent_level", 1);
        this.$set(detect_area, "AIevent_processmode", "2");
        this.$set(detect_area, "AIevent_processparam", {});
        this.$set(detect_area, "detect_time_List", [["00:00", "23:59"]]);
        this.$set(detect_area, "detect_area_scope", [[0, 0], [0, 1], [1, 1], [1, 0]]);
        this.$set(this.editForm.detect_area_list, 0, detect_area);
        this.dialogVisible = true;
        this.editRow = this.channel_used;
      },
  
      // 监测区域设置
      handleAreaSetting(index, row) {
        sessionStorage.setItem("area", JSON.stringify({
          index: index,
          row: row,
          boxConfigList: JSON.stringify(this.boxConfigList),
          detect_area_list: JSON.stringify(row['detect_area_list']),
        }))
        this.$router.push('/label');
      },
  
      //通道删除框
      handleDelete(index) {
        this.deleteVisible = true;
        console.log("index:", index);
        this.deleteIndex = index;
        console.log("delVideoIp:", this.tableData[this.deleteIndex].video_ip);
      },
  
      // 通道删除取消
      cancleDelete() {
        this.deleteVisible = false;
      },
  
      // 通道删除确认
      async doDelete() {
        let params = {
          delVideoIp: this.tableData[this.deleteIndex].video_ip,
          boxConfigList: this.boxConfigList,
        };
  
        this.loading = true;
        this.tableData.splice(this.deleteIndex, 1);
        this.channel_used--;
        // console.log("this.tableData:", this.tableData);
        this.$set(this.boxConfigList, "channel_list", this.tableData);
        try {
          // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
          await this.$api.boxConfig.updateBoxConfig(params);
          this.loading = false;
          this.$message({
            message: '删除成功',
            duration: 2000,
            type: 'success'
          });
        } catch (error) {
          this.loading = false;
          this.$message({
            message: '删除失败',
            duration: 2000,
            type: 'error'
          });
        }
        this.deleteVisible = false;
      },
  
      // url编辑
      urlEdit() {
        this.urlEditable = false;
        this.url_before_edit = JSON.parse(JSON.stringify(this.third_party_url_list)); //保存编辑前url
      },
      // url编辑取消
      urlEditCancle() {
        this.urlEditable = true;
        this.third_party_url_list = JSON.parse(JSON.stringify(this.url_before_edit)); //恢复编辑前url
      },
      // url保存
      async urlSave() {
        this.loading = true;
        this.$set(this.boxConfigList, "third_party_url_list", this.third_party_url_list);
        let params = {
          boxConfigList: this.boxConfigList,
        };
        try {
          // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
          await this.$api.boxConfig.updateBoxConfig(params);
          this.urlEditable = true;
          this.$message({
            message: "第三方URL修改成功",
            duration: 2000,
            type: "success",
          });
        } catch (error) {
          this.$message({
            message: "第三方URL修改失败",
            duration: 2000,
            type: "error",
          });
        } finally {
          this.loading = false;
        }
      },
  
      // 项目id编辑
      projIdEdit() {
        this.projIdEditable = false;
        this.projId_before_edit = JSON.parse(JSON.stringify(this.project_id)); //保存编辑前项目id
      },
      // 项目id编辑取消
      projIdEditCancle() {
        this.projIdEditable = true;
        this.project_id = JSON.parse(JSON.stringify(this.projId_before_edit)); //恢复编辑前项目id
      },
      // 项目id保存
      async projIdSave() {
        this.loading = true;
        this.$set(this.boxConfigList, "project_id", this.project_id);
        let params = {
          boxConfigList: this.boxConfigList,
        };
        try {
          // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
          await this.$api.boxConfig.updateBoxConfig(params);
          this.projIdEditable = true;
          this.$message({
            message: "项目ID修改成功",
            duration: 2000,
            type: "success",
          });
        } catch (error) {
          this.$message({
            message: "项目ID修改失败",
            duration: 2000,
            type: "error",
          });
        } finally {
          this.loading = false;
        }
      },
  
      // 盒子名称编辑
      boxNameEdit() {
        this.boxNameEditable = false;
        this.boxName_before_edit = JSON.parse(JSON.stringify(this.box_name)); //保存编辑前项目id
      },
      // 盒子名称编辑取消
      boxNameEditCancle() {
        this.boxNameEditable = true;
        this.box_name = JSON.parse(JSON.stringify(this.boxName_before_edit)); //恢复编辑前项目id
      },
      // 盒子名称保存
      async boxNameSave() {
        this.loading = true;
        this.$set(this.boxConfigList, "box_name", this.box_name);
        let params = {
          boxConfigList: this.boxConfigList,
        };
        try {
          // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
          await this.$api.boxConfig.updateBoxConfig(params);
          this.boxNameEditable = true;
          this.$message({
            message: "盒子名称修改成功",
            duration: 2000,
            type: "success",
          });
        } catch (error) {
          this.$message({
            message: "盒子名称修改失败",
            duration: 2000,
            type: "error",
          });
        } finally {
          this.loading = false;
        }
      },
  
      // 获取算法服务aibox的状态
      async getAIBoxStatus() {
        const params = {
          box_id: 'SW-2023050002',
        };
        try {
          const res = await this.$api.boxConfig.getAIBoxStatus(params);
          var statusLabel = '';
          switch (res.data.status) {
            case 'running':
              statusLabel = '正在运行';
              break;
            case 'dead':
              statusLabel = '未启动';
              break;
            default:
              statusLabel = res.data.status;
              break;
          };
          this.$set(this.aiboxStatus, "status", statusLabel);
          this.$set(this.aiboxStatus, "time", res.data.date);
          console.log('aibox status', res);
        } catch (error) {
          this.$message({
            message: '获取算法服务状态失败',
            duration: 2000,
            type: 'error'
          });
          console.log(error);
        }
      },
  
      tableHeaderStyle({ row, column, rowIndex, columnIndex }) {
        if (rowIndex == 0) {
          return `
           background-color: #f5f7fa;
           text-align: center;
          `
        }
      }
  
    },
  
    beforeRouteLeave(to, from, next) {
      console.log('定时器关闭，切出通道配置页面 timer:', this.timerAIBoxStatus);
      window.clearInterval(this.timerAIBoxStatus);
      this.timerAIBoxStatus = null;
      next();
    },
  };
  </script>
  <style lang="less" scoped>
  .config-table {
    background: #fff;
    padding: 0px 20px 20px;
    // border: 1px solid #ddd;
    // border-radius: 5px;
    box-sizing: border-box;
  }
  
  .el-form-item {
    width: 400px;
    margin-bottom: 15px;
  }
  
  .el-select {
    width: 100%;
  }
  
  // 新增行
  .add-raw {
    width: 100%;
    padding: 10px 0px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
  
  // 通道数
  .channel-info {
    margin-right: 10px;
    display: flex;
    align-items: center;
    color: #a3a3a3;
    font-size: 14px;
  }
  
  // 算法服务状态
  .status-info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    color: #a3a3a3;
    font-size: 7px;
  }
  
  // url配置块
  .other-config {
    width: 100%;
    padding: 20px 20px 20px;
    margin-bottom: 10px;
    background: #fff;
    box-sizing: border-box;
  
    .el-input {
      width: 420px;
    }
  }
  
  // url保存、取消按钮
  .url-buttons {
    display: flex;
    flex-direction: row;
    align-items: align-items;
    justify-content: flex-end;
  }
  </style>
  