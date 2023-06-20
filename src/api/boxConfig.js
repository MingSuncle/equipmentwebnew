import request from "../utils/request";

const boxConfig = {
    /**
     * 获取配置信息
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getBoxConfig() {
        return request({
            url: '/boxConfig/getBox',
            method: 'get',
            // params: params
        })
    },

    /**
     * 保存配置信息
     * @returns 成功则返回操作成功
     */
    updateBoxConfig(params) {
        return request({
            url: '/cgi-bin/boxConfig.cgi',
            method: 'post',
            data: params,
            headers: {'content-type': 'application/json;charset=utf-8'}
        })
    },

    /**
     * 更新配置按钮 算法重启
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    restartAIbox(params) {
        return request({
            url: '/cgi-bin/boxConfig.cgi',
            method: 'get',
            params: params
        })
    },

    /**
     * 获取算法服务aibox的状态
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getAIBoxStatus(params) {
        return request({
            url: '/boxConfig/getBoxStatus',
            method: 'get',
            params: params
        })
    },

    /**
     * 获取处理模式列表
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getProcessModeList(params) {
        return request({
            url: '/cgi-bin/boxConfig.cgi',
            method: 'get',
            params: params
        })
    },
}

export default boxConfig;