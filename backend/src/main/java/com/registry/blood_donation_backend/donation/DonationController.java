package com.registry.blood_donation_backend.donation;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping("/donations")
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/donors/{donorId}/donations")
    public Page<Donation> getDonationsForDonor(@PathVariable Long donorId, Pageable pageable) {
        return donationService.getDonationsForDonor(donorId, pageable);
    }

    @GetMapping("/donations/{id}")
    public Donation getDonationById(@PathVariable Long id) {
        return donationService.getDonationById(id);
    }

    @PostMapping("/donors/{donorId}/donations")
    @ResponseStatus(HttpStatus.CREATED)
    public Donation createDonation(
            @PathVariable Long donorId,
            @Valid @RequestBody Donation donation) {

        return donationService.createDonation(donorId, donation);
    }

    @PutMapping("/donations/{id}")
    public Donation updateDonation(
            @PathVariable Long id,
            @Valid @RequestBody Donation donation) {

        return donationService.updateDonation(id, donation);
    }

    @DeleteMapping("/donations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDonation(@PathVariable Long id) {
        donationService.deleteDonation(id);
    }
}