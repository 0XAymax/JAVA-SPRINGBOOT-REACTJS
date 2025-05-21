package com.aura.staffmanager.controller;

import com.aura.staffmanager.dto.department.CreateDepartmentRequest;
import com.aura.staffmanager.dto.department.DepartmentResponse;
import com.aura.staffmanager.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentController.class);
    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(">>> Auth user: " + auth.getName());
        System.out.println(">>> Roles: " + auth.getAuthorities());
        List<DepartmentResponse> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        logger.debug("Getting department with id: {}", id);
        DepartmentResponse department = departmentService.getDepartmentById(id);
        logger.debug("Found department: {}", department);
        return ResponseEntity.ok(department);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody CreateDepartmentRequest request) {
        logger.debug("Creating new department with request: {}", request);
        DepartmentResponse department = departmentService.createDepartment(request);
        logger.debug("Created department: {}", department);
        return ResponseEntity.ok(department);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody CreateDepartmentRequest request) {
        logger.debug("Updating department with id: {} and request: {}", id, request);
        DepartmentResponse department = departmentService.updateDepartment(id, request);
        logger.debug("Updated department: {}", department);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        logger.debug("Deleting department with id: {}", id);
        departmentService.deleteDepartment(id);
        logger.debug("Successfully deleted department with id: {}", id);
        return ResponseEntity.noContent().build();
    }
} 