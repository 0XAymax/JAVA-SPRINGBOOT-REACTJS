package com.aura.staffmanager.service;

import com.aura.staffmanager.entity.Employee;
import com.aura.staffmanager.entity.LeaveRequest;
import com.aura.staffmanager.repository.EmployeeRepository;
import com.aura.staffmanager.repository.LeaveRequestRepository;
import com.aura.staffmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public boolean isCurrentUser(Long employeeId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return userRepository.findByEmail(auth.getName())
                .map(user -> {
                    Employee employee = employeeRepository.findByUserId(user.getId())
                            .orElse(null);
                    return employee != null && employee.getId().equals(employeeId);
                })
                .orElse(false);
    }

    public boolean isLeaveRequestOwner(Long leaveRequestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return userRepository.findByEmail(auth.getName())
                .map(user -> {
                    Employee employee = employeeRepository.findByUserId(user.getId())
                            .orElse(null);
                    if (employee == null) {
                        return false;
                    }

                    LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                            .orElse(null);
                    return leaveRequest != null && 
                           leaveRequest.getEmployee().getId().equals(employee.getId()) &&
                           leaveRequest.getStatus().name().equals("PENDING");
                })
                .orElse(false);
    }
} 