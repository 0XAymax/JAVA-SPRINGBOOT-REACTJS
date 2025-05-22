package com.aura.staffmanager.repository;

import com.aura.staffmanager.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {
    List<Salary> findByEmployeeId(Long employeeId);
    Optional<Salary> findByEmployeeIdAndMonth(Long employeeId, YearMonth month);
    List<Salary> findByMonth(YearMonth month);
} 