package com.kickboksapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TrainingLogRequest {
    private Long memberId;
    private Long trainerId;
    private LocalDate logDate;
    private String category;
    private String note;
    private String nextGoal;
}
