package com.kickboksapp.service;

import com.kickboksapp.entity.User;
import com.kickboksapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Kullanici bulunamadi: " + id));
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }
}
