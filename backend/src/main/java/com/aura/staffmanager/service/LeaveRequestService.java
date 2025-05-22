package com.aura.staffmanager.service;

import com.aura.staffmanager.dto.leave.CreateLeaveRequest;
import com.aura.staffmanager.dto.leave.LeaveRequestResponse;
import com.aura.staffmanager.dto.leave.UpdateLeaveRequest;
import com.aura.staffmanager.entity.Employee;
import com.aura.staffmanager.entity.LeaveRequest;
import com.aura.staffmanager.entity.LeaveStatus;
import com.aura.staffmanager.entity.LeaveType;
import com.aura.staffmanager.repository.EmployeeRepository;
import com.aura.staffmanager.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;

    public List<LeaveRequestResponse> getAllLeaveRequests() {
        return leaveRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeaveRequestResponse> getMyLeaveRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LeaveRequestResponse getLeaveRequestById(Long id) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        return mapToResponse(leaveRequest);
    }

    @Transactional
    public LeaveRequestResponse createLeaveRequest(Long employeeId, CreateLeaveRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        leaveRequest.setType(request.getType());
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setReason(request.getReason());

        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        return mapToResponse(savedRequest);
    }

    @Transactional
    public LeaveRequestResponse updateLeaveRequest(Long id, UpdateLeaveRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (request.getStatus() != null) {
            leaveRequest.setStatus(request.getStatus());
        }
        if (request.getType() != null) {
            leaveRequest.setType(LeaveType.valueOf(request.getType()));
        }
        if (request.getStartDate() != null) {
            leaveRequest.setStartDate(LocalDate.parse(request.getStartDate()));
        }
        if (request.getEndDate() != null) {
            leaveRequest.setEndDate(LocalDate.parse(request.getEndDate()));
        }
        if (request.getReason() != null) {
            leaveRequest.setReason(request.getReason());
        }
        if (request.getComment() != null) {
            leaveRequest.setReason(leaveRequest.getReason() + "\nManager's comment: " + request.getComment());
        }

        LeaveRequest updatedRequest = leaveRequestRepository.save(leaveRequest);
        return mapToResponse(updatedRequest);
    }

    @Transactional
    public void deleteLeaveRequest(Long id) {
        if (!leaveRequestRepository.existsById(id)) {
            throw new RuntimeException("Leave request not found");
        }
        leaveRequestRepository.deleteById(id);
    }

    private LeaveRequestResponse mapToResponse(LeaveRequest leaveRequest) {
        return LeaveRequestResponse.builder()
                .id(leaveRequest.getId())
                .employeeId(leaveRequest.getEmployee().getId())
                .employeeName(leaveRequest.getEmployee().getFirstName() + " " + leaveRequest.getEmployee().getLastName())
                .startDate(leaveRequest.getStartDate())
                .endDate(leaveRequest.getEndDate())
                .type(leaveRequest.getType())
                .status(leaveRequest.getStatus())
                .reason(leaveRequest.getReason())
                .createdAt(leaveRequest.getCreatedAt())
                .updatedAt(leaveRequest.getUpdatedAt())
                .build();
    }
} 