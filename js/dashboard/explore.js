import { backendURL, logout, userLogged } from "../utils/utils.js";

userLogged();
logout();
// Initialize counts for each content item
const contentCounts = {};

async function getDatas(keyword = "") {
    try {
        console.log(keyword)
        document.querySelector("#content_form").innerHTML = `<div class="d-flex align-items-center justify-content-center"><div class="spinner-border text-center" role="status" width="10px" height="10px">
        </div><span class="ms-2 fw-bold">Please Wait...</span></div>`;

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

        let container = "";
        for (const contentItem of content) {
            // Format Date
            const timeAgo = formatTimeDifference(contentItem.created_at);

            // Get username
            const author = await username(contentItem.user_id);

            // Filter comments for the current content item
            const contentComments = comments.filter(comment => comment.content_id === contentItem.content_id);

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
                                        <a data-bs-toggle="modal" data-bs-target="#modal-${contentItem.content_id}"><u>${contentComments.length} comments</u></a>
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
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content bg-white">
                            <button type="button" class="btn-close ms-auto align-items-end justify-content-end me-3 mt-3" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div class="container text-center">
                                <h5 class="modal-title fw-bold">${contentItem.title}</h5>
                                <div class="size1">
                                    <a href="${contentItem.url}" id="link" class="url-hidden">(${contentItem.url})</a>
                                </div>
                            </div>
                            <div class="modal-body" id="modal-${contentItem.content_id}-label">
                                <h5 class="fw-bold">Comment Section</h5>
                                <hr />
                                <!-- Comment section -->
                                ${contentComments ? renderComments(contentComments, contentItem.user_id) : 'No comments yet.'}
                            </div>
                            <div class="container comment_form">
                                <div class="row">
                                    <!-- Add comment form -->
                                    <form id="comment_form_${contentItem.content_id}">
                                        <div style="position: relative;">
                                            <input type="hidden" name="user_id" id="user_id_${contentItem.content_id}" value="${contentItem.user_id}" />
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

                if (response.ok) {
                    const json = await response.json(); 
                    // Reset the form after submission
                    commentForm.reset();
                    
                    // Optionally, update the comments section with the newly added comment
                    const commentsSection = document.getElementById(`modal-${contentItem.content_id}-label`);
                    const newCommentHTML = `
                        <div class="card mb-2 border-0">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                                <div class="col-11">
                                    <span class="card-text">${formData.get('comment')}</span>
                                    <small class="card-subtitle mb-2 text-muted"> (${formatTimeDifference(new Date())})</small>
                                </div>
                            </div>
                        </div>  
                    </div>`;
                    commentsSection.insertAdjacentHTML('beforeend', newCommentHTML);
                } else {
                    const json = await response.json(); 
                    console.log(json);
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
                Authorization: "Bearer " + localStorage.getItem("token"),
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
            console.error("Error fetching user data");
            return "Unknown"; // Return "Unknown" if there's an error in fetching user data
        }
    }
 
    const search_form = document.getElementById("search_form");
    search_form.onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(search_form);
    const keyword = formData.get("keyword");

    console.log(formData)
    // Call getDatas with the keyword
    getDatas(keyword);
}

}


function renderComments(comments, userId) {
    let html = '';
    comments.forEach((comment) => {
        const timeAgo = formatTimeDifference(comment.created_at);
        html += `
            <div class="card mb-2 border-0">
                <div class="card-body">
                    <div class="row">
                        <div class="col-1 center1"><img src="./assets/imgs/person-circle (1).svg" width="30px" height="30px" /></div>
                        <div class="col-11">
                            <span class="card-text">${comment.comment}</span>
                            <small class="card-subtitle mb-2 text-muted"> (${timeAgo})</small>
                        </div>
                    </div>
                </div>  
            </div>`;
    });
    return html;
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
        return `${minutesDifference} minutes ago`;
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
