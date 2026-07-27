package com.kickboksapp.controller;

import com.kickboksapp.dto.ChatRequest;
import com.kickboksapp.dto.ChatResponse;
import com.kickboksapp.entity.Member;
import com.kickboksapp.entity.TrainingLog;
import com.kickboksapp.service.GeminiService;
import com.kickboksapp.service.MemberService;
import com.kickboksapp.service.TrainingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final GeminiService geminiService;
    private final TrainingLogService trainingLogService;
    private final MemberService memberService;

    // Genel antrenor asistani - herhangi bir soru sorulabilir
    @PostMapping("/ask")
    public ResponseEntity<ChatResponse> ask(@RequestBody ChatRequest request) {
        String prompt = """
                Sen bir kickbox salonu icin calisan yardimci bir antrenor asistanisin.
                Antrenman programlari, motivasyon mesajlari, beslenme onerileri ve
                salon isletmeciligi konularinda kisa ve pratik cevaplar ver.
                Turkce cevap ver.

                Soru: %s
                """.formatted(request.getMessage());

        String reply = geminiService.generateContent(prompt);
        return ResponseEntity.ok(new ChatResponse(reply));
    }

    // Bir uyenin gelisim gecmisini AI ile ozetleme
    @PostMapping("/summarize-member/{memberId}")
    public ResponseEntity<ChatResponse> summarizeMember(@PathVariable Long memberId) {
        Member member = memberService.getById(memberId);
        List<TrainingLog> logs = trainingLogService.getByMember(memberId);

        if (logs.isEmpty()) {
            return ResponseEntity.ok(new ChatResponse("Bu uye icin henuz gelisim kaydi girilmemis."));
        }

        String logsText = logs.stream()
                .map(log -> "- %s [%s] Not: %s | Hedef: %s".formatted(
                        log.getLogDate(),
                        log.getCategory(),
                        log.getNote() != null ? log.getNote() : "-",
                        log.getNextGoal() != null ? log.getNextGoal() : "-"
                ))
                .collect(Collectors.joining("\n"));

        String prompt = """
                Sen bir kickbox antrenorusun. Asagida %s adli uyenin kronolojik
                antrenman gelisim kayitlari var. Bu kayitlara bakarak:
                1) Uyenin genel gelisim trendini,
                2) guclu ve zayif yonlerini,
                3) onerilen bir sonraki adimi
                kisa ve pratik sekilde (en fazla 4-5 cumle) Turkce ozetle.

                Kayitlar:
                %s
                """.formatted(member.getFullName(), logsText);

        String summary = geminiService.generateContent(prompt);
        return ResponseEntity.ok(new ChatResponse(summary));
    }
}
