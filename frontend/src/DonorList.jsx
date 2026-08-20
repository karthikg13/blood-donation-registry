import { useState, useEffect } from "react";
import { getDonors, createDonor, updateDonor, deleteDonor } from "./api";

function DonorList({ selectedDonorId, onSelectDonor }) {
    const [donors, setDonors] = useState([]);
    const [form, setForm] = useState({ name: "", bloodGroup: "", phone: "" });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDonors();
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
            await deleteDonor(id);
            loadDonors();
            if (selectedDonorId === id) onSelectDonor(null);
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
                        <li key={donor.id} className={selectedDonorId === donor.id ? "record-row selected" : "record-row"}>
                            <span className="record-info" onClick={() => handleSelectDonor(donor.id)}>
                                {donor.name} — {donor.bloodGroup} — {donor.phone}
                            </span>
                            <span className="record-actions">
                                <button className="btn-small" onClick={() => handleEditClick(donor)}>Edit</button>
                                <button className="btn-small btn-small-danger" onClick={() => handleDelete(donor.id)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DonorList;