package com.kishi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kishi.dto.VaultRequest;
import com.kishi.dto.VaultResponse;
import com.kishi.entity.User;
import com.kishi.service.CurrentUserService;
import com.kishi.service.VaultService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vault")
public class VaultController {

    private final VaultService vaultService;
    private final CurrentUserService currentUserService;

    public VaultController(
            VaultService vaultService,
            CurrentUserService currentUserService) {

        this.vaultService = vaultService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<VaultResponse> createEntry(
            @Valid @RequestBody VaultRequest request,
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        VaultResponse response =
                vaultService.createEntry(request, user);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VaultResponse>> getAllEntries(
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        List<VaultResponse> response =
                vaultService.getAllEntries(user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<VaultResponse>> searchEntries(
            @RequestParam String title,
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        List<VaultResponse> response =
                vaultService.searchEntries(title, user);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaultResponse> getEntry(
            @PathVariable Long id,
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        VaultResponse response =
                vaultService.getEntry(id, user);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaultResponse> updateEntry(
            @PathVariable Long id,
            @Valid @RequestBody VaultRequest request,
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        VaultResponse response =
                vaultService.updateEntry(
                        id,
                        request,
                        user
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEntry(
            @PathVariable Long id,
            Authentication authentication) {

        User user =
                currentUserService.getCurrentUser(authentication);

        vaultService.deleteEntry(id, user);

        return ResponseEntity.ok(
                "Vault entry deleted successfully"
        );
    }
}