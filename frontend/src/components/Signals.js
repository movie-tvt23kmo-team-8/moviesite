import {effect, signal} from '@preact/signals-react'
import axios from "axios";

axios.defaults.baseURL = '';

export const jwtToken = signal(getSessionToken());

export const userInfo = signal(null);

function getSessionToken(){
    const t = sessionStorage.getItem('token');
    return t===null || t==='null' ? '' : t;
}

effect(()=>{
    sessionStorage.setItem('token', jwtToken.value);

    if(jwtToken.value.length !== 0){
        axios.get('/users/personal', {headers: {Authorization: "Bearer " + jwtToken.value}})
            .then(resp => userInfo.value = resp.data)
            .catch(error => console.log(error.message))
    }else{
        userInfo.value = null;
    }
});