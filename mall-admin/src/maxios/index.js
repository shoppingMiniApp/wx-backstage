// 引入axios
import axios from 'axios';
// 对axios的二次封装
const maxios = new axios.create({
    baseURL: "http://api_devs.wanxikeji.cn/",
    timeout: 3000,
});
maxios.interceptors.request.use((config)=>{
    return config;
})
maxios.interceptors.response.use((response)=>{
    return response
})
// 抛出
export default maxios;