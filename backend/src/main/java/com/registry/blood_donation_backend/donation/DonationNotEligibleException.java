package com.registry.blood_donation_backend.donation;

import java.time.LocalDate;

public class DonationNotEligibleException extends RuntimeException {

    public DonationNotEligibleException(LocalDate lastDonatioDate, long daysSinceLastDonation) {
        super("Donor is not eligible to donate yet. Last donation was on " + lastDonatioDate + "(" + daysSinceLastDonation + " days ago). Must wait 90 days between donations.");
    }
}
