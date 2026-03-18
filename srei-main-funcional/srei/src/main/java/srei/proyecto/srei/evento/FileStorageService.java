package srei.proyecto.srei.evento;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import org.springframework.util.MultiValueMap;
import org.springframework.util.LinkedMultiValueMap;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path baseDir = Path.of("uploads");

    public String guardar(MultipartFile file, String prefijo) {
        if (file == null || file.isEmpty())
            return null;

        try {
            Files.createDirectories(baseDir);
            String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String nombre = prefijo + "_" + UUID.randomUUID() + (ext == null ? "" : "." + ext);
            Path destino = baseDir.resolve(nombre);
            Files.write(destino, file.getBytes());
            return destino.toString().replace('\\', '/');
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo guardar archivo");
        }
    }

    public String subirArchivo(MultipartFile file, String prefijo) throws IOException {

        String url = "https://www.lexusinformatics.com/Sistema_Eventos/subir_archivo.php";

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("prefijo", prefijo);
        body.add("archivo", new MultipartInputStreamFileResource(file.getInputStream(), file.getOriginalFilename()));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

        return (String) response.getBody().get("ruta");
    }

}
