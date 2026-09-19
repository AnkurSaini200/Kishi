package com.kishi;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.kishi.entity.User;
import com.kishi.entity.VaultEntry;
import com.kishi.repository.UserRepository;
import com.kishi.repository.VaultEntryRepository;

@SpringBootTest
class RepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VaultEntryRepository vaultEntryRepository;

    @Test
    void userRepositoryShouldFindUserByEmail() {

        String email =
                "repository-" + UUID.randomUUID() + "@example.com";

        User user = new User();
        user.setEmail(email);
        user.setPasswordhash("hashed-password");

        userRepository.save(user);

        Optional<User> result =
                userRepository.findByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
    }

    @Test
    void userRepositoryShouldCheckEmailExistence() {

        String email =
                "exists-" + UUID.randomUUID() + "@example.com";

        User user = new User();
        user.setEmail(email);
        user.setPasswordhash("hashed-password");

        userRepository.save(user);

        assertTrue(
                userRepository.existsByEmail(email)
        );
    }

    @Test
    void vaultRepositoryShouldFindEntriesByUser() {

        User user = createUser();

        VaultEntry entry1 = createEntry(
                user,
                "GitHub"
        );

        VaultEntry entry2 = createEntry(
                user,
                "Google"
        );

        vaultEntryRepository.save(entry1);
        vaultEntryRepository.save(entry2);

        List<VaultEntry> entries =
                vaultEntryRepository.findAllByUser(user);

        assertEquals(2, entries.size());
    }

    @Test
    void vaultRepositoryShouldFindEntryByIdAndUser() {

        User user = createUser();

        VaultEntry entry =
                createEntry(user, "GitHub");

        VaultEntry savedEntry =
                vaultEntryRepository.save(entry);

        Optional<VaultEntry> result =
                vaultEntryRepository.findByIdAndUser(
                        savedEntry.getId(),
                        user
                );

        assertTrue(result.isPresent());
        assertEquals(
                savedEntry.getId(),
                result.get().getId()
        );
    }

    @Test
    void vaultRepositoryShouldNotReturnAnotherUsersEntry() {

        User userA = createUser();
        User userB = createUser();

        VaultEntry entry =
                createEntry(userA, "Private Entry");

        VaultEntry savedEntry =
                vaultEntryRepository.save(entry);

        Optional<VaultEntry> result =
                vaultEntryRepository.findByIdAndUser(
                        savedEntry.getId(),
                        userB
                );

        assertTrue(result.isEmpty());
    }

    @Test
    void vaultRepositoryShouldSearchEntriesByTitle() {

        User user = createUser();

        VaultEntry github =
                createEntry(user, "GitHub");

        VaultEntry google =
                createEntry(user, "Google");

        VaultEntry githubWork =
                createEntry(user, "GitHub Work");

        vaultEntryRepository.save(github);
        vaultEntryRepository.save(google);
        vaultEntryRepository.save(githubWork);

        List<VaultEntry> results =
                vaultEntryRepository
                        .findAllByUserAndTitleContainingIgnoreCase(
                                user,
                                "github"
                        );

        assertEquals(2, results.size());
    }

    private User createUser() {

        User user = new User();

        user.setEmail(
                "repo-" + UUID.randomUUID() + "@example.com"
        );

        user.setPasswordhash("hashed-password");

        return userRepository.save(user);
    }

    private VaultEntry createEntry(
            User user,
            String title) {

        VaultEntry entry = new VaultEntry();

        entry.setTitle(title);
        entry.setUsername("testuser");
        entry.setEncryptedPassword(
                "encrypted-password"
        );
        entry.setWebsite("https://example.com");
        entry.setUser(user);

        return entry;
    }
}