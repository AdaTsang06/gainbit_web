export const setSessionStore = (key,value) =>{
    try{
        value =JSON.stringify(value);
    }
    catch(e){

    }
    finally{
        window.sessionStorage.setItem(key,value);
    }
}

export const getSessionStore = key =>{
    try{
        return JSON.parse(window.sessionStorage.getItem(key));
    }
    catch(e){
        return window.sessionStorage.getItem(key);
    }
}

export const removeSessionStore = (key) => {
    window.sessionStorage.removeItem(key);
};

export const setLocalStore = (key,value) =>{
    try{
        value =JSON.stringify(value);
    }
    catch(e){

    }
    finally{
        window.localStorage.setItem(key,value);
    }
}

export const getLocalStore = key =>{
    try{
        return JSON.parse(window.localStorage.getItem(key));
    }
    catch(e){
        return window.localStorage.getItem(key);
    }
}

export const removeLocalStore = (key) => {
    window.localStorage.removeItem(key);
};