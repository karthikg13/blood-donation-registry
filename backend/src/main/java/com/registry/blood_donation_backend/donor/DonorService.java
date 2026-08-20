package com.registry.blood_donation_backend.donor;

import com.registry.blood_donation_backend.donation.Donation;
import com.registry.blood_donation_backend.donation.DonationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final DonationRepository donationRepository;

    public DonorService(DonorRepository donorRepository, DonationRepository donationRepository) {
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id)
                .orElseThrow(() -> new DonorNotFoundException(id));
    }

    public Donor createDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public Donor updateDonor(Long id, Donor updatedDonor) {

        Donor existingDonor = getDonorById(id);
        existingDonor.setName(updatedDonor.getName());
        existingDonor.setBloodGroup(updatedDonor.getBloodGroup());
        existingDonor.setPhone(updatedDonor.getPhone());

        return donorRepository.save(existingDonor);
    }

    public void deleteDonor(Long id) {
        Donor existingDonor = getDonorById(id);

        List<Donation> theirDonations = donationRepository.findByDonorIdOrderByDonationDateDesc(id);
        donationRepository.deleteAll(theirDonations);
        
        donorRepository.delete(existingDonor);
    }

}
