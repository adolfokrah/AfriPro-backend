import { createState } from "@hookstate/core";
import {sort,filter} from '../../../utils/globalFunctions/sort_filter_function';
import { get,post } from "../../../services/api";
import countries from '../../../utils/counties';
import {showDialog} from '../../../components/dialog/dialog_state';
import preloaderState from "../../../components/preloader/preloader_state";

export const usersState = createState({
    users:[],
    staticUsers:[],
    currentPage:0,
    rowsPerPage:4,
    search:"",
    sortedKey:"",
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:""
 })


export const toggleBlock=async(userId:string)=>{

    const {users,staticUsers} = usersState;
    let newUsers = JSON.parse(JSON.stringify(users.get()));
    let newStaticUsers = JSON.parse(JSON.stringify(staticUsers.get()));
    let index = newUsers.findIndex((user:any)=>user.id === userId);
    let index2 = newStaticUsers.findIndex((user:any)=>user.id === userId);

    await post('/toggle_blocked',{"user_id":userId});

    if(index > -1){
        newUsers[index]['blocked'] = newUsers[index]['blocked'] === 'true' ? 'false' : 'true';
        newStaticUsers[index2]['blocked'] = newUsers[index]['blocked'];
        staticUsers.set(newStaticUsers);
        users.set(newUsers);
    }
}

export const fetchUsers=async ()=>{
    const {users,staticUsers} = usersState;
  let response = await get('/users');
  staticUsers.set(response);
  users.set(response);
}

 export const filterUsers=(value:string)=>{
    const {users,staticUsers, search,currentPage} = usersState;
    let data = filter(value,"name",staticUsers.get());
    users.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortUsers=(key:any)=>{
   const {sortedKey, users} = usersState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,users.get(),asend);
   users.set(data);
}

export const addUser=async()=>{
    const {firstName, lastName, emailAddress, phoneNumber} = usersState;
    if(validateEmail(emailAddress.get()) === false){
        showDialog("Attention","Please enter a valid email");
        return;
    }

    if(firstName.get().length < 2 || lastName.get().length < 2){
        showDialog("Attention","Please fill the form correctly");
        return;
    }

    if(phoneNumber.get().length < 9){
        showDialog("Attention","Please enter a valid phone number");
        return;
    }

    const phone = findCountry(usersState.phoneNumber.get());
    let data = {
        "first_name":firstName.get(),
        "last_name":lastName.get(),
        "phone_number_prefix":phone?.dial_code,
        "phone_number":phone?.phoneNumber,
        "email":emailAddress.get(),
        "country_code":phone?.countryCode,
        "user_type":"club_official",
        "agent":null,
        "fcmToken":null,
        "admin":"true"
    }


    try{
        preloaderState.loading.set(true);
        var response = await post("/register",data);
        if(response['status'] === 'error'){
            showDialog("Registration Failed",response['message']);
        }else{
            let user = response['user'];
            let data:any = {};
            data['name'] = user.first_name+" "+user.last_name;
            data['role'] = user.user_type;
            data['last_active'] = '';
            data['subscription'] = 'None';
            data['id'] = user.id;
            data['blocked'] = user.blocked;
            await fetchUsers();
            usersState.search.set("");
            usersState.currentPage.set(0);
            usersState.rowsPerPage.set(4);
            firstName.set("");
            lastName.set("");
            emailAddress.set("");
            phoneNumber.set(phone?.dial_code!);
            showDialog("Done","User Added successfully");
        }
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}

function validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function findCountry(phoneNumber:any) {

    phoneNumber = `+${phoneNumber}`;
    for (let index = 0; index < countries.length; index++) {
        if(phoneNumber.includes(countries[index].dial_code)){
            let countryCode =  countries[index].code;
            let dial_code = countries[index].dial_code;
            phoneNumber = phoneNumber.replace(dial_code,'');
            return {countryCode,phoneNumber, dial_code};
        }
    }
}
