package srei.proyecto.srei.ia;

import org.hibernate.result.Output;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;

@Service
public class IaService {


    private final WebClient webClient;

    public IaService(@Value("${openai.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024) // 10MB
                )
                .build();
    }

   public String generarImagen(String prompt) {

    Map<String, Object> request = Map.of(
            "model", "gpt-image-1",
            "prompt", prompt,
            "size", "1024x1024"
    );

    OpenAIResponse response = webClient.post()
            .uri("/images/generations")
            .bodyValue(request)
            .retrieve()
            .onStatus(status -> status.isError(), res ->
                    res.bodyToMono(String.class)
                            .map(body -> new RuntimeException("Error OpenAI: " + body))
            )
            .bodyToMono(OpenAIResponse.class)
            .block();

    if (response == null || response.data == null || response.data.isEmpty()) {
        throw new RuntimeException("No se pudo generar la imagen");
    }

    ImageData img = response.data.get(0);

    if (img.b64_json != null) {
        return "data:image/png;base64," + img.b64_json;
    } else {
        throw new RuntimeException("No se pudo obtener la imagen");
    }
}}