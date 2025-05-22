package com.aura.staffmanager.dto.employee;

import com.aura.staffmanager.entity.EmployeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long departmentId;
    private String departmentName;
    private String position;
    private LocalDate hireDate;
    private Double salary;
    private String address;
    private EmployeeStatus status;
    private Long userId;
} 