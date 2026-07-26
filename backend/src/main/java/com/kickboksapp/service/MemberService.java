package com.kickboksapp.service;

import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.enums.MembershipStatus;
import com.kickboksapp.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    public Member getById(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Uye bulunamadi: " + id));
    }

    public Member create(Member member) {
        // Uyelik bitince otomatik "EXPIRED" olsun diye baslangicta durumu belirliyoruz
        if (member.getStatus() == null) {
            member.setStatus(MembershipStatus.ACTIVE);
        }
        return memberRepository.save(member);
    }

    public Member update(Long id, Member updated) {
        Member existing = getById(id);

        existing.setFullName(updated.getFullName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setHeightCm(updated.getHeightCm());
        existing.setWeightKg(updated.getWeightKg());
        existing.setCurrentLevel(updated.getCurrentLevel());
        existing.setEmergencyContactName(updated.getEmergencyContactName());
        existing.setEmergencyContactPhone(updated.getEmergencyContactPhone());
        existing.setMembershipStartDate(updated.getMembershipStartDate());
        existing.setMembershipEndDate(updated.getMembershipEndDate());
        existing.setPackageType(updated.getPackageType());
        existing.setStatus(updated.getStatus());

        return memberRepository.save(existing);
    }

    public void delete(Long id) {
        memberRepository.delete(getById(id));
    }

    // Dashboard icin: onumuzdeki 7 gun icinde uyeligi bitecekler
    public List<Member> getExpiringSoon() {
        LocalDate today = LocalDate.now();
        LocalDate weekLater = today.plusDays(7);
        return memberRepository.findByMembershipEndDateBetween(today, weekLater);
    }

    public List<Member> getByStatus(MembershipStatus status) {
        return memberRepository.findByStatus(status);
    }
}
