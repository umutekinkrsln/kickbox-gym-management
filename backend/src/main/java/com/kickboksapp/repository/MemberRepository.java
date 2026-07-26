package com.kickboksapp.repository;

import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.enums.MembershipStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByStatus(MembershipStatus status);

    // Uyeligi yaklasan/biten uyeleri bulmak icin (dashboard uyarisi)
    List<Member> findByMembershipEndDateBetween(LocalDate start, LocalDate end);
}
