import request from "../utils/request";

const model = {
    /**
     * 获取配置信息
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getCodeTime() {
        return request({
            url: '/model/getCodeLastUpdateTime',
            method: 'get',
            // params: params
        })
    },



}

export default model;