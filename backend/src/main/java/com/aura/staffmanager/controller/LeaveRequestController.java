package com.aura.staffmanager.controller;

import com.aura.staffmanager.dto.leave.CreateLeaveRequest;
import com.aura.staffmanager.dto.leave.LeaveRequestResponse;
import com.aura.staffmanager.dto.leave.UpdateLeaveRequest;
import com.aura.staffmanager.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<LeaveRequestResponse>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveRequestResponse>> getMyLeaveRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        // TODO: Get employee ID from user details
        Long employeeId = 1L; // Temporary hardcoded value
        return ResponseEntity.ok(leaveRequestService.getMyLeaveRequests(employeeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestResponse> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveRequestResponse> createLeaveRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateLeaveRequest request) {
        // TODO: Get employee ID from user details
        Long employeeId = 1L; // Temporary hardcoded value
        return ResponseEntity.ok(leaveRequestService.createLeaveRequest(employeeId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequestResponse> updateLeaveRequest(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLeaveRequest request) {
        return ResponseEntity.ok(leaveRequestService.updateLeaveRequest(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }
} 