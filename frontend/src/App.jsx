import { useEffect, useState } from "react";
import DonorList from "./DonorList";
import DonationList from "./DonationList";
import AuthModal from "./AuthModal";
import './App.css';
import { onUnauthorized, onAuthSuccess } from "./api";

function App() {
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Register once: whenever any write request in api.js gets a 401,
    // this fires and we show the login card.
    onUnauthorized(() => setShowAuthModal(true));

    // Fires once login succeeds. Show a toast for 5 seconds, then hide it.
    onAuthSuccess(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    });
  }, []);

  return (
    <div className="app-shell">
      <h1 className="app-title">Blood Donation Registry</h1>
      <p className="app-subtitle">Manage donors and track donation eligibility</p>
      <div className="panels">
        <DonorList selectedDonorId={selectedDonorId} onSelectDonor={setSelectedDonorId} />
        <DonationList donorId={selectedDonorId} />
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showToast && <div className="toast">Login successful</div>}
    </div>
  );
}

export default App;
