import { url } from "../utils/utils.js";

const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
    e.preventDefault();

console.log("untana mapislit ka hhuhu");

    document.querySelector("#form_login button").disabled = true;
    document.querySelector("#form_login button").innerHTML = `<div class="spinner-border" role="status" width="30px">
                                                                </div><span class="ms-2">Loading...</span>`;

    const formData = new FormData(form_login);

    const response = await fetch(url + "/api/login", {
        method: "POST", 
        headers: {
            Accept: "application/json",
        },
        body: formData,
    }); 

    if(response.ok){
        const json = await response.json(); 
        console.log(json); 
        
        localStorage.setItem("token", json.token);

        form_login.reset();

        document.querySelector(".correctbutton").click();

        window.location.pathname = "/index.html"

    }else if(response.status == 422){
        const json = await response.json();
        document.querySelector(".wrongbutton").click();
        document.querySelector("#wrongModal .wrong").innerHTML = json.message;
    }

    document.querySelector("#form_login button").disabled = false;
    document.querySelector("#form_login button").innerHTML = `Login`;
};