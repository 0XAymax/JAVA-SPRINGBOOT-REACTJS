package com.aura.staffmanager.dto.employee;

import com.aura.staffmanager.entity.EmployeeStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotBlank(message = "Position is required")
    private String position;

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @NotNull(message = "Salary is required")
    private Double salary;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Status is required")
    private EmployeeStatus status;
} 