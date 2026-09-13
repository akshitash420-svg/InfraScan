// =====================================================
// INFRASCAN - FRONTEND LOGIC
// HTML + CSS + JavaScript + localStorage
// =====================================================


// =====================================================
// DEFAULT USERS
// =====================================================

const USERS = [
    {
        username: "CSE1A001",
        password: "CR@12345",
        name: "CSE 1A CR",
        role: "cr",
        className: "CSE - 1A"
    },
    {
        username: "admin",
        password: "InfraScan@123",
        name: "InfraScan Admin",
        role: "admin",
        className: ""
    }
];


// =====================================================
// STORAGE KEYS
// =====================================================

const CURRENT_USER_KEY = "infrascan_current_user";
const COMPLAINTS_KEY = "infrascan_complaints";


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
}


// =====================================================
// SAVE CURRENT USER
// =====================================================

function saveCurrentUser(user) {
    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "index.html";
}

// =====================================================
// START BUTTON
// =====================================================

function startApp() {
    window.location.href = "role.html";
}

// =====================================================
// ROLE PAGE
// =====================================================

function openStudentLogin() {
    window.location.href = "student-login.html";
}

function openAdminLogin() {
    window.location.href = "admin-login.html";
}


// =====================================================
// STUDENT LOGIN
// =====================================================

function studentLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const user = USERS.find(function(item) {

        return (
            item.username === username &&
            item.password === password &&
            item.role === "cr"
        );

    });


    if (!user) {

        showLoginError(
            "Invalid Student ID or password."
        );

        return;
    }


    saveCurrentUser(user);

    window.location.href = "student-dashboard.html";
}


// =====================================================
// ADMIN LOGIN
// =====================================================

function adminLogin(event) {

    event.preventDefault();

    const username =
        document.getElementById("adminId").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    const user = USERS.find(function(item) {

        return (
            item.username === username &&
            item.password === password &&
            item.role === "admin"
        );

    });


    if (!user) {

        showLoginError(
            "Invalid Admin ID or password."
        );

        return;
    }


    saveCurrentUser(user);

    window.location.href = "admin-dashboard.html";
}


// =====================================================
// LOGIN ERROR
// =====================================================

function showLoginError(message) {

    let errorBox =
        document.getElementById("loginError");

    if (!errorBox) {

        errorBox = document.createElement("p");

        errorBox.id = "loginError";
        errorBox.className = "login-error";

        const form =
            document.querySelector("form");

        if (form) {
            form.prepend(errorBox);
        }
    }

    errorBox.textContent = message;
}


// =====================================================
// PROTECT STUDENT DASHBOARD
// =====================================================

function checkStudentAccess() {

    const user = getCurrentUser();

    if (!user || user.role !== "cr") {

        window.location.href =
            "student-login.html";

        return false;
    }

    return true;
}


// =====================================================
// PROTECT ADMIN DASHBOARD
// =====================================================

function checkAdminAccess() {

    const user = getCurrentUser();

    if (!user || user.role !== "admin") {

        window.location.href =
            "admin-login.html";

        return false;
    }

    return true;
}


// =====================================================
// GET COMPLAINTS
// =====================================================

function getComplaints() {

    const data =
        localStorage.getItem(COMPLAINTS_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}


// =====================================================
// SAVE COMPLAINTS
// =====================================================

function saveComplaints(complaints) {

    localStorage.setItem(
        COMPLAINTS_KEY,
        JSON.stringify(complaints)
    );
}


// =====================================================
// REPORT ISSUE
// =====================================================

function reportIssue() {

    window.location.href =
        "new-complaint.html";
}


// =====================================================
// BACK TO STUDENT DASHBOARD
// =====================================================

function goBack() {

    window.location.href =
        "student-dashboard.html";
}


// =====================================================
// PHOTO FILE NAME
// =====================================================

function showFileName() {

    const fileInput =
        document.getElementById("issuePhoto");

    const fileName =
        document.getElementById("fileName");

    if (!fileInput || !fileName) {
        return;
    }


    if (fileInput.files.length > 0) {

        fileName.textContent =
            fileInput.files[0].name;

    } else {

        fileName.textContent =
            "No file selected";
    }
}


// =====================================================
// FILE TO BASE64
// =====================================================

function fileToBase64(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();

        reader.onload = function() {
            resolve(reader.result);
        };

        reader.onerror = function() {
            reject("Unable to read image.");
        };

        reader.readAsDataURL(file);
    });
}


// =====================================================
// SUBMIT COMPLAINT
// =====================================================

async function submitComplaint(event) {

    event.preventDefault();


    const user = getCurrentUser();


    if (!user || user.role !== "cr") {

        window.location.href =
            "student-login.html";

        return;
    }


    const classroom =
        document.getElementById("classroom")
            .value.trim();

    const issueType =
        document.getElementById("issueType")
            .value;

    const description =
        document.getElementById("description")
            .value.trim();

    const photoInput =
        document.getElementById("issuePhoto");


    if (!classroom ||
        !issueType ||
        !description) {

        alert("Please fill all required fields.");

        return;
    }


    let photo = "";


    // Convert image to Base64
    if (
        photoInput &&
        photoInput.files.length > 0
    ) {

        try {

            photo =
                await fileToBase64(
                    photoInput.files[0]
                );

        } catch {

            alert("Could not upload the photo.");

            return;
        }
    }


    const complaints =
        getComplaints();


    const newComplaint = {

        id: Date.now(),

        userId: user.username,

        studentName: user.name,

        className: user.className,

        classroom: classroom,

        issueType: issueType,

        description: description,

        photo: photo,

        status: "Pending",

        adminNote: "",

        createdAt:
            new Date().toLocaleString()
    };


    complaints.unshift(newComplaint);

    saveComplaints(complaints);


    alert(
        "Issue submitted successfully!"
    );


    window.location.href =
        "student-dashboard.html";
}


// =====================================================
// STUDENT DASHBOARD
// =====================================================

function loadStudentDashboard() {

    if (!checkStudentAccess()) {
        return;
    }


    const user = getCurrentUser();

    const complaints =
        getComplaints();


    // User name
    const welcomeName =
        document.querySelector(
            ".dashboard-welcome h1"
        );

    if (welcomeName) {

        welcomeName.textContent =
            "Welcome back, " + user.name;
    }


    // Only student's complaints
    const myComplaints =
        complaints.filter(function(complaint) {

            return complaint.userId === user.username;

        });


    const emptyState =
        document.querySelector(
            ".empty-dashboard"
        );


    const complaintsCard =
        document.querySelector(
            ".complaints-card"
        );


    if (!complaintsCard) {
        return;
    }


    // Remove old generated complaint list
    const oldList =
        document.getElementById(
            "studentComplaintList"
        );

    if (oldList) {
        oldList.remove();
    }


    if (myComplaints.length === 0) {

        if (emptyState) {
            emptyState.style.display = "block";
        }

        return;
    }


    // Hide empty state
    if (emptyState) {
        emptyState.style.display = "none";
    }


    const list =
        document.createElement("div");

    list.id =
        "studentComplaintList";

    list.className =
        "student-complaint-list";


    myComplaints.forEach(function(complaint) {

        const card =
            createStudentComplaintCard(
                complaint
            );

        list.appendChild(card);

    });


    complaintsCard.appendChild(list);
}


// =====================================================
// STUDENT COMPLAINT CARD
// =====================================================

function createStudentComplaintCard(complaint) {

    const card =
        document.createElement("div");

    card.className =
        "student-complaint-item";


    const statusClass =
        complaint.status
            .toLowerCase()
            .replace(/\s+/g, "-");


    card.innerHTML = `

        <div class="complaint-top">

            <div>

                <strong>
                    ${escapeHTML(complaint.issueType)}
                </strong>

                <small>
                    ${escapeHTML(complaint.classroom)}
                </small>

            </div>

            <span class="complaint-status ${statusClass}">
                ${escapeHTML(complaint.status)}
            </span>

        </div>


        <p>
            ${escapeHTML(complaint.description)}
        </p>


        <small>
            Reported: ${escapeHTML(complaint.createdAt)}
        </small>


        ${
            complaint.adminNote
            ? `
                <div class="admin-note">
                    <strong>Admin:</strong>
                    ${escapeHTML(complaint.adminNote)}
                </div>
            `
            : ""
        }


        <div class="student-complaint-actions">

            <button
                type="button"
                class="delete-issue-btn"
                onclick="deleteComplaint(${complaint.id})">

                Delete Issue

            </button>

        </div>

    `;


    return card;
}
// =====================================================
// ADMIN DASHBOARD
// =====================================================

function loadAdminDashboard() {

    if (!checkAdminAccess()) {
        return;
    }


    const complaints =
        getComplaints();


    // Statistics
    const total =
        complaints.length;


    const pending =
        complaints.filter(function(item) {

            return item.status === "Pending";

        }).length;


    const awaiting =
        complaints.filter(function(item) {

            return item.status ===
                "Awaiting Confirmation";

        }).length;


    const resolved =
        complaints.filter(function(item) {

            return item.status === "Resolved";

        }).length;


    setText(
        "totalReports",
        total
    );

    setText(
        "pendingReports",
        pending
    );

    setText(
        "confirmationReports",
        awaiting
    );

    setText(
        "resolvedReports",
        resolved
    );


    renderAdminComplaints(
        complaints
    );
}


// =====================================================
// SET TEXT
// =====================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


// =====================================================
// ADMIN COMPLAINTS
// =====================================================

function renderAdminComplaints(complaints) {

    const section =
        document.querySelector(
            ".admin-complaints"
        );


    if (!section) {
        return;
    }


    const oldList =
        document.getElementById(
            "adminComplaintList"
        );

    if (oldList) {
        oldList.remove();
    }


    const empty =
        document.querySelector(
            ".admin-empty"
        );


    if (complaints.length === 0) {

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }


    if (empty) {
        empty.style.display = "none";
    }


    const list =
        document.createElement("div");

    list.id =
        "adminComplaintList";

    list.className =
        "admin-complaint-list";


    complaints.forEach(function(complaint) {

        const card =
            createAdminComplaintCard(
                complaint
            );

        list.appendChild(card);

    });


    section.appendChild(list);
}


