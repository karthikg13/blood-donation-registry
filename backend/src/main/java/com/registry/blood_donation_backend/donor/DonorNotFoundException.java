package com.registry.blood_donation_backend.donor;

public class DonorNotFoundException extends RuntimeException {

    public DonorNotFoundException(Long id) {
        super("Donor not found with id: " + id);
    }
}
