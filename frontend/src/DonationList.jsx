import { useState, useEffect } from "react";
import { getDonationsForDonor, createDonation, updateDonation, deleteDonation } from "./api";

function DonationList({ donorId }) {
    const [donations, setDonations] = useState([]);
    const [form, setForm] = useState({ donationDate: "", quantity: "", location: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (donorId) {
            loadDonations();
        } else {
            setDonations([]);
        }
        setEditingId(null);
        setForm({ donationDate: "", quantity: "", location: "" });
    }, [donorId]);

    async function loadDonations() {
        try {
            const data = await getDonationsForDonor(donorId);
            setDonations(data.content);
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const payload = { ...form, quantity: Number(form.quantity) };
            if (editingId) {
                await updateDonation(editingId, payload);
                setEditingId(null);
            } else {
                await createDonation(donorId, payload);
            }
            setForm({ donationDate: "", quantity: "", location: "" });
            loadDonations();
        } catch (err) {
            setError(err.message);
        }
    }

    function handleEditClick(donation) {
        setEditingId(donation.id);
        setForm({
            donationDate: donation.donationDate,
            quantity: donation.quantity,
            location: donation.location,
        });
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm({ donationDate: "", quantity: "", location: "" });
    }

    async function handleDelete(id) {
        setError("");
        try {
            await deleteDonation(id);
            loadDonations();
        } catch (err) {
            setError(err.message);
        }
    }

    if (!donorId) {
        return <p>Select a donor to see their donations.</p>;
    }

    return (
        <div>
            <h2>Donations</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="date"
                    value={form.donationDate}
                    onChange={(e) => setForm({ ...form, donationDate: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
                <input
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <button type="submit">{editingId ? "Save Changes" : "Add Donation"}</button>
                {editingId && (
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {donations.map((donation) => (
                    <li key={donation.id}>
                        {donation.donationDate} — {donation.quantity}ml — {donation.location}
                        <button onClick={() => handleEditClick(donation)}>Edit</button>
                        <button onClick={() => handleDelete(donation.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DonationList;