package com.aura.staffmanager.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department", nullable = false)
    private Department department;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private LocalDate hireDate;

    @Column(nullable = false)
    private Double salary;

    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus status;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
} 