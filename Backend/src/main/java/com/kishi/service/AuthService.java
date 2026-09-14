package com.kishi.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kishi.dto.AuthRequest;
import com.kishi.dto.AuthResponse;
import com.kishi.entity.User;
import com.kishi.exception.EmailAlreadyExistsException;
import com.kishi.repository.UserRepository;
import com.kishi.security.JwtService;

@Service 
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService= jwtService;
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
        return new AuthResponse("User registered successfully", null);
    }

    public AuthResponse login(AuthRequest request) {

        org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = jwtService.generateToken(request.getEmail());

        return new AuthResponse("success", token);
    }

}