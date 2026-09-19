package com.kishi;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
class VaultValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @BeforeEach
    void setUp() throws Exception {
        token = createAndLoginUser();
    }

    @Test
    void emptyTitleShouldReturn400() throws Exception {

        String requestBody = """
                {
                    "title": "",
                    "username": "testuser",
                    "encryptedPassword": "encrypted-password",
                    "website": "https://example.com"
                }
                """;

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void emptyUsernameShouldReturn400() throws Exception {

        String requestBody = """
                {
                    "title": "GitHub",
                    "username": "",
                    "encryptedPassword": "encrypted-password",
                    "website": "https://github.com"
                }
                """;

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void emptyEncryptedPasswordShouldReturn400() throws Exception {

        String requestBody = """
                {
                    "title": "GitHub",
                    "username": "testuser",
                    "encryptedPassword": "",
                    "website": "https://github.com"
                }
                """;

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void titleOver200CharactersShouldReturn400() throws Exception {

        String longTitle = "a".repeat(201);

        String requestBody = """
                {
                    "title": "%s",
                    "username": "testuser",
                    "encryptedPassword": "encrypted-password",
                    "website": "https://example.com"
                }
                """.formatted(longTitle);

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void usernameOver200CharactersShouldReturn400() throws Exception {

        String longUsername = "a".repeat(201);

        String requestBody = """
                {
                    "title": "GitHub",
                    "username": "%s",
                    "encryptedPassword": "encrypted-password",
                    "website": "https://github.com"
                }
                """.formatted(longUsername);

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void websiteOver500CharactersShouldReturn400() throws Exception {

        String longWebsite = "a".repeat(501);

        String requestBody = """
                {
                    "title": "GitHub",
                    "username": "testuser",
                    "encryptedPassword": "encrypted-password",
                    "website": "%s"
                }
                """.formatted(longWebsite);

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    private String createAndLoginUser() throws Exception {

        String email =
                "validation-" + UUID.randomUUID() + "@example.com";

        String password = "password123";

        String registerBody = """
                {
                    "email": "%s",
                    "password": "%s"
                }
                """.formatted(email, password);

        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody)
        )
        .andExpect(status().isOk());

        String loginBody = """
                {
                    "email": "%s",
                    "password": "%s"
                }
                """.formatted(email, password);

        MvcResult loginResult = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody)
        )
        .andExpect(status().isOk())
        .andReturn();

        JsonNode response =
                objectMapper.readTree(
                        loginResult.getResponse().getContentAsString()
                );

        return response.get("token").asText();
    }
}