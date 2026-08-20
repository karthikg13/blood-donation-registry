const BASE_URL = "http://localhost:8080/api";

// Auth credentials live only in memory — never persisted to disk/localStorage.
// Cleared automatically on page refresh, which is fine for this demo app.
let authHeader = null;

// Lets App.jsx "subscribe" to 401 events without api.js needing to know
// anything about React. handleResponse just calls this function if it's set.
let unauthorizedHandler = null;
export function onUnauthorized(handler) {
    unauthorizedHandler = handler;
}

// Multiple components (the toast in App.jsx, error banners in DonorList/
// DonationList) all need to know when login succeeds, so this holds a list
// of callbacks rather than just one.
let authSuccessHandlers = [];
export function onAuthSuccess(handler) {
    authSuccessHandlers.push(handler);
}
function notifyAuthSuccess() {
    authSuccessHandlers.forEach((handler) => handler());
}

export function setAuthCredentials(username, password) {
    authHeader = "Basic " + btoa(`${username}:${password}`);
    notifyAuthSuccess();
}

export function hasAuthCredentials() {
    return authHeader !== null;
}

// Tests a username/password against the backend WITHOUT storing them yet.
// Returns true if valid, false if not — lets the login modal show an
// error and stay open instead of closing on bad credentials.
export async function verifyCredentials(username, password) {
    const testHeader = "Basic " + btoa(`${username}:${password}`);
    const res = await fetch(`${BASE_URL}/auth/check`, {
        headers: { Authorization: testHeader },
    });
    return res.ok;
}

function authHeaders(extra = {}) {
    const headers = { ...extra };
    if (authHeader) {
        headers.Authorization = authHeader;
    }
    return headers;
}

async function handleResponse(response) {
    if (response.status === 204) return null;

    if (response.status === 401) {
        if (unauthorizedHandler) unauthorizedHandler();
        throw new Error("Please log in to make changes.");
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        if (data?.errors) {
            const validationMessages = Object.values(data.errors).join(", ");
            throw new Error(validationMessages);
        }
        throw new Error(data?.message || "Something went wrong");
    }
    return data;
}

// Donors
export async function getDonors() {
    const res = await fetch(`${BASE_URL}/donors`);
    return handleResponse(res);
}

export async function createDonor(donor) {
    const res = await fetch(`${BASE_URL}/donors`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(donor),
    });
    return handleResponse(res);
}

export async function updateDonor(id, donor) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(donor),
    });
    return handleResponse(res);
}

export async function deleteDonor(id) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}

// Donations
export async function getDonationsForDonor(donorId, page = 0, size = 5) {
    const res = await fetch(`${BASE_URL}/donors/${donorId}/donations?page=${page}&size=${size}`);
    return handleResponse(res);
}

export async function createDonation(donorId, donation) {
    const res = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}

export async function updateDonation(id, donation) {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}

export async function deleteDonation(id) {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    return handleResponse(res);
}
