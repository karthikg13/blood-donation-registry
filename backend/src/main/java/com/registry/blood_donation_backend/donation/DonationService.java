package com.registry.blood_donation_backend.donation;

import com.registry.blood_donation_backend.donor.Donor;
import com.registry.blood_donation_backend.donor.DonorNotFoundException;
import com.registry.blood_donation_backend.donor.DonorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationService {

    private static final long ELIGIBILITY_WAIT_DAYS = 90;

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;

    public DonationService(
            DonationRepository donationRepository,
            DonorRepository donorRepository) {

        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
    }

    public Page<Donation> getDonationsForDonor(Long donorId, Pageable pageable) {
        ensureDonorExists(donorId);
        return donationRepository.findByDonorId(donorId, pageable);
    }

    public long getDonationCountForDonor(Long donorId) {
        return donationRepository.countByDonorId(donorId);
    }

    public Donation getDonationById(Long id) {
        return donationRepository.findById(id).orElseThrow(() -> new DonationNotFoundException(id));
    }

    public Donation createDonation(Long donorId, Donation newDonation) {
        Donor donor = donorRepository.findById(donorId).orElseThrow(() -> new DonorNotFoundException(donorId));

        checkEligibility(donorId, newDonation.getDonationDate());

        newDonation.setDonor(donor);
        return donationRepository.save(newDonation);
    }

    public Donation updateDonation(Long id, Donation updatedDonation) {

        Donation existingDonation = getDonationById(id);
        existingDonation.setDonationDate(updatedDonation.getDonationDate());
        existingDonation.setQuantity(updatedDonation.getQuantity());
        existingDonation.setLocation(updatedDonation.getLocation());
        return donationRepository.save(existingDonation);
    }

    public void deleteDonation(Long id) {
        Donation existing = getDonationById(id);
        donationRepository.delete(existing);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    // ---- The edge case logic ----
    private void checkEligibility(Long donorId, LocalDate newDonationDate) {
        List<Donation> pastDonations = donationRepository.findByDonorIdOrderByDonationDateDesc(donorId);

        Donation closestPrior = pastDonations.stream()
                                .filter(d -> !d.getDonationDate().isAfter(newDonationDate))
                                .findFirst()
                                .orElse(null);

        if(closestPrior == null) return;

        long daysSinceLastDonation = ChronoUnit.DAYS.between(closestPrior.getDonationDate(), newDonationDate);

        if(daysSinceLastDonation < ELIGIBILITY_WAIT_DAYS) {
            throw new DonationNotEligibleException(closestPrior.getDonationDate(), daysSinceLastDonation);
        }
    }

    private void ensureDonorExists(Long donorId) {
        if(!donorRepository.existsById(donorId)) {
            throw new DonorNotFoundException(donorId);
        }
    }
}
                
