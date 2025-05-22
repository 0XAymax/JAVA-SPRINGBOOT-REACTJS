package com.aura.staffmanager.controller;

import com.aura.staffmanager.dto.SalaryDTO;
import com.aura.staffmanager.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
@RequiredArgsConstructor
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SalaryDTO>> getAllSalaries() {
        return ResponseEntity.ok(salaryService.getAllSalaries());
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#employeeId)")
    public ResponseEntity<List<SalaryDTO>> getEmployeeSalaries(@PathVariable Long employeeId) {
        return ResponseEntity.ok(salaryService.getEmployeeSalaries(employeeId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @securityService.isCurrentUser(#id)")
    public ResponseEntity<SalaryDTO> getSalaryById(@PathVariable Long id) {
        return ResponseEntity.ok(salaryService.getSalaryById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryDTO> createSalary(@RequestBody SalaryDTO salaryDTO) {
        return ResponseEntity.ok(salaryService.createSalary(salaryDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalaryDTO> updateSalary(
            @PathVariable Long id,
            @RequestBody SalaryDTO salaryDTO) {
        return ResponseEntity.ok(salaryService.updateSalary(id, salaryDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/month/{month}/year/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SalaryDTO>> getSalariesByMonthAndYear(
            @PathVariable int month,
            @PathVariable int year) {
        return ResponseEntity.ok(salaryService.getSalariesByMonthAndYear(month, year));
    }
} 