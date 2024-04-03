const url = "http://hackernews.test";

const form_register = document.getElementById("form_register");

form_register.onsubmit = async (e) => {
    e.preventDefault();

    document.querySelector("#form_register button").disabled = true;

    const formData = new FormData(form_register);

    const response = await fetch(url + "/api/user", {
        method: "POST", 
        headers: {
            Accept: "application/json",
        },
        body: formData,
    }); 

    if(response.ok){
        const json = await response.json(); 
        console.log(json); 
        
        form_register.reset();




    }else if(response.status == 422){
        const json = await response.json();

        alert(json.message);
    }

    document.querySelector("#form_register button").disabled = false;
};