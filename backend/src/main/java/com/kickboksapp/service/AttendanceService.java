package com.kickboksapp.service;

import com.kickboksapp.entity.Attendance;
import com.kickboksapp.entity.GymClass;
import com.kickboksapp.entity.Member;
import com.kickboksapp.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final MemberService memberService;
    private final GymClassService gymClassService;

    public List<Attendance> getByMember(Long memberId) {
        return attendanceRepository.findByMemberId(memberId);
    }

    // Bir dersin belirli bir gundeki yoklamasi (kim geldi kim gelmedi gormek icin)
    public List<Attendance> getByClassAndDate(Long classId, LocalDate date) {
        return attendanceRepository.findByGymClassIdAndDate(classId, date);
    }

    // Check-in: uye ve dersin var oldugunu dogrulayip kaydi olusturuyor
    public Attendance checkIn(Long memberId, Long classId, LocalDate date) {
        Member member = memberService.getById(memberId);
        GymClass gymClass = gymClassService.getById(classId);

        Attendance attendance = Attendance.builder()
                .member(member)
                .gymClass(gymClass)
                .date(date != null ? date : LocalDate.now())
                .build();

        return attendanceRepository.save(attendance);
    }

    public void delete(Long id) {
        attendanceRepository.deleteById(id);
    }
}
