package com.kickboksapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CheckInRequest {
    private Long memberId;
    private Long classId;
    private LocalDate date; // bos birakilirsa bugunun tarihi kullanilir
}
