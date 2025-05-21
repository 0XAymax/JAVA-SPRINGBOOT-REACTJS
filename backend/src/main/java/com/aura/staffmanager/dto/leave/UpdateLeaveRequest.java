package com.aura.staffmanager.dto.leave;

import com.aura.staffmanager.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateLeaveRequest {
    @NotNull(message = "Status is required")
    private LeaveStatus status;
    private String comment;
} 