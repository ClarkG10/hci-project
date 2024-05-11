import {backendURL, logout, userLogged} from "../utils/utils.js";

userLogged();
logout();

async function getDatas(){
    
    document.querySelector("#job_container").innerHTML = `<div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-center" role="status" width="10px" height="10px">
    </div></div>`;
    
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
        const timeAgo = formatTimeDifference(element.created_at);
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
                    <div class="row">
                    <div class="col-9"><a class=" eraseline " href="${element.url}"><button class="btn1 mt-2">Apply</button></a></div>
                    <div class="col-3 mt-3"> <small class="">${timeAgo}</small></div></div>
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

function formatTimeDifference(date) {
    const currentDate = new Date();
    const commentDate = new Date(date);
    const timeDifference = currentDate.getTime() - commentDate.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    const weeksDifference = Math.floor(daysDifference / 7);
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (secondsDifference < 60) {
        return '1 second ago';
    } else if (minutesDifference < 2) {
        return `${minutesDifference} minute ago`;
    } else if (minutesDifference < 60) {
        return `${minutesDifference} minutes ago`;
    } else if (hoursDifference < 2) {
        return 'an hour ago';
    } else if (hoursDifference < 24) {
        return `${hoursDifference} hours ago`;
    } else if (daysDifference < 2) {
        return '1 day ago';
    } else if (daysDifference < 7) {
        return `${daysDifference} days ago`;
    } else if (weeksDifference < 2) {
        return '1 week ago';
    } else if (weeksDifference < 4) {
        return `${weeksDifference} weeks ago`;
    } else if (monthsDifference < 2) {
        return '1 month ago';
    } else if (monthsDifference < 12) {
        return `${monthsDifference} months ago`;
    } else if (yearsDifference < 2) {
        return '1 year ago';
    } else {
        return `${yearsDifference} years ago`;
    }
}

getDatas();