package com.kickboksapp.repository;

import com.kickboksapp.entity.GymClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface GymClassRepository extends JpaRepository<GymClass, Long> {
    List<GymClass> findByDayOfWeek(DayOfWeek dayOfWeek);
}
