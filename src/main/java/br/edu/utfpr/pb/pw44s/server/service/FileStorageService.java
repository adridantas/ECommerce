package br.edu.utfpr.pb.pw44s.server.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public String saveOrderAttachment(MultipartFile file, Long orderId) {
        try {
            Path orderDir = root.resolve("orders/" + orderId);
            Files.createDirectories(orderDir);

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = orderDir.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toAbsolutePath().toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }
}
