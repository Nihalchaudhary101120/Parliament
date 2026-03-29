import axios from 'axios';

const api = axios.create({
    baseURL:"https://parliamentbackend.onrender.com",
    withCredentials:true, // send/ receive cookies
    headers:{
        'Content-Type' : 'application/json'
    }
});

export default api;
