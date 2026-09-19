package com.kishi;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExceptionHandlingTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void duplicateEmailShouldReturn409() throws Exception {

        String email =
                "duplicate-" + UUID.randomUUID() + "@example.com";

        String requestBody = """
                {
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(email);

        // First registration should succeed
        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isOk());

        // Second registration with the same email should fail
        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isConflict());
    }

    @Test
    void nonExistentVaultEntryShouldReturn404() throws Exception {

        String email =
                "exception-" + UUID.randomUUID() + "@example.com";

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

        String response = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody)
        )
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

        String token = extractToken(response);

        mockMvc.perform(
                get("/api/vault/999999999")
                        .header("Authorization", "Bearer " + token)
        )
        .andExpect(status().isNotFound());
    }

    @Test
    void invalidVaultRequestShouldReturn400() throws Exception {

        String email =
                "invalid-" + UUID.randomUUID() + "@example.com";

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

        String response = mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody)
        )
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

        String token = extractToken(response);

        String invalidVaultBody = """
                {
                    "title": "",
                    "username": "",
                    "encryptedPassword": "",
                    "website": "https://example.com"
                }
                """;

        mockMvc.perform(
                post("/api/vault")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidVaultBody)
        )
        .andExpect(status().isBadRequest());
    }

    private String extractToken(String response) {

        int tokenStart =
                response.indexOf("\"token\":\"") + 9;

        int tokenEnd =
                response.indexOf("\"", tokenStart);

        return response.substring(tokenStart, tokenEnd);
    }
}