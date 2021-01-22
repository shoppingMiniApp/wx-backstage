import axios from 'axios';
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
export default maxios;