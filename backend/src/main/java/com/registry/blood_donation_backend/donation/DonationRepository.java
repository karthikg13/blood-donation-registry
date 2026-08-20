package com.registry.blood_donation_backend.donation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface DonationRepository extends JpaRepository<Donation, Long> {

    Page<Donation> findByDonorId(Long donorId, Pageable pageable);

    List<Donation> findByDonorIdOrderByDonationDateDesc(Long donorId);

    long countByDonorId(Long donorId);
}
