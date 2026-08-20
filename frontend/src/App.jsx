import { useState } from "react";
import DonorList from "./DonorList";
import DonationList from "./DonationList";
import './App.css';

function App() {
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  return (
    <div className="app-shell">
      <h1 className="app-title">Blood Donation Registry</h1>
      <p className="app-subtitle">Manage donors and track donation eligibility</p>
      <div className="panels">
        <DonorList selectedDonorId={selectedDonorId} onSelectDonor={setSelectedDonorId} />
        <DonationList donorId={selectedDonorId} />
      </div>
    </div>
  );
}

export default App;
 