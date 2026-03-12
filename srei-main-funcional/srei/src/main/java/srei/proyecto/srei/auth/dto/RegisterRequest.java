package srei.proyecto.srei.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @Email @NotBlank String correo,
        @NotBlank String contrasena
) {
}
