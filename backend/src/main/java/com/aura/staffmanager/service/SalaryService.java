package com.aura.staffmanager.service;

import com.aura.staffmanager.dto.SalaryDTO;
import java.util.List;

public interface SalaryService {
    List<SalaryDTO> getAllSalaries();
    List<SalaryDTO> getEmployeeSalaries(Long employeeId);
    SalaryDTO getSalaryById(Long id);
    SalaryDTO createSalary(SalaryDTO salaryDTO);
    SalaryDTO updateSalary(Long id, SalaryDTO salaryDTO);
    void deleteSalary(Long id);
    List<SalaryDTO> getSalariesByMonthAndYear(int month, int year);
} 