package com.kickboksapp.repository;

import com.kickboksapp.entity.TrainingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingLogRepository extends JpaRepository<TrainingLog, Long> {
    List<TrainingLog> findByMemberIdOrderByLogDateDesc(Long memberId);
}
