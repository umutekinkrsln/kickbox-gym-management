package com.kickboksapp.controller;

import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.enums.MembershipStatus;
import com.kickboksapp.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping
    public List<Member> getAll() {
        return memberService.getAll();
    }

    @GetMapping("/{id}")
    public Member getById(@PathVariable Long id) {
        return memberService.getById(id);
    }

    @GetMapping("/expiring-soon")
    public List<Member> getExpiringSoon() {
        return memberService.getExpiringSoon();
    }

    @GetMapping("/status/{status}")
    public List<Member> getByStatus(@PathVariable MembershipStatus status) {
        return memberService.getByStatus(status);
    }

    @PostMapping
    public ResponseEntity<Member> create(@RequestBody Member member) {
        return ResponseEntity.ok(memberService.create(member));
    }

    @PutMapping("/{id}")
    public Member update(@PathVariable Long id, @RequestBody Member member) {
        return memberService.update(id, member);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
