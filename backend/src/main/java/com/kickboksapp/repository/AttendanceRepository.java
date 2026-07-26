package com.kickboksapp.repository;

import com.kickboksapp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByMemberId(Long memberId);
    List<Attendance> findByGymClassIdAndDate(Long classId, LocalDate date);
}
