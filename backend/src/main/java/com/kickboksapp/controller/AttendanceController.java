package com.kickboksapp.controller;

import com.kickboksapp.dto.CheckInRequest;
import com.kickboksapp.entity.Attendance;
import com.kickboksapp.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendances")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping("/member/{memberId}")
    public List<Attendance> getByMember(@PathVariable Long memberId) {
        return attendanceService.getByMember(memberId);
    }

    @GetMapping("/class/{classId}")
    public List<Attendance> getByClassAndDate(@PathVariable Long classId,
                                               @RequestParam(required = false) LocalDate date) {
        return attendanceService.getByClassAndDate(classId, date != null ? date : LocalDate.now());
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(
                attendanceService.checkIn(request.getMemberId(), request.getClassId(), request.getDate())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        attendanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
