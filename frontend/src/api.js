const BASE_URL = "http://localhost:8080/api";

async function handleResponse(response) {
    if (response.status === 204) return null;
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = data?.message || "Something went wrong";
        throw new Error(message);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donor),
    });
    return handleResponse(res);
}

export async function deleteDonor(id) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, { method: "DELETE" });
    return handleResponse(res);
}

export async function updateDonor(id, donor) {
    const res = await fetch(`${BASE_URL}/donors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donor),
    });
    return handleResponse(res);
}

// Donations
export async function getDonationsForDonor(donorId) {
    const res = await fetch(`${BASE_URL}/donors/${donorId}/donations?size=10`);
    return handleResponse(res);
}

export async function createDonation(donorId, donation) {
    const res = await fetch(`${BASE_URL}/donors/${donorId}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}

export async function deleteDonation(id) {
 const res = await fetch(`${BASE_URL}/donations/${id}`, { method: "DELETE" });
 return handleResponse(res);
}

export async function updateDonation(id, donation) {
    const res = await fetch(`${BASE_URL}/donations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
    });
    return handleResponse(res);
}