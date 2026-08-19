package com.registry.blood_donation_backend.donation;

public class DonationNotFoundException extends RuntimeException {

    public DonationNotFoundException(Long id) {
        super("Donation not found with id: " + id);
    }
}