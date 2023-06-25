import request from "../utils/request";
import qs from "qs";

const video = {
    /**
     * 获取视频帧超链接
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getVideo(params) {
        return request({
            url: '/boxConfig/getImg',
            method: 'get',
            params: params
        })
    },

    /**
     * 获取video_info，包括channel_id, video_url, 空img_url
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getVideoInfo(params) {
        return request({
            url: '/cgi-bin/video.cgi',
            method: 'get',
            params: params
        })
    },

    /**
     * IPC拉流获取图片
     * @returns 成功返回data，失败返回rejected状态的promise对象
     */
    getImg(params) {
        return request({
            url: '/boxConfig/getImg',
            method: 'get',
            params: params
        })
    },
}

export default video;