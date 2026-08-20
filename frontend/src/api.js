const BASE_URL = "http://localhost:8080/api";
const AUTH_HEADER = "Basic " + btoa("admin:admin123");

async function handleResponse(response) {
    if (response.status === 204) return null;
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
        headers: { "Content-Type": "application/json", Authorization: AUTH_HEADER },
        body: JSON.stringify(donor),
    });
    return handleResponse(res);
}

export async function deleteDonor(id) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, { method: "DELETE", headers: { Authorization: AUTH_HEADER } });
    return handleResponse(res);
}

export async function updateDonor(id, donor) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: AUTH_HEADER },
        body: JSON.stringify(donor),
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
        headers: { "Content-Type": "application/json", Authorization: AUTH_HEADER },
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}

export async function deleteDonation(id) {
 const res = await fetch(`${BASE_URL}/donations/${id}`, { method: "DELETE", headers: { Authorization: AUTH_HEADER } });
 return handleResponse(res);
}

export async function updateDonation(id, donation) {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: AUTH_HEADER },
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}