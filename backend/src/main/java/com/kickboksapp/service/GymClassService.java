package com.kickboksapp.service;

import com.kickboksapp.entity.GymClass;
import com.kickboksapp.repository.GymClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GymClassService {

    private final GymClassRepository gymClassRepository;

    public List<GymClass> getAll() {
        return gymClassRepository.findAll();
    }

    public GymClass getById(Long id) {
        return gymClassRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ders bulunamadi: " + id));
    }

    public List<GymClass> getByDay(DayOfWeek day) {
        return gymClassRepository.findByDayOfWeek(day);
    }

    public GymClass create(GymClass gymClass) {
        return gymClassRepository.save(gymClass);
    }

    public GymClass update(Long id, GymClass updated) {
        GymClass existing = getById(id);
        existing.setName(updated.getName());
        existing.setDayOfWeek(updated.getDayOfWeek());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setTrainer(updated.getTrainer());
        return gymClassRepository.save(existing);
    }

    public void delete(Long id) {
        gymClassRepository.delete(getById(id));
    }
}
