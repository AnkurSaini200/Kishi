package com.kishi.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.kishi.entity.User;
import com.kishi.exception.ResourceNotFoundException;
import com.kishi.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }
}