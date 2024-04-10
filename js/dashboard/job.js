import {backendURL, logout, userLogged} from "../utils/utils.js";

userLogged();
logout();

async function getDatas(){
    
    document.querySelector("#job_container").innerHTML = `<div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-center" role="status" width="10px" height="10px">
    </div><span class="ms-2 fw-bold">Please Wait...</span></div>`;
    
    const response = await fetch(backendURL + "/api/content", {
        headers: {
            Accept: "application/json", 
        }
    });

    const json = await response.json();
    console.log(json);
    
    let container = "";
    json.forEach(element => {
    if(element.role == "Job"){

        container += `<!-- Card start -->
        <div class="col-6 fade-up">
        <div class="card mt-2 shadow" style="max-width: 580px">
            <div class="row g-0">
                <div class="col-md-2 center1 ps-2 rounded-3">
                <img src="${backendURL}/storage/${element.image}" width="55px" height="55px" />
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <span class="fw-bold"
                            >${element.title}
                        </span>
                    <a class="d-flex eraseline align-items-end justify-content-end" href="${element.url}"><button class="btn1 mt-2">Apply</button></a>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <!-- card end -->`
    }
    
});
document.getElementById("job_container").innerHTML = container;
}

getDatas();