package com.registry.blood_donation_backend.donation;

import java.time.LocalDate;

public class DonationNotEligibleException extends RuntimeException {

    public DonationNotEligibleException(LocalDate lastDonationDate, long daysSinceLastDonation) {
        super("Donor is not eligible to donate yet. Last donation was on " + lastDonationDate + ". Only " + daysSinceLastDonation + " days have passed. A minimum of 90 days is required.");
    }
}
