package com.aura.staffmanager.repository;

import com.aura.staffmanager.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
    boolean existsByEmail(String email);
} 