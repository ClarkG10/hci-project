// Backend URL
const backendURL = "http://hackernews.test";

async function userLogged(){
    if(localStorage.getItem("token")) {
        document.querySelector(".logout").classList.remove("d-none");
        document.querySelector(".logout").classList.add("d-block");
        document.querySelector(".login1").classList.remove("d-block");
        document.querySelector(".login1").classList.add("d-none");

        const response = await fetch(backendURL + "/api/profile/show", { 
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        }); 
    
        if(response.ok){
        const json = await response.json();
        document.getElementById("user_logged").innerHTML = json.name;
        }
        } else {
        document.querySelector(".logout").classList.remove("d-block");
        document.querySelector(".logout").classList.add("d-none");
        document.querySelector(".login1").classList.remove("d-none");
        document.querySelector(".login1").classList.add("d-block");
    }
}

async function logout(){
    const btn_logout = document.getElementById("btn_logout");

    btn_logout.onclick = async () => {
    
    const response = await fetch(backendURL + "/api/logout", { 
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    }); 
    
    if(response.ok){
        localStorage.clear();
    
        window.location.pathname = "/";
    }else{
        const json = await response.json();
        document.querySelector(".wrongbutton").click();
        document.querySelector("#wrongModal .wrong").innerHTML = json.message;
    }

}
}

export {backendURL, userLogged, logout}