import { backendURL, logout, userLogged } from "../utils/utils.js";

userLogged();
logout();
// Initialize counts for each content item
const contentCounts = {};

async function getDatas(keyword = "") {
    try {
        console.log(keyword)
        document.querySelector("#content_form").innerHTML = `<div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-center" role="status" width="10px" height="10px">
        </div></div>`;

            const profileResponse = await fetch( backendURL +
              "/api/profile/show",
              {
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + localStorage.getItem("token"),
                },
              });
       
            const profileData = await profileResponse.json();
           
          
        // Fetch content and comments
        const content_response = await fetch(backendURL + "/api/content?keyword=" + keyword, {
            headers: {
                accept: "application/json",
            },
        });
        const content = await content_response.json();

        const comment_response = await fetch(backendURL + "/api/comment", {
            headers: {
                accept: "application/json",
            },
        });
        const comments = await comment_response.json();
        console.log(content)
        let container = "";
        for (let i = 0; i < content.length; i++) {
            const contentItem = content[i];

            // Format Date
            const timeAgo = formatTimeDifference(contentItem.created_at);
            console.log(profileData.id)

            // Get username
            const author = await username(contentItem.user_id);

            // Filter comments for the current content item
            const contentComments = comments.filter(comment => comment.content_id === contentItem.content_id);
            console.log(contentComments);
            // Initialize count for this content item
            if (!contentCounts[contentItem.content_id]) {
                contentCounts[contentItem.content_id] = 0;
            }
            let count = 0;
            container += `
                <div class="card mt-2 mx-4 shadow fade-up" style="max-width: 880px">
                    <div class="row g-0">
                        <div class="col-md-1 ms-3 center1">
                            <img src="${backendURL}/storage/${contentItem.image}" width="70px" height="70px" />
                        </div>
                        <div class="col-md-9">
                            <div class="card-body">
                                <span class="size">${contentItem.title} <small class="text-muted ">(${contentItem.role})</small></span>
                                <span class="size1">
                                    <a href="${contentItem.url}" id="link" class="url-hidden d-flex">${contentItem.url}</a>
                                </span>
                                <small class="text-body-secondary">
                                    <span class="mt-3 size1">
                                        <u>By ${author}</u>
                                        <span class="fw-bold px-2">|</span>${timeAgo}<span class="fw-bold px-2">|</span>
                                        <a data-bs-toggle="modal" data-bs-target="#modal-${contentItem.content_id}"><u style="cursor: pointer;">${contentComments.length} comments</u></a>
                                    </span><span class="fw-bold px-2">|</span>${count} points
                                </small>
                            </div>
                        </div>
                        <div class="col-1 text-end ps-5 ms-4 pt-2">
                            <button class="border-0 bg-white heart-icon" data-content-id="${contentItem.content_id}" type="button" onclick="alertclick1()">
                                <img src="./assets/imgs/heart${contentCounts[contentItem.content_id] > 0 ? '1' : ''}.png" alt="" width="20px">
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Modal -->
                <div class="modal fade" id="modal-${contentItem.content_id}" tabindex="-1" aria-labelledby="modal-${contentItem.content_id}-label" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content bg-white">
                            <button type="button" class="btn-close ms-auto align-items-end justify-content-end me-3 mt-3" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div class="container text-center">
                                <h5 class="modal-title fw-bold">${contentItem.title}</h5>
                                <div class="size1">
                                    <a href="${contentItem.url}" id="link" class="url-hidden">(${contentItem.url})</a>
                                </div>
                            </div>
                            <div><h5 class="fw-bold mt-2 ms-3">Comment Section</h5>
                            <hr /></div>
                            <div class="modal-body" id="modal-${contentItem.content_id}-label">
                                
                                <!-- Comment section -->
                                ${contentComments ? await renderComments(contentComments) : 'No comments yet.'}
                            </div>
                            <div class="container comment_form">
                                <div class="row">
                                    <!-- Add comment form -->
                                    <form id="comment_form_${contentItem.content_id}">
                                        <div style="position: relative;">
                                            <input type="hidden" name="user_id" id="user_id_${contentItem.content_id}" value="${profileData.id}" />
                                            <input type="hidden" name="content_id" id="content_id" value="${contentItem.content_id}" />
                                            <div class="comment_input"><textarea class="form-control mb-2" rows="2" id="comment" name="comment" placeholder="Leave a comment"></textarea></div>
                                            <!-- Arrow emoji button -->
                                            <button type="submit" class="bg-white border-0" style="position: absolute; top: 15px; right: 5px; bottom: 12px;">
                                                &#10148; <!-- Arrow emoji -->
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }
        
        document.getElementById("content_form").innerHTML = container;
       
        // Setup form submission for each content item
        for (const contentItem of content) {
            const commentForm = document.getElementById(`comment_form_${contentItem.content_id}`);

            commentForm.onsubmit = async (e) => {
                e.preventDefault(); // Prevent page refresh
                const formData = new FormData(commentForm);
                const response = await fetch(backendURL + "/api/comment", {
                    method: "POST", 
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: formData,
                }); 

                const response1 = await fetch(backendURL + "/api/user", {
                    headers: {
                        Accept: "application/json",
                    },
                });
                    

                    const json = await response.json(); 
                    const json1 = await response1.json();
                    console.log(json1)
                    let i;
                    // Reset the form after submission
                    for(let i = 0; i < json1.length; i++){
                    if (json1[i].id == json.user_id) {
                        commentForm.reset();
                    
                        // Optionally, update the comments section with the newly added comment
                        const commentsSection = document.getElementById(`modal-${contentItem.content_id}-label`);
                        const newCommentHTML = `
                            <div class="card mb-2 border-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                                    <div class="col-11">
                                    <small>${json1[i].name}</small><br>
                                        <span class="card-text">${formData.get('comment')}</span>
                                        <small class="card-subtitle mb-2 text-muted"> (${formatTimeDifference(new Date())})</small>
                                    </div>
                                </div>
                            </div>  
                        </div>`;
                        commentsSection.insertAdjacentHTML('beforeend', newCommentHTML);
                    } else if(localStorage.getItem("token") === null){
                        commentForm.reset();
                    
                        // Optionally, update the comments section with the newly added comment
                        const commentsSection = document.getElementById(`modal-${contentItem.content_id}-label`);
                        const newCommentHTML = `
                            <div class="card mb-2 border-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                                    <div class="col-11">
                                    <small>Anonymous</small><br>
                                        <span class="card-text">${formData.get('comment')}</span>
                                        <small class="card-subtitle mb-2 text-muted"> (${formatTimeDifference(new Date())})</small>
                                    </div>
                                </div>
                            </div>  
                        </div>`;
                        commentsSection.insertAdjacentHTML('beforeend', newCommentHTML);
                    }
                }
            }
        }
        document.querySelectorAll('.heart-icon').forEach((heartIcon) => {
            heartIcon.addEventListener('click', async () => {
                const contentId = heartIcon.getAttribute('data-content-id');
                // Toggle heart icon image
                heartIcon.innerHTML = `<img src="./assets/imgs/heart${contentCounts[contentId] > 0 ? '' : '1'}.png" alt="" width="20px">`;
                // Toggle count
                contentCounts[contentId] += (contentCounts[contentId] > 0 ? -1 : 1);
                // Update points count in UI
                const pointsElement = document.querySelector(`#content_form [data-content-id="${contentId}"] .text-body-secondary`);
                if (pointsElement) {
                    pointsElement.innerHTML = `<span class="mt-3 size1">
                                                    <u>By ${author}</u>
                                                    <span class="fw-bold px-2">|</span>${timeAgo}<span class="fw-bold px-2">|</span>
                                                    <a data-bs-toggle="modal" data-bs-target="#modal-${contentId}"><u>${contentComments.length} comments</u></a>
                                                </span><span class="fw-bold px-2">|</span>${contentCounts[contentId]} points`;
                }
                // Log updated count
                console.log(`Content ${contentId} count: ${contentCounts[contentId]}`);
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    async function username(user_id) {
        const response = await fetch(backendURL + "/api/user", {
            headers: {
                Accept: "application/json",
            },
        });

        if (response.ok) {
            const json = await response.json();
            const user = json.find(user => user.id === user_id); // Find the user with the given user_id
            if (user) {
                return user.name; // Return the username if user is found
            } else {
                return "Unknown"; // Return "Unknown" if user is not found
            }
        } else {
            return "Unknown"; // Return "Unknown" if there's an error in fetching user data
        }
    }
 
    const search_form = document.getElementById("search_form");
    search_form.onsubmit = async (e) => {
    e.preventDefault();
console.log(search_form)
    const formData = new FormData(search_form);
    const keyword = formData.get("keyword");

    console.log(formData)
    // Call getDatas with the keyword
    getDatas(keyword);
}

}


async function renderComments(comments) {
    let html = '';

    // Loop through each comment
    for (const comment of comments) {
        const timeAgo = formatTimeDifference(comment.created_at);

        try {
            // Fetch user data based on comment's user_id
            const response = await fetch(backendURL + "/api/user", {
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                const users = await response.json();

                // Find the user corresponding to the comment's user_id
                const user = users.find(user => user.id === comment.user_id);

                // Construct HTML based on whether user is found or not
                if (user) {
                    html += `
                        <div class="card mb-2 border-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                                    <div class="col-11">
                                        <small>${user.name}</small><br>
                                        <span class="card-text">${comment.comment}</span>
                                        <small class="card-subtitle mb-2 text-muted"> (${timeAgo})</small>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                } else {
                    // User not found, render as Anonymous
                    html += `
                        <div class="card mb-2 border-0">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                                    <div class="col-11">
                                        <small>Anonymous</small><br>
                                        <span class="card-text">${comment.comment}</span>
                                        <small class="card-subtitle mb-2 text-muted"> (${timeAgo})</small>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                }
            } else {
                console.error("Failed to fetch user data");
                // Handle fetch failure gracefully
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Handle error in fetch operation
        }
    }

    return html; // Return the accumulated HTML
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
