package com.aura.staffmanager.service.impl;

import com.aura.staffmanager.dto.SalaryDTO;
import com.aura.staffmanager.entity.Employee;
import com.aura.staffmanager.entity.Salary;
import com.aura.staffmanager.entity.SalaryStatus;
import com.aura.staffmanager.repository.EmployeeRepository;
import com.aura.staffmanager.repository.SalaryRepository;
import com.aura.staffmanager.service.SalaryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalaryServiceImpl implements SalaryService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SalaryDTO> getAllSalaries() {
        return salaryRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryDTO> getEmployeeSalaries(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryDTO getSalaryById(Long id) {
        return salaryRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Salary not found with id: " + id));
    }

    @Override
    @Transactional
    public SalaryDTO createSalary(SalaryDTO salaryDTO) {
        Employee employee = employeeRepository.findById(salaryDTO.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + salaryDTO.getEmployeeId()));

        Salary salary = new Salary();
        updateSalaryFromDTO(salary, salaryDTO, employee);
        return convertToDTO(salaryRepository.save(salary));
    }

    @Override
    @Transactional
    public SalaryDTO updateSalary(Long id, SalaryDTO salaryDTO) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Salary not found with id: " + id));

        Employee employee = employeeRepository.findById(salaryDTO.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + salaryDTO.getEmployeeId()));

        updateSalaryFromDTO(salary, salaryDTO, employee);
        return convertToDTO(salaryRepository.save(salary));
    }

    @Override
    @Transactional
    public void deleteSalary(Long id) {
        if (!salaryRepository.existsById(id)) {
            throw new EntityNotFoundException("Salary not found with id: " + id);
        }
        salaryRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryDTO> getSalariesByMonthAndYear(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return salaryRepository.findByMonth(yearMonth).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private SalaryDTO convertToDTO(Salary salary) {
        SalaryDTO dto = new SalaryDTO();
        dto.setId(salary.getId());
        dto.setEmployeeId(salary.getEmployee().getId());
        dto.setEmployeeName(salary.getEmployee().getFirstName() + " " + salary.getEmployee().getLastName());
        dto.setBaseSalary(salary.getBaseSalary());
        dto.setBonus(salary.getBonus());
        dto.setDeductions(salary.getDeductions());
        dto.setNetSalary(salary.getNetSalary());
        dto.setMonth(salary.getMonth());
        dto.setStatus(salary.getStatus());
        dto.setComments(salary.getComments());
        return dto;
    }

    private void updateSalaryFromDTO(Salary salary, SalaryDTO dto, Employee employee) {
        salary.setEmployee(employee);
        salary.setBaseSalary(dto.getBaseSalary());
        salary.setBonus(dto.getBonus());
        salary.setDeductions(dto.getDeductions());
        salary.setMonth(dto.getMonth());
        salary.setYear(dto.getMonth().getYear());
        salary.setStatus(dto.getStatus());
        salary.setComments(dto.getComments());
    }
} 