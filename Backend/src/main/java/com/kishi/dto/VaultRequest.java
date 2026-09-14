package com.kishi.dto;

import jakarta.validation.constraints.NotBlank;

public class VaultRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Encrypted password is required")
    private String encryptedPassword;

    private String website;

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
}