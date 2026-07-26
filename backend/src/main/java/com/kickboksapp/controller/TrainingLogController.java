package com.kickboksapp.controller;

import com.kickboksapp.dto.TrainingLogRequest;
import com.kickboksapp.entity.TrainingLog;
import com.kickboksapp.service.TrainingLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/training-logs")
@RequiredArgsConstructor
public class TrainingLogController {

    private final TrainingLogService trainingLogService;

    @GetMapping("/member/{memberId}")
    public List<TrainingLog> getByMember(@PathVariable Long memberId) {
        return trainingLogService.getByMember(memberId);
    }

    @PostMapping
    public ResponseEntity<TrainingLog> create(@RequestBody TrainingLogRequest request) {
        TrainingLog log = TrainingLog.builder()
                .logDate(request.getLogDate())
                .category(request.getCategory())
                .note(request.getNote())
                .nextGoal(request.getNextGoal())
                .build();

        return ResponseEntity.ok(
                trainingLogService.create(request.getMemberId(), request.getTrainerId(), log)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainingLogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
