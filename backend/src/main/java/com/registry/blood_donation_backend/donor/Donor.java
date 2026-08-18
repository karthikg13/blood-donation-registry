package com.registry.blood_donation_backend.donor;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "donors")
public class Donor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Blood group is required")
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Blood group must be one of A+, A-, B+, B-, AB+, AB-, O+, O-")
    private String bloodGroup;

    @NotBlank
    @Pattern(regexp = "^\\d{10}$", message = "Phone no. must be exactly 10 digits")
    private String phone;

    public Donor() {}

    public Donor(String name, String bloodGroup, String phone) {
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
    }

    public Long getId() {return id;}
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {return name;}
    public void setName(String name) {
        this.name = name;
    }

    public String getBloodGroup() {return bloodGroup;}
    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhone() {return phone;}
    public void setPhone(String phone) {
        this.phone = phone;
    }
}
