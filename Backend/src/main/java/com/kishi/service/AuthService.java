package com.kishi.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kishi.dto.AuthRequest;
import com.kishi.dto.AuthResponse;
import com.kishi.entity.User;
import com.kishi.exception.EmailAlreadyExistsException;
import com.kishi.repository.UserRepository;

@Service 
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthResponse register(AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already exists");
        }
        User user = new User();
        user.setEmail(email);
        user.setPasswordhash(passwordEncoder.encode(password));
        
        userRepository.save(user);
        return new AuthResponse("User registered successfully");
    }


}