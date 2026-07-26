package com.kickboksapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "training_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    // Serbest metin tutuyoruz (ör. "TECHNIQUE", "CONDITIONING", "DISCIPLINE")
    // enum yerine string - antrenor ihtiyaca gore yeni kategori girebilsin.
    private String category;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "next_goal", columnDefinition = "TEXT")
    private String nextGoal;
}
