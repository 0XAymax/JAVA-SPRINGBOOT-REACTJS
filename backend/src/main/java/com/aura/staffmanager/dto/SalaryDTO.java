package com.aura.staffmanager.dto;

import com.aura.staffmanager.entity.SalaryStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.YearMonth;

@Data
public class SalaryDTO {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private BigDecimal baseSalary;
    private BigDecimal bonus;
    private BigDecimal deductions;
    private BigDecimal netSalary;
    private YearMonth month;
    private SalaryStatus status;
    private String comments;
} 