import { useState, useEffect } from "react";
import { getDonationsForDonor, createDonation, updateDonation, deleteDonation, onAuthSuccess } from "./api";

function DonationList({ donorId }) {
    const [donations, setDonations] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [form, setForm] = useState({ donationDate: "", quantity: "", location: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setPage(0);
    }, [donorId]);

    useEffect(() => {
        onAuthSuccess(() => setError(""));
    }, []);

    useEffect(() => {
        if (donorId) {
            loadDonations();
        } else {
            setDonations([]);
        }
        setEditingId(null);
        setError("");
        setForm({ donationDate: "", quantity: "", location: "" });
    }, [donorId, page]);

    async function loadDonations() {
        try {
            const data = await getDonationsForDonor(donorId, page);
            setDonations(data.content);
            setTotalPages(data.totalPages);
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
        setError("");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm({ donationDate: "", quantity: "", location: "" });
        setError("");
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
        return (
            <div className="panel">
                <h2 className="panel-title">Donations</h2>
                <p className="empty-state">Select a donor to see their donations.</p>
            </div>
        );
    }

    return (
        <div className="panel">
            <h2 className="panel-title">Donations</h2>

            <form className="record-form" onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">{editingId ? "Save Changes" : "Add Donation"}</button>
                {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            {error && <p className="error-banner">{error}</p>}

            {donations.length === 0 ? (
                <p className="empty-state">No donations recorded yet for this donor.</p>
            ) : (
                <ul className="record-list">
                    {donations.map((donation) => (
                        <li key={donation.id} className="record-card">
                            <div className="record-card-header">
                                <span className="record-actions">
                                    <button className="btn-small" onClick={() => handleEditClick(donation)}>
                                        Edit
                                    </button>
                                    <button
                                        className="btn-small btn-small-danger"
                                        onClick={() => handleDelete(donation.id)}
                                    >
                                        Delete
                                    </button>
                                </span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Date:</span>
                                <span className="field-value">{donation.donationDate}</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Quantity:</span>
                                <span className="field-value">{donation.quantity} ml</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Location:</span>
                                <span className="field-value">{donation.location}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="btn-small" disabled={page === 0} onClick={() => setPage(page - 1)}>
                        Previous
                    </button>
                    <span> Page {page + 1} of {totalPages} </span>
                    <button className="btn-small" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default DonationList;
