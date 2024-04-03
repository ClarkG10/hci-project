function setRouter() {
    switch(window.location.pathname){
        case "/":
        case "/login.html":
        case "/register.html":
            if(localStorage.getItem("token")){
                window.location.pathname = "/index.html";
            }  
            break;
        default: 
        break;
    }
}

export {setRouter};