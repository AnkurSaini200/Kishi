package com.kishi.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service 
public class JwtService{

    private final SecretKey secretKey = Keys.hmacShaKeyFor("KishiJWTSecretKey2026Secure32Byte!".getBytes());

    private final long expirationTime = 1000*60*60;

    public String generateToken(String email){

        return Jwts.builder()
        .subject(email)
        .issuedAt(new Date())
        .expiration(
            new Date(System.currentTimeMillis() + expirationTime)
        )
        .signWith(secretKey)
        .compact();
    }

    public String extractEmail(String token) {

    Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();

    return claims.getSubject();
}
    
}