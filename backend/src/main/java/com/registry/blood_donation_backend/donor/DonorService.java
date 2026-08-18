package com.registry.blood_donation_backend.donor;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
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
        donorRepository.delete(existingDonor);
    }
}
