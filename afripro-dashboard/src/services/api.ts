import axios from 'axios';
import { getUserData } from '../modules/authentication_module/states/authentication_state';

export async function get(path:string){
    let url = process.env.REACT_APP_API_URL+path;
    let userModel = getUserData();
    let token = userModel.token ?? "";
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    var response = await axios.get(url,config);
    return response.data;
}

export async function post(path:string,data:any){
    var url = process.env.REACT_APP_API_URL+path;

    let userModel = getUserData();
    let token = userModel.token ?? "";
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };

    var response = await axios.post(url,data,config);
    return response.data;
}
