import { useState } from "react";
import DonorList from "./DonorList";
import DonationList from "./DonationList";

function App() {
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>Blood Donation Registry</h1>
      <DonorList
          selectedDonorId={selectedDonorId}
          onSelectDonor={setSelectedDonorId}
        />
      <hr />
      <DonationList donorId={selectedDonorId} />
    </div>
  );
}

export default App;
 