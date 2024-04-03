import { url } from "../utils/utils.js";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
    e.preventDefault();

    document.querySelector("#form_register button").disabled = true;
    document.querySelector("#form_register button").innerHTML = `<div class="spinner-border" role="status" width="30px">
                                                                </div><span class="ms-2">Loading...</span>`;

    const formData = new FormData(form_register);

    const response = await fetch(url + "/api/user", {
        method: "POST", 
        headers: {
            Accept: "application/json",
        },
        body: formData,
    }); 

    if(response.ok){
        form_register.reset();

        document.querySelector(".correctbutton").click();

    }else if(response.status == 422){
        const json = await response.json();
        document.querySelector(".wrongbutton").click();
        document.querySelector("#wrongModal .wrong").innerHTML = json.message;
    }

    document.querySelector("#form_register button").disabled = false;
    document.querySelector("#form_register button").innerHTML = `Create an account`;
};