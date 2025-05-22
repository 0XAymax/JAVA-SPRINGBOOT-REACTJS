package com.aura.staffmanager.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.LocalDate;
import com.aura.staffmanager.entity.converter.YearMonthConverter;

@Data
@Entity
@Table(name = "salaries")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private BigDecimal baseSalary;

    @Column(nullable = false)
    private BigDecimal bonus;

    @Column(nullable = false)
    private BigDecimal deductions;

    @Column(nullable = false)
    private BigDecimal netSalary;

    @Convert(converter = YearMonthConverter.class)
    @Column(nullable = false)
    private YearMonth month;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalaryStatus status;

    @Column(length = 500)
    private String comments;

    @PrePersist
    @PreUpdate
    public void calculateNetSalary() {
        this.netSalary = this.baseSalary.add(this.bonus).subtract(this.deductions);
    }
} 