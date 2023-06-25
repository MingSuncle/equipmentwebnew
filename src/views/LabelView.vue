<template>
  <div class="label-container">
    <el-dialog title="提示" :visible.sync="isEditArea" width="30%" :before-close="handleEditClose">
      <span>确定编辑该区域吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleEdit">取 消</el-button>
        <el-button type="primary" @click="handleEditArea">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="isDeleteArea" width="30%" :before-close="handleDeleteClose" v-loading="loading">
      <span>确定删除该区域吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleDelete">取 消</el-button>
        <el-button type="primary" @click="handleDeleteArea">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 区域配置表单 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" v-loading="loading">
      <el-form ref="areaForm" :rules="rules" :model="areaForm" :inline="true" label-width="120px">
        <el-form-item label="区域名称" prop="area_name">
          <el-input v-model="areaForm.area_name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="AI事件等级" prop="AIevent_level">
          <el-select v-model="areaForm.AIevent_level">
            <el-option v-for="(item, index) in AIevent_level_list" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理模式" prop="AIevent_processmode">
          <el-select v-model="areaForm.AIevent_processmode">
            <el-option v-for="(value, key) in processModeList" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理参数" prop="AIevent_processparam">
          <el-row :gutter="15">
            <el-col :span="9">
              <el-input placeholder="参数名，如：电话1" v-model="paramKey"></el-input>
            </el-col>
            <el-col :span="11">
              <el-input placeholder="参数值，如：13812341234" v-model="paramVal"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button icon="el-icon-circle-plus-outline" circle @click="addParam"></el-button>
            </el-col>
          </el-row>
          <el-card style="width: 80%;" shadow="never">
            <div v-for="(value, key) in AIevent_processparam" :key="key">
              <i class="el-icon-delete" @click="deleteParam(key)"></i>
              {{ key + " : " + value }}
            </div>
          </el-card>
        </el-form-item>
        <el-form-item label="监测时间" prop="detect_time_List">
          <el-time-picker placeholder="起始时间" v-model="startTime" value-format="HH:mm" format='HH:mm' :picker-options="{
            selectableRange: '00:00:00 - 23:59:00',
          }">
          </el-time-picker>
          &#160;
          <el-time-picker placeholder="结束时间" v-model="endTime" value-format="HH:mm" format='HH:mm' :picker-options="{
            selectableRange: '00:00:00 - 23:59:00',
          }">
          </el-time-picker>
          &#160;
          <el-button icon="el-icon-circle-plus-outline" circle @click="addTime"></el-button>
          <el-card class="box-card" shadow="never">
            <div v-for="(item, index) in detect_time_List" :key="index">
              <i class="el-icon-delete" @click="deleteTime(index)"></i>
              {{ item[0] + " - " + item[1] }}
            </div>
          </el-card>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <div class="label-header">
      <div style="width: 100px; cursor: pointer">
        <i class="el-icon-back" @click="returnBoxConfig"></i>
      </div>
      <div class="edit-button">
        <el-button @click="addArea">绘制区域</el-button>
        <el-button @click="getImg">获取图片</el-button>
      </div>
    </div>

    <div class="label-content">
      <div class="label-main" v-loading="loading">
        <div class="image-container">
          <canvas id="canvasSave"></canvas>
          <canvas id="myCanvas" @mousedown="handleMousedown" @mousemove="handleMousemove">
          </canvas>
        </div>
      </div>
      <div class="label-asider">
        <div class="area-table">
          <el-table :data="detect_area_list" style="width: 100%" :show-header="false" highlight-current-row
            @row-click="showArea">
            <el-table-column min-width="100%">
              <template slot-scope="scope">
                <div class="area-item">
                  <span>{{ scope.row.area_name }}</span>
                  <div class="area-buttons">
                    <div class="area-button">
                      <i class="el-icon-edit" @click="editArea(scope.$index)"></i>
                    </div>

                    <div class="area-button">
                      <i class="el-icon-delete" @click="deleteArea(scope.$index)"></i>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="area-content">
          <el-descriptions title="详细信息" :column="1" border>
            <el-descriptions-item label="AI事件等级">{{
              this.showAreaDetail.AIevent_level !== -1
              ? this.AIevent_level_list[this.showAreaDetail.AIevent_level]
              : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="事件处理模式">{{
              this.processModeList[this.showAreaDetail.AIevent_processmode] }}</el-descriptions-item>
            <el-descriptions-item label="事件处理参数">
              <div v-for="(value, key) in this.showAreaDetail.AIevent_processparam" :key="key">
                {{ key + " : " + value }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="区域监测时间">
              <div v-for="(item, index) in this.showAreaDetail.detect_time_List" :key="index">
                {{ item[0] + "-" + item[1] }}
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      boxConfigList: {},
      channel: {},
      detect_area_list: [],
      // imageUrl: "/image/b.png",
      image: {}, //实际图片
      isEditArea: false,
      isAddArea: false,
      dialogVisible: false,
      editAreaIndex: -1,
      isDeleteArea: false,
      deleteAreaIndex: -1,
      context: "",
      ctxSave: "",
      channel_id: "",
      canvasMaxWidth: 1000,
      canvasMaxHeight: 500,
      ratio: "",
      areaForm: {},
      startTime: "",
      endTime: "",
      detect_time_List: [], // 监测时间
      canvasPointPosition: [],
      startPositon: "", //每个区域的第一个点
      temp_area_scoped: [], // 记录点坐标的数组
      area_scoped: [],
      isAreaComplete: false, // 区域是否闭合
      modelType: 0, // 0表示新增区域，1表示编辑
      showAreaDetail: {}, // 查看区域详细信息
      rules: {
        area_name: [{ required: true, message: "请输入区域名称" }],
        AIevent_level: [{ required: true, message: "请选择事件等级" }],
        AIevent_processmode: [{ required: true, message: "请选择处理模式" }],
        // AIevent_processparam: [{
        //   required: true,
        //   validator: (rule, value, callback) => {
        //     if (JSON.stringify(value) === '{}') {
        //       callback(new Error('请设置处理参数'));
        //     } else {
        //       callback();
        //     }
        //   },
        //   trigger: ['blur', 'change']
        // }],
        detect_time_List: [{ required: true, message: "请设置监测时间" }],
      },
      AIevent_level_list: ["严重", "一般", "紧急"],
      processModeList: {},

      paramKey: "",
      paramVal: "",
      AIevent_processparam: {},

      loading: false,
    };
  },
  mounted() {
    const area = JSON.parse(sessionStorage.getItem("area"));
    this.boxConfigList = JSON.parse(area.boxConfigList);
    this.detect_area_list = JSON.parse(area.detect_area_list);
    this.channel_id = area.index;
    this.channel = area.row;
    this.initCanvas();
    this.getProcessModeList();
  },

  methods: {
    returnBoxConfig() {
      sessionStorage.removeItem("area");
      this.$router.push("/boxConfig");
    },
    cancleEdit() {
      this.handleEditClose();
    },
    cancleDelete() {
      this.handleDeleteClose();
    },
    addArea() {
      this.isAddArea = true;
      this.areaForm = {};
      this.$set(this.areaForm, "AIevent_level", 1); //一般
      this.$set(this.areaForm, "AIevent_processmode", 2); //声音播报
      this.detect_time_List = [];
      this.AIevent_processparam = {};
    },
    handleClose() {
      this.dialogVisible = false;
      this.paramKey = "";
      this.paramVal = "";
      this.startTime = "";
      this.endTime = "";
      if (this.modelType === 1) {
        this.isEditArea = false;
      }
    },
    cancle() {
      this.handleClose();
    },
    submit() {
      this.$refs.areaForm.validate(async (valid) => {
        if (valid) {
          if (this.modelType === 0) {
            this.areaForm["detect_area_scope"] = this.area_scoped;
            this.detect_area_list.push(
              JSON.parse(JSON.stringify(this.areaForm))
            );
            // console.log("this.areaForm:", this.areaForm);
          } else {
            this.$set(this.detect_area_list, this.editAreaIndex, this.areaForm);
            // 重新加载showAreaDetail
            this.showAreaDetail = this.areaForm;
            this.editAreaIndex = -1;
            this.isEditArea = false;
          }
          // this.$refs.areaForm.resetFields();
          this.$set(this.channel, "detect_area_list", this.detect_area_list);
          this.$set(
            this.boxConfigList.channel_list,
            parseInt(this.channel_id),//this.channel_id,
            this.channel
          );
          this.$refs.dialogVisible = false;
          this.dialogVisible = false;
          // console.log("this.boxConfigList:", this.boxConfigList);
          this.loading = true;
          let params = {
            boxConfigList: this.boxConfigList,
          };
          try {
            // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
            await this.$api.boxConfig.updateBoxConfig(params);
            this.$message({
              message: "操作成功",
              duration: 2000,
              type: "success",
            });
            // sessionStorage也更新,防止用户刷新页面后数据显示有误
            sessionStorage.setItem("area", JSON.stringify({
              index: this.channel_id,
              row: this.channel,
              boxConfigList: JSON.stringify(this.boxConfigList),
              detect_area_list: JSON.stringify(this.detect_area_list),
            }))
            this.loading = false;
          } catch (error) {
            this.loading = false;
            this.$message({
              message: "操作失败",
              duration: 2000,
              type: "error",
            });
          }
        } else {
          console.log("更改配置失败");
          return false;
        }
      });
    },
    editArea(index) {
      this.isEditArea = true;
      this.editAreaIndex = index;
      // console.log(this.channel_list);
    },
    deleteArea(index) {
      this.isDeleteArea = true;
      this.deleteAreaIndex = index;
    },
    handleEditArea() {
      this.modelType = 1;
      this.dialogVisible = true;
      if (this.editAreaIndex === -1) {
        return;
      }
      this.areaForm = {};
      this.areaForm = JSON.parse(
        JSON.stringify(this.detect_area_list[this.editAreaIndex])
      );
      this.detect_time_List = JSON.parse(
        JSON.stringify(this.areaForm.detect_time_List)
      );
      this.AIevent_processparam = JSON.parse(
        JSON.stringify(this.areaForm.AIevent_processparam)
      );
    },
    async handleDeleteArea() {
      this.loading = true;
      if (this.deleteAreaIndex === -1) {
        return;
      }
      this.detect_area_list.splice(this.deleteAreaIndex, 1);
      this.isDeleteArea = false;
      this.deleteAreaIndex = -1;
      this.$set(this.channel, "detect_area_list", this.detect_area_list);
      this.$set(
        this.boxConfigList.channel_list,
        parseInt(this.channel_id),//this.channel_id,
        this.channel
      );
      let params = {
        boxConfigList: this.boxConfigList,
      };
      try {
        // await this.$api.boxConfig.updateBoxConfig(this.boxConfigList);
        await this.$api.boxConfig.updateBoxConfig(params);
        this.loading = false;
        this.$message({
          message: "操作成功",
          duration: 2000,
          type: "success",
        });
        // sessionStorage也更新,防止用户刷新页面后数据显示有误
        sessionStorage.setItem("area", JSON.stringify({
          index: this.channel_id,
          row: this.channel,
          boxConfigList: JSON.stringify(this.boxConfigList),
          detect_area_list: JSON.stringify(this.detect_area_list),
        }))
      } catch (error) {
        this.loading = false;
        this.$message({
          message: "操作失败",
          duration: 2000,
          type: "error",
        });
      }
    },
    handleEditClose() {
      this.isEditArea = false;
    },
    handleDeleteClose() {
      this.isDeleteArea = false;
    },
    // 查看已绘制好的对应区域
    showArea(row, column, e) {
      this.showAreaDetail = JSON.parse(JSON.stringify(row));
      let canvas = document.getElementById("myCanvas");
      this.context = canvas.getContext("2d");
      this.context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      var points = row.detect_area_scope;
      this.context.beginPath();
      this.context.moveTo(points[0][0] * this.ratio * this.image.width, points[0][1] * this.ratio * this.image.height);
      for (var i = 1; i < points.length; i++) {
        this.context.lineTo(
          points[i][0] * this.ratio * this.image.width,
          points[i][1] * this.ratio * this.image.height
        );
      }
      this.context.lineTo(points[0][0] * this.ratio * this.image.width, points[0][1] * this.ratio * this.image.height);
      this.context.fillStyle = "rgba(161,195,255,0.5)";
      this.context.fill();
      this.context.stroke();
    },
    addTime() {
      if (this.startTime !== "" && this.endTime !== "") {
        this.detect_time_List.push([this.startTime, this.endTime]);
        this.areaForm.detect_time_List.push([this.startTime, this.endTime]);
        this.startTime = "";
        this.endTime = "";
      }
    },
    deleteTime(index) {
      // console.log(index);
      this.detect_time_List.splice(index, 1);
      this.areaForm.detect_time_List.splice(index, 1);
    },
    handleMousemove(e) {
      if (!this.isAddArea) {
        return;
      }
      if (e.offsetX || e.clientX) {
        var pointX = e.offsetX == undefined ? e.clientX : e.offsetX;
        var pointY = e.offsetY == undefined ? e.clientY : e.offsetY;
        this.canvasPointPosition = [pointX, pointY];
        let canvas = document.getElementById("myCanvas");
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawPoint();
        if (this.temp_area_scoped.length > 0) {
          if (
            pointX > this.temp_area_scoped[0][0] - 15 &&
            pointX < this.temp_area_scoped[0][0] + 15 &&
            pointY > this.temp_area_scoped[0][1] - 15 &&
            pointY < this.temp_area_scoped[0][1] + 15
          ) {
            if (this.temp_area_scoped.length > 1) {
              this.canvasPointPosition = [
                this.temp_area_scoped[0][0],
                this.temp_area_scoped[0][1],
              ];
              // this.context.clearRect(0, 0, canvas.width, canvas.height);
              this.drawPoint();
              this.isAreaComplete = true;
            }
          } else {
            this.isAreaComplete = false;
          }
          this.context.beginPath();
          this.context.moveTo(
            this.temp_area_scoped[0][0],
            this.temp_area_scoped[0][1]
          );
          if (this.temp_area_scoped.length >= 1) {
            for (var i = 1; i < this.temp_area_scoped.length; i++) {
              this.context.lineTo(
                this.temp_area_scoped[i][0],
                this.temp_area_scoped[i][1]
              );
            }
            this.context.lineTo(
              this.canvasPointPosition[0],
              this.canvasPointPosition[1]
            );
            this.context.fillStyle = "rgba(161,195,255,0.5)";
            this.context.fill();
            this.context.stroke();
          }
        }
      }
    },
    handleMousedown(e) {
      if (!this.isAddArea) {
        return;
      }
      if (e.offsetX || e.clientX) {
        this.canvasPointPosition[0] =
          e.offsetX == undefined ? e.clientX : e.offsetX;
        this.canvasPointPosition[1] =
          e.offsetY == undefined ? e.clientY : e.offsetY;
        if (this.isAreaComplete && this.temp_area_scoped.length > 0) {
          this.canvasPointPosition = [
            this.temp_area_scoped[0][0],
            this.temp_area_scoped[0][1],
          ];
          this.drawPoint();
          this.temp_area_scoped.push(this.canvasPointPosition);
          this.saveArea(this.temp_area_scoped);
          this.temp_area_scoped = [];
          // 调用弹框
          // addArea = false；
        } else {
          this.drawPoint();
          this.temp_area_scoped.push(this.canvasPointPosition);
        }
      }
    },
    saveArea(pointArea) {
      for (var i = 0; i < pointArea.length; i++) {
        pointArea[i][0] = pointArea[i][0] / (this.ratio * this.image.width);
        pointArea[i][1] = pointArea[i][1] / (this.ratio * this.image.height);
      }
      this.area_scoped = JSON.parse(JSON.stringify(pointArea));
      // 并设置好时间等，然后加入列表中。
      this.dialogVisible = true;
      this.areaForm.detect_time_List = [];
      this.detect_time_List = [];
      this.areaForm.AIevent_processparam = {};
      this.AIevent_processparam = {};
    },
    drawPoint() {
      let canvas = document.getElementById("myCanvas");
      // this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.context.beginPath();
      this.context.fillStyle = "rgba(102,168,255,1)"; //设置填充样式
      this.context.arc(
        this.canvasPointPosition[0],
        this.canvasPointPosition[1],
        3,
        0,
        2 * Math.PI
      );
      this.context.fill(); //填充--默认黑色
    },
    initCanvas() {
      const _this = this;
      let canvas = document.getElementById("myCanvas");
      _this.context = canvas.getContext("2d");
      let canvasSave = document.getElementById("canvasSave");
      _this.ctxSave = canvasSave.getContext("2d");
      var img = new Image();
      // img.src = "http://192.168.1.205:9980/" + _this.channel.video_ip + ".png" + '?' + Math.random(); //local test
      img.src = "http://47.100.71.212:8080/pictures/10b8530f-4a5e-41dc-9c00-46ab6f7487dc.jpg"
      img.onload = function () {
        _this.ratio = _this.canvasMaxWidth / img.width;
        if (_this.ratio > _this.canvasMaxHeight / img.height) {
          _this.ratio = _this.canvasMaxHeight / img.height;
        }
        canvas.setAttribute("width", img.width * _this.ratio);
        canvas.setAttribute("height", img.height * _this.ratio);
        canvasSave.setAttribute("width", img.width * _this.ratio);
        canvasSave.setAttribute("height", img.height * _this.ratio);
        _this.ctxSave.drawImage(
          img,
          0,
          0,
          img.width * _this.ratio,
          img.height * _this.ratio
        );
        _this.image = img;
      };
      _this.showAreaDetail.AIevent_level = -1;
      _this.showAreaDetail.AIevent_processmode = -1;
      _this.showAreaDetail.detect_time_List = [];
      _this.showAreaDetail.AIevent_processparam = {};
    },

    // 添加处理参数
    addParam() {
      if (this.paramKey !== "" && this.paramVal !== "") {
        this.$set(this.AIevent_processparam, this.paramKey, this.paramVal);
        this.$set(this.areaForm.AIevent_processparam, this.paramKey, this.paramVal);
        this.paramKey = "";
        this.paramVal = "";
      }
    },

    // 删除处理参数
    deleteParam(key) {
      // console.log("key:", key);
      this.$delete(this.AIevent_processparam, key);
      this.$delete(this.areaForm.AIevent_processparam, key);
    },

    // 获取图片
    async getImg() {
      const params = {
        box_id: this.boxConfigList.box_id,
        video_id: this.channel.video_id,
      }
      console.log(params)
      console.log(this.channel)
      this.loading = true;
      // console.log(qs.stringify(params).replaceAll('%3A',':').replaceAll('%2F','/').replaceAll('%40','@'))
      try {
        await this.$api.video.getImg(params);
        // console.log("成功返回，拉流失败");

        // 更新到canvas
        this.initCanvas();
        this.loading = false;
        // this.$message({
        //   message: '获取图片失败，摄像头不在线',
        //   duration: 2000,
        //   type: 'error'
        // });
      } catch (error) {
        // 更新到canvas
        this.initCanvas(); //正常错误返回
        this.loading = false;
        console.log(error);
        // this.$message({
        //   message: '操作成功',
        //   duration: 2000,
        //   type: 'success'
        // });
      }
    },

    // 获取处理模式列表
    async getProcessModeList() {
      const params = {
        params: 'getProcessModeList',
      };
      try {
        const res = await this.$api.boxConfig.getProcessModeList(params);
        const data = res.data.result
        const objectData = data.reduce((obj, item) => {
          obj[item.processParamId] = item.processParamName;
          return obj;
        }, {});
        console.log('处理模式list:', objectData);
        this.processModeList = objectData;
      } catch (error) {
        console.log(error)
        this.$message({
          message: "获取处理模式失败",
          duration: 2000,
          type: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
#canvasSave {
  position: absolute;
}

#myCanvas {
  position: absolute;
  z-index: 1;
  cursor: crosshair;
}

.box-card {
  width: 200px;
}

li {
  list-style-type: none;
}

.canvas-box {
  width: 580px;
  height: 418px;
}

/* .time-items {
  width: 400px;
  display: inline;
} */
.label-container {
  height: 100%;
  width: 100%;
}

.label-header {
  height: 50px;
  width: auto;
  background-color: #242f42;
  color: white;
  font-size: 22px;
  line-height: 50px;
  padding: 0 10px 0 10px;
  display: flex;
}

.edit-button {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.label-content {
  background-color: white;
  height: 100%;
  display: flex;
}

.label-main {
  height: calc(100vh - 50px);
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.label-asider {
  height: 100%;
  width: 20%;
  border-left: 1px solid #e6e6e6;
}

.image-container {
  height: 500px;
  width: 1000px;
  display: flex;
  justify-content: center;
  align-content: center;
}

.area-content {
  height: calc(100vh - 200px);
  width: 100%;
  overflow: auto;
  padding-top: 20px;
}

.area-table {
  /* height: 200px; */
  width: 100%;
  /* border-bottom: 1px solid #e6e6e6; */
  overflow: auto;
}

.area-item {
  display: flex;
}

.area-buttons {
  font-size: 16px;
  margin-left: auto;
  display: flex;
}

.area-button {
  margin-right: 10px;
  cursor: pointer;
}
</style>
