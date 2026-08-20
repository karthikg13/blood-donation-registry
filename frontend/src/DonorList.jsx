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
        <div>
            <h2>Donors</h2>

            <form onSubmit={handleSubmit}>
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
                <button type="submit">{editingId ? "Save Changes" : "Add Donor"}</button>
                {editingId && (
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {donors.map((donor) => (
                    <li key={donor.id}>
                    <span
                        onClick={() => handleSelectDonor(donor.id)}
                        style={{
                        cursor: "pointer",
                        fontWeight: selectedDonorId === donor.id ? "bold" : "normal",
                        }}
                    >
                        {donor.name} — {donor.bloodGroup} — {donor.phone}
                    </span>
                    <button onClick={() => handleEditClick(donor)}>Edit</button>
                    <button onClick={() => handleDelete(donor.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DonorList;