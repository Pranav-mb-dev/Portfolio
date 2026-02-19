package com.portfolio.backend.repository;

import com.portfolio.backend.model.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository — gives us save(), findAll(), etc. for free.
 */
@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {

    // Returns all submissions ordered newest-first
    List<ContactSubmission> findAllByOrderBySubmittedAtDesc();
}
