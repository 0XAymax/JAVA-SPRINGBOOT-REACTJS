package com.aura.staffmanager.service;

import com.aura.staffmanager.dto.employee.CreateEmployeeRequest;
import com.aura.staffmanager.dto.employee.EmployeeResponse;
import com.aura.staffmanager.entity.Department;
import com.aura.staffmanager.entity.Employee;
import com.aura.staffmanager.entity.EmployeeStatus;
import com.aura.staffmanager.entity.User;
import com.aura.staffmanager.exception.ResourceNotFoundException;
import com.aura.staffmanager.repository.EmployeeRepository;
import com.aura.staffmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentService departmentService;

    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToResponse(employee);
    }

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        Department department = departmentService.getDepartmentEntityById(request.getDepartmentId());
        
        Employee employee = new Employee();
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(department);
        employee.setPosition(request.getPosition());
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());
        employee.setAddress(request.getAddress());
        employee.setStatus(request.getStatus());

        Employee savedEmployee = employeeRepository.save(employee);
        return mapToResponse(savedEmployee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setFirstName(employee.getFirstName());
        existingEmployee.setLastName(employee.getLastName());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setPosition(employee.getPosition());
        existingEmployee.setStatus(employee.getStatus());

        Employee updatedEmployee = employeeRepository.save(existingEmployee);
        return mapToResponse(updatedEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        employeeRepository.deleteById(id);
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .departmentId(employee.getDepartment().getId())
                .departmentName(employee.getDepartment().getName())
                .position(employee.getPosition())
                .hireDate(employee.getHireDate())
                .status(employee.getStatus())
                .userId(employee.getUser() != null ? employee.getUser().getId() : null)
                .build();
    }
} 