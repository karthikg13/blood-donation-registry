import { useState } from "react";
import { setAuthCredentials, verifyCredentials } from "./api";

function AuthModal({ onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [checking, setChecking] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setChecking(true);
        try {
           const isValid = await verifyCredentials(username, password);
           if (isValid) {
               setAuthCredentials(username, password);
               onClose();
           } else {
               setError("Incorrect username or password.");
           }
       } catch {
           setError("Could not reach the server. Please try again.");
       } finally {
           setChecking(false);
       }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <h2 className="modal-title">Sign in required</h2>
                <p className="modal-subtitle">
                    Adding, editing, or deleting records requires sign-in.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        className="modal-input"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <input
                        className="modal-input"
                        type="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-banner">{error}</p>}
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={checking}>
                            {checking ? "Checking..." : "Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
