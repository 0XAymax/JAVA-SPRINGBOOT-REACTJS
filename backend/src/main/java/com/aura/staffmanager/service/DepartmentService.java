package com.aura.staffmanager.service;

import com.aura.staffmanager.dto.department.CreateDepartmentRequest;
import com.aura.staffmanager.dto.department.DepartmentResponse;
import com.aura.staffmanager.entity.Department;
import com.aura.staffmanager.exception.ResourceNotFoundException;
import com.aura.staffmanager.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToResponse(department);
    }

    public Department getDepartmentEntityById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Transactional
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Department with this name already exists");
        }

        Department department = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .employees(new ArrayList<>())
                .build();

        Department savedDepartment = departmentRepository.save(department);
        return mapToResponse(savedDepartment);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, CreateDepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        if (!department.getName().equals(request.getName()) && 
            departmentRepository.existsByName(request.getName())) {
            throw new RuntimeException("Department with this name already exists");
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department updatedDepartment = departmentRepository.save(department);
        return mapToResponse(updatedDepartment);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        if (!department.getEmployees().isEmpty()) {
            throw new RuntimeException("Cannot delete department with assigned employees");
        }

        departmentRepository.delete(department);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .name(department.getName())
                .description(department.getDescription())
                .employeeCount(department.getEmployees().size())
                .build();
    }
} 