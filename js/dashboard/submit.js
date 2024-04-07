import { backendURL} from "../utils/utils.js";

const form_submit = document.getElementById("form_submit");

form_submit.onsubmit = async (e) => {
    e.preventDefault();

    document.querySelector("#form_submit button").disabled = true;
    document.querySelector("#form_submit button").innerHTML = `<div class="spinner-border" role="status" width="30px"></div><span class="ms-2">Loading...</span>`;

    const formData = new FormData(form_submit);

    if (localStorage.getItem("token")) {
        try {
            const profileResponse = await fetch(backendURL + "/api/profile/show", {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                document.getElementById("user_id").value = profileData.id; // Set the value of the hidden input field
            } else {
                console.error("Failed to fetch profile:", profileResponse.statusText);
            }
        } catch (error) {
            console.error("An error occurred while fetching profile:", error);
        }
    }

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
    } else if (contentResponse.status == 422) {
        const json = await contentResponse.json();
        console.log("Validation error:", json.message);
    } else {
        console.error("Failed to submit content:", contentResponse.statusText);
    }

    document.querySelector("#form_submit button").disabled = false;
    document.querySelector("#form_submit button").innerHTML = `Submit`;
};
