package com.kishi;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registerWithValidDataShouldReturn200() throws Exception {

        String email =
                "test-" + UUID.randomUUID() + "@example.com";

        String requestBody = """
                {
                    "email": "%s",
                    "password": "password123"
                }
                """.formatted(email);

        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isOk());
    }

    @Test
    void loginWithValidCredentialsShouldReturn200() throws Exception {

        String email =
                "test-" + UUID.randomUUID() + "@example.com";

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

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody)
        )
        .andExpect(status().isOk());
    }

    @Test
    void registerWithInvalidEmailShouldReturn400() throws Exception {

        String requestBody = """
                {
                    "email": "not-an-email",
                    "password": "password123"
                }
                """;

        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }

    @Test
    void registerWithShortPasswordShouldReturn400() throws Exception {

        String requestBody = """
                {
                    "email": "short-password@example.com",
                    "password": "123"
                }
                """;

        mockMvc.perform(
                post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        )
        .andExpect(status().isBadRequest());
    }
}