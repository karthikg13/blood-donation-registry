package com.registry.blood_donation_backend.common;

import com.registry.blood_donation_backend.donor.DonorNotFoundException;
import com.registry.blood_donation_backend.donation.DonationNotFoundException;
import com.registry.blood_donation_backend.donation.DonationNotEligibleException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // --- Not-found errors -> 404 ---
    @ExceptionHandler({DonorNotFoundException.class, DonationNotFoundException.class})
    public ResponseEntity<Object> handleNotFound(RuntimeException ex) {
        Map<String, Object> body = baseBody(HttpStatus.NOT_FOUND);
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // --- Business rule conflict (90-day rule) -> 409 ---
    @ExceptionHandler(DonationNotEligibleException.class)
    public ResponseEntity<Object> handleNotEligible(DonationNotEligibleException ex) {
        Map<String, Object> body = baseBody(HttpStatus.CONFLICT);
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // --- Field validation errors (@Valid failures) -> 400 with per-field messages ---
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = baseBody(HttpStatus.BAD_REQUEST);
        body.put("message", "Validation failed");
        body.put("errors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);

    }

    // --- Malformed JSON / wrong types (e.g. bad date format) -> 400 ---
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {

        Map<String, Object> body = baseBody(HttpStatus.BAD_REQUEST);
        body.put("message", "Malformed request body. Check field types and date formats (expected yyyy-MM-dd).");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // --- Catch-all for anything unexpected -> 500 ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        Map<String, Object> body = baseBody(HttpStatus.INTERNAL_SERVER_ERROR);
        body.put("message", "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private Map<String, Object> baseBody(HttpStatus status) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        return body;
    }
}
 