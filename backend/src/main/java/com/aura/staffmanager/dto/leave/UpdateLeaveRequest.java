package com.aura.staffmanager.dto.leave;

import com.aura.staffmanager.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateLeaveRequest {
    private LeaveStatus status;
    private String comment;
    private String type;
    private String startDate;
    private String endDate;
    private String reason;
} 