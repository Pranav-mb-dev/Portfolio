package com.portfolio.backend.controller;

import com.portfolio.backend.dto.ContactRequest;
import com.portfolio.backend.model.ContactSubmission;
import com.portfolio.backend.repository.ContactSubmissionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for the contact form.
 *
 * Endpoints:
 *   POST /api/contact  — save a new submission
 *   GET  /api/contact  — list all submissions (newest first)
 */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:3000")   // allow the frontend dev server
public class ContactController {

    private final ContactSubmissionRepository repository;

    public ContactController(ContactSubmissionRepository repository) {
        this.repository = repository;
    }

    /**
     * Accepts a JSON body from the portfolio contact form,
     * validates it, and persists it to the H2 database.
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> submit(
            @Valid @RequestBody ContactRequest request) {

        ContactSubmission submission = new ContactSubmission(
                request.getName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );

        repository.save(submission);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Thanks " + request.getName() + "! Your message has been received."));
    }

    /**
     * Returns all contact submissions ordered newest-first.
     * Visit http://localhost:8080/api/contact in your browser to see entries.
     */
    @GetMapping
    public ResponseEntity<List<ContactSubmission>> getAll() {
        return ResponseEntity.ok(repository.findAllByOrderBySubmittedAtDesc());
    }

    /**
     * Returns a single submission by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ContactSubmission> getById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
