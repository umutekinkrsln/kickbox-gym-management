package com.kickboksapp.controller;

import com.kickboksapp.entity.GymClass;
import com.kickboksapp.service.GymClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class GymClassController {

    private final GymClassService gymClassService;

    @GetMapping
    public List<GymClass> getAll() {
        return gymClassService.getAll();
    }

    @GetMapping("/{id}")
    public GymClass getById(@PathVariable Long id) {
        return gymClassService.getById(id);
    }

    @GetMapping("/day/{day}")
    public List<GymClass> getByDay(@PathVariable DayOfWeek day) {
        return gymClassService.getByDay(day);
    }

    @PostMapping
    public ResponseEntity<GymClass> create(@RequestBody GymClass gymClass) {
        return ResponseEntity.ok(gymClassService.create(gymClass));
    }

    @PutMapping("/{id}")
    public GymClass update(@PathVariable Long id, @RequestBody GymClass gymClass) {
        return gymClassService.update(id, gymClass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        gymClassService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