// =====================================================
// ADMIN COMPLAINT CARD
// =====================================================

function createAdminComplaintCard(complaint) {

    const card =
        document.createElement("div");

    card.className =
        "admin-complaint-item";


    const imageHTML =
        complaint.photo
        ? `
            <img
                src="${complaint.photo}"
                class="complaint-photo"
                alt="Issue photo">
        `
        : "";


    card.innerHTML = `

        <div class="admin-complaint-header">

            <div>

                <h3>
                    ${escapeHTML(complaint.issueType)}
                </h3>

                <p>
                    Room:
                    <strong>
                        ${escapeHTML(complaint.classroom)}
                    </strong>
                </p>

            </div>

            <span class="complaint-status">
                ${escapeHTML(complaint.status)}
            </span>

        </div>


        <div class="admin-complaint-info">

            <p>
                <strong>Reported by:</strong>
                ${escapeHTML(complaint.studentName)}
            </p>

            <p>
                <strong>Class:</strong>
                ${escapeHTML(complaint.className)}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(complaint.description)}
            </p>

            <p>
                <strong>Time:</strong>
                ${escapeHTML(complaint.createdAt)}
            </p>

        </div>


        ${imageHTML}


        <div class="admin-actions">

            <select
                onchange="changeComplaintStatus(${complaint.id}, this.value)">

                <option value="Pending"
                    ${complaint.status === "Pending" ? "selected" : ""}>
                    Pending
                </option>

                <option value="In Progress"
                    ${complaint.status === "In Progress" ? "selected" : ""}>
                    In Progress
                </option>

                <option value="Awaiting Confirmation"
                    ${complaint.status === "Awaiting Confirmation" ? "selected" : ""}>
                    Awaiting Confirmation
                </option>

                <option value="Resolved"
                    ${complaint.status === "Resolved" ? "selected" : ""}>
                    Resolved
                </option>

            </select>


            <button
                type="button"
                onclick="addAdminNote(${complaint.id})">

                Add Note

            </button>

        </div>


        ${
            complaint.adminNote
            ? `
                <div class="admin-note">
                    <strong>Admin Note:</strong>
                    ${escapeHTML(complaint.adminNote)}
                </div>
            `
            : ""
        }

    `;


    return card;
}


// =====================================================
// CHANGE COMPLAINT STATUS
// =====================================================

function changeComplaintStatus(
    complaintId,
    newStatus
) {

    const complaints =
        getComplaints();


    const complaint =
        complaints.find(function(item) {

            return item.id === complaintId;

        });


    if (!complaint) {
        return;
    }


    complaint.status =
        newStatus;


    saveComplaints(complaints);

    loadAdminDashboard();
}


// =====================================================
// ADMIN NOTE
// =====================================================

function addAdminNote(complaintId) {

    const complaints =
        getComplaints();


    const complaint =
        complaints.find(function(item) {

            return item.id === complaintId;

        });


    if (!complaint) {
        return;
    }


    const note =
        prompt(
            "Enter note for this complaint:",
            complaint.adminNote || ""
        );


    if (note === null) {
        return;
    }


    complaint.adminNote =
        note.trim();


    saveComplaints(complaints);

    loadAdminDashboard();
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHTML(value) {

    if (value === undefined ||
        value === null) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// // =====================================================
// DELETE COMPLAINT
// =====================================================

function deleteComplaint(complaintId) {

    const user = getCurrentUser();

    if (!user || user.role !== "cr") {
        return;
    }

    const complaints = getComplaints();

    const complaint = complaints.find(function(item) {
        return item.id === complaintId;
    });

    if (!complaint) {
        return;
    }

    if (complaint.userId !== user.username) {
        alert("You can delete only your own complaints.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this reported issue?"
    );

    if (!confirmed) {
        return;
    }

    const updatedComplaints = complaints.filter(function(item) {
        return item.id !== complaintId;
    });

    saveComplaints(updatedComplaints);

    loadStudentDashboard();
}
// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const path =
            window.location.pathname;


        // Student dashboard
        if (
            path.includes(
                "student-dashboard.html"
            )
        ) {

            loadStudentDashboard();
        }


        // Admin dashboard
        if (
            path.includes(
                "admin-dashboard.html"
            )
        ) {

            loadAdminDashboard();
        }


        // Student login
        const studentForm =
            document.getElementById(
                "studentLoginForm"
            );

        if (studentForm) {

            studentForm.addEventListener(
                "submit",
                studentLogin
            );
        }


        // Admin login
        const adminForm =
            document.getElementById(
                "adminLoginForm"
            );

        if (adminForm) {

            adminForm.addEventListener(
                "submit",
                adminLogin
            );
        }


        // Complaint form
        const complaintForm =
            document.getElementById(
                "issueForm"
            );

        if (complaintForm) {

            complaintForm.addEventListener(
                "submit",
                submitComplaint
            );
        }

    }
);