package srei.proyecto.srei.evento;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path baseDir = Path.of("uploads");

    public String guardar(MultipartFile file, String prefijo) {
        if (file == null || file.isEmpty()) return null;

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
}
