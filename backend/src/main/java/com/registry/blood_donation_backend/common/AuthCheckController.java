package com.registry.blood_donation_backend.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthCheckController {

    // If this returns 200, Spring Security already verified the credentials
    // in the Authorization header before this method ever ran.
    // If they were wrong/missing, Security returns 401 automatically —
    // this method body never even executes.
    @GetMapping("/api/auth/check")
    public String check() {
        return "ok";
    }
}
 
