package srei.proyecto.srei.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Email @NotBlank String correo,
        @NotBlank String contrasena
) {
}
