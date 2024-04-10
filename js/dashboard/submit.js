import { backendURL } from "../utils/utils.js";

const form_submit = document.getElementById("form_submit");

form_submit.onsubmit = async (e) => {
    e.preventDefault();

    document.querySelector("#form_submit button").disabled = true;
    document.querySelector("#form_submit button").innerHTML = `<div class="spinner-border" role="status" width="30px"></div><span class="ms-2">Loading...</span>`;

    const formData = new FormData(form_submit);

    const contentResponse = await fetch(backendURL + "/api/content", {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
    });

    if (contentResponse.ok) {
        form_submit.reset();
        document.querySelector(".correctbutton").click();
    } else if (contentResponse.status == 422) {
        const json = await contentResponse.json();
        console.log("Validation error:", json.message);
    } else {
        console.error("Failed to submit content:", contentResponse.statusText);
    }

    document.querySelector("#form_submit button").disabled = false;
    document.querySelector("#form_submit button").innerHTML = `Submit`;
};
