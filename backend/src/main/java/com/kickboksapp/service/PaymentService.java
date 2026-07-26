package com.kickboksapp.service;

import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.Payment;
import com.kickboksapp.entity.enums.PaymentStatus;
import com.kickboksapp.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberService memberService;

    public List<Payment> getByMember(Long memberId) {
        return paymentRepository.findByMemberId(memberId);
    }

    public Payment create(Long memberId, Payment payment) {
        Member member = memberService.getById(memberId);
        payment.setMember(member);

        // Manuel odemede odeme aninda direkt PAID kabul ediyoruz.
        // Ileride online odeme eklendiginde provider webhook'u status'u guncelleyecek.
        if (payment.getStatus() == null) {
            payment.setStatus(PaymentStatus.PAID);
        }

        return paymentRepository.save(payment);
    }

    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }
}
