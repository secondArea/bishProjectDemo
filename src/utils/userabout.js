import {
    v4 as uudiv4
} from "uuid"
const TOKEN_KEY="TOKEN_KEY";


function getUserTempId() {
    let userTempId = localStorage.getItem("USERTEMPID_KEY");
    if(!userTempId){

        userTempId=uudiv4();
        localStorage.setItem("USERTEMPID_KEY",userTempId);
    }
    return userTempId;
}
function getItem(){
    return localStorage.getItem(TOKEN_KEY);
}
function setItem(token){
    localStorage.setItem(TOKEN_KEY,token);
}
function removeItem(){
    localStorage.removeItem(TOKEN_KEY);
}


export {
    getUserTempId,
    getItem,
    setItem,
    removeItem
}