package com.registry.blood_donation_backend.donor;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return donorService.getDonorById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Donor createDonor(@Valid @RequestBody Donor donor) {
        return donorService.createDonor(donor);
    }

    @PutMapping("/{id}")
    public Donor updateDonor(
            @PathVariable Long id,
            @Valid @RequestBody Donor donor) {

        return donorService.updateDonor(id, donor);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
    }
}
