package com.kishi.service;

import org.springframework.stereotype.Service;

import com.kishi.repository.UserRepository;

@Service 
public class UserService{

    
    private final UserRepository userRepository;

    
    public UserService(UserRepository userRepository) {

        this.userRepository = userRepository;
    
    }

}