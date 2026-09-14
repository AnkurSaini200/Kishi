package com.kishi.dto;

public class VaultResponse {

    private Long id;
    private String title;
    private String username;
    private String encryptedPassword;
    private String website;

    public VaultResponse(
            Long id,
            String title,
            String username,
            String encryptedPassword,
            String website) {

        this.id = id;
        this.title = title;
        this.username = username;
        this.encryptedPassword = encryptedPassword;
        this.website = website;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getUsername() {
        return username;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public String getWebsite() {
        return website;
    }
}