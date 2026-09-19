package com.kishi;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class JwtAuthenticationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void requestWithoutTokenShouldReturn403() throws Exception {
    
        mockMvc.perform(
                get("/api/vault")
        )
        .andExpect(status().isForbidden());
    }

    @Test
    void requestWithInvalidTokenShouldReturn401() throws Exception {

        mockMvc.perform(
                get("/api/vault")
                        .header(
                                "Authorization",
                                "Bearer invalid-token"
                        )
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
    void requestWithValidTokenShouldReturn200() throws Exception {

        String email =
                "jwt-" + UUID.randomUUID() + "@example.com";

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

        String response =
                loginResult.getResponse().getContentAsString();

        String token = extractToken(response);

        mockMvc.perform(
                get("/api/vault")
                        .header(
                                "Authorization",
                                "Bearer " + token
                        )
        )
        .andExpect(status().isOk());
    }

    private String extractToken(String response) {

        int tokenStart =
                response.indexOf("\"token\":\"") + 9;

        int tokenEnd =
                response.indexOf("\"", tokenStart);

        return response.substring(tokenStart, tokenEnd);
    }
}