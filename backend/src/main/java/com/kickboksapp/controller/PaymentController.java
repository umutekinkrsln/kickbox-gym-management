package com.kickboksapp.controller;

import com.kickboksapp.entity.Payment;
import com.kickboksapp.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/member/{memberId}")
    public List<Payment> getByMember(@PathVariable Long memberId) {
        return paymentService.getByMember(memberId);
    }

    @PostMapping("/member/{memberId}")
    public ResponseEntity<Payment> create(@PathVariable Long memberId, @RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.create(memberId, payment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paymentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
