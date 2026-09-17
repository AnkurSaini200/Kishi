package com.kishi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kishi.entity.User;
import com.kishi.entity.VaultEntry;

public interface VaultEntryRepository extends JpaRepository<VaultEntry, Long> {
    
    List<VaultEntry> findAllByUser(User user);

    VaultEntry findByIdAndUser(Long id, User user);

    List<VaultEntry> findAllByUserAndTitleContainingIgnoreCase(
        User user,
        String title);

}