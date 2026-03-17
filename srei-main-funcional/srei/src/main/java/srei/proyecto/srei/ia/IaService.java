package srei.proyecto.srei.ia;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Map;

@Service
public class IaService {

    private final WebClient webClient;

    public IaService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "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")
                .build();
    }

    public String generarImagen(String prompt) {

        Map<String, Object> request = Map.of(
                "model", "gpt-image-1",
                "prompt", prompt,
                "size", "1024x1024"
        );

        Map response = webClient.post()
                .uri("/images/generations")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        var data = (java.util.List<Map>) response.get("data");

        return (String) data.get(0).get("url");
    }
}