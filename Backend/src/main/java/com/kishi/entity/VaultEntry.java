package com.kishi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity 
public class VaultEntry{

    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    
    @JoinColumn (nullable = false)
    private String title;

    @JoinColumn (nullable = false)
    private String username;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String encryptedPassword;

    private String website;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}