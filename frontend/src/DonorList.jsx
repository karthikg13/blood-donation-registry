import { useState, useEffect } from "react";
import { getDonors, createDonor, updateDonor, deleteDonor, getDonationCountForDonor,onAuthSuccess } from "./api";

function DonorList({ selectedDonorId, onSelectDonor }) {
    const [donors, setDonors] = useState([]);
    const [form, setForm] = useState({ name: "", bloodGroup: "", phone: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDonors();
        onAuthSuccess(() => setError(""));
    }, []);

    async function loadDonors() {
        try {
            const data = await getDonors();
            setDonors(data);
        } catch (err) {
            setError(err.message);
        }
    }   

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            if (editingId) {
                await updateDonor(editingId, form);
                setEditingId(null);
            } else {
                await createDonor(form);
            }
            setForm({ name: "", bloodGroup: "", phone: "" });
            loadDonors();
        } catch (err) {
            setError(err.message);
        }
    }
    
    function handleEditClick(donor) {
        setEditingId(donor.id);
        setForm({ name: donor.name, bloodGroup: donor.bloodGroup, phone: donor.phone });
        setError("");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm({ name: "", bloodGroup: "", phone: "" });
        setError("");
    }

    function handleSelectDonor(id) {
        setError("");
        onSelectDonor(id);
    }

    async function handleDelete(id) {
        setError("");
        try {
            const count = await getDonationCountForDonor(id);
            if(count > 0) {
                const confirmed = window.confirm(
                    `This donor has ${count} donation record${count === 1 ? "" : "s"}. ` + 
                    `Deleting the donor will also delete ${count === 1 ? "it" : "them"}. Continue?`
                );
                if(!confirmed) return;
            }
            await deleteDonor(id);
            loadDonors();
            if(selectedDonorId === id) onSelectDonor(null);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="panel">
            <h2 className="panel-title">Donors</h2>

            <form className="record-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Blood Group (e.g. O+)"
                    value={form.bloodGroup}
                    onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                />
                <input
                    placeholder="Phone (10 digits)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <button type="submit" className="btn btn-primary">{editingId ? "Save Changes" : "Add Donor"}</button>
                {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            {error && <p className="error-banner">{error}</p>}

            {donors.length === 0 ? (
                <p className="empty-state">No donors yet. Add one above to get started.</p>
            ) : (
                <ul className="record-list">
                    {donors.map((donor) => (
                        <li
                           key={donor.id}
                           className={
                               selectedDonorId === donor.id ? "record-card selected" : "record-card"
                           }
                           onClick={() => handleSelectDonor(donor.id)}
                        >
                            <div className="record-card-header">
                                <span className="record-actions">
                                    <button
                                        className="btn-small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(donor);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-small btn-small-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(donor.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Name:</span>
                                <span className="field-value">{donor.name}</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Blood Group:</span>
                                <span className="field-value">{donor.bloodGroup}</span>
                            </div>
                            <div className="record-field">
                                <span className="field-label">Phone No.:</span>
                                <span className="field-value">{donor.phone}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DonorList;
