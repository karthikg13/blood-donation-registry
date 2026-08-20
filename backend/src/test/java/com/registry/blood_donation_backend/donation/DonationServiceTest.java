package com.registry.blood_donation_backend.donation;

import com.registry.blood_donation_backend.donor.Donor;
import com.registry.blood_donation_backend.donor.DonorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationServiceTest {

    @Mock
    private DonationRepository donationRepository;

    @Mock
    private DonorRepository donorRepository;

    @InjectMocks
    private DonationService donationService;

    private Donor donor;

    @BeforeEach
    void setUp() {
        donor = new Donor("Test Donor", "O+", "9876543210");
        donor.setId(1L);
    }

    @Test
    void firstDonation_isAlwaysAllowed() {
        when(donorRepository.findById(1L)).thenReturn(Optional.of(donor));
        when(donationRepository.findByDonorIdOrderByDonationDateDesc(1L))
                .thenReturn(List.of()); // no past donations

        Donation newDonation = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", null);
        when(donationRepository.save(any(Donation.class))).thenReturn(newDonation);

        Donation result = donationService.createDonation(1L, newDonation);

        assertNotNull(result);
        verify(donationRepository).save(any(Donation.class));
    }

    @Test
    void donation_lessThan90Days_isBlocked() {
        when(donorRepository.findById(1L)).thenReturn(Optional.of(donor));

        Donation lastDonation = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", donor);
        when(donationRepository.findByDonorIdOrderByDonationDateDesc(1L))
                .thenReturn(List.of(lastDonation));

        Donation newDonation = new Donation(LocalDate.of(2026, 2, 1), 450, "City Hospital", null); // 31 days later

        assertThrows(DonationNotEligibleException.class,
                () -> donationService.createDonation(1L, newDonation));

        verify(donationRepository, never()).save(any(Donation.class));
    }

    @Test
    void donation_exactly90Days_isAllowed() {
        when(donorRepository.findById(1L)).thenReturn(Optional.of(donor));

        Donation lastDonation = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", donor);
        when(donationRepository.findByDonorIdOrderByDonationDateDesc(1L))
                .thenReturn(List.of(lastDonation));

        LocalDate exactly90DaysLater = LocalDate.of(2026, 1, 1).plusDays(90);
        Donation newDonation = new Donation(exactly90DaysLater, 450, "City Hospital", null);
        when(donationRepository.save(any(Donation.class))).thenReturn(newDonation);

        Donation result = donationService.createDonation(1L, newDonation);

        assertNotNull(result);
        verify(donationRepository).save(any(Donation.class));
    }

    @Test
    void donation_89Days_isBlocked() {
        when(donorRepository.findById(1L)).thenReturn(Optional.of(donor));

        Donation lastDonation = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", donor);
        when(donationRepository.findByDonorIdOrderByDonationDateDesc(1L))
                .thenReturn(List.of(lastDonation));

        LocalDate day89 = LocalDate.of(2026, 1, 1).plusDays(89);
        Donation newDonation = new Donation(day89, 450, "City Hospital", null);

        assertThrows(DonationNotEligibleException.class,
                () -> donationService.createDonation(1L, newDonation));
    }

    @Test
    void backdatedDonation_comparesAgainstClosestPriorDate_notLatest() {
        when(donorRepository.findById(1L)).thenReturn(Optional.of(donor));

        // Donor has donations on Jan 1 and Jun 1 (151 days apart)
        Donation jan1 = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", donor);
        Donation jun1 = new Donation(LocalDate.of(2026, 6, 1), 450, "City Hospital", donor);

        when(donationRepository.findByDonorIdOrderByDonationDateDesc(1L))
                .thenReturn(List.of(jun1, jan1)); // sorted desc, matches real query order

        // Backdated entry for April 15 — 104 days after Jan 1 (allowed), NOT ~47 days
        // before Jun 1. If the buggy "always compare against latest" logic were still
        // in place, this would incorrectly compare against Jun 1 and produce a
        // negative day count. With the fix, it correctly compares against Jan 1.
        LocalDate backdatedDate = LocalDate.of(2026, 4, 15);
        Donation backdated = new Donation(backdatedDate, 450, "City Hospital", null);
        when(donationRepository.save(any(Donation.class))).thenReturn(backdated);

        Donation result = donationService.createDonation(1L, backdated);

        assertNotNull(result); // succeeds because it's 104 days after Jan 1
        verify(donationRepository).save(any(Donation.class));
    }
 

    @Test
    void createDonation_donorNotFound_throwsException() {
        when(donorRepository.findById(99L)).thenReturn(Optional.empty());

        Donation newDonation = new Donation(LocalDate.of(2026, 1, 1), 450, "City Hospital", null);

        assertThrows(com.registry.blood_donation_backend.donor.DonorNotFoundException.class,
                () -> donationService.createDonation(99L, newDonation));

        verify(donationRepository, never()).save(any(Donation.class));
    }

}