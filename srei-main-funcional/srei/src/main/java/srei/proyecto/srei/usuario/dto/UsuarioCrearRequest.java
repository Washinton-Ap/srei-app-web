package srei.proyecto.srei.usuario.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import srei.proyecto.srei.usuario.RolNombre;

public record UsuarioCrearRequest(
        @NotBlank String nombres,
        @NotBlank String apellidos,
        @Email @NotBlank String correo,
        @NotBlank String contrasena,
        RolNombre rol,
        String facultad,
        String carrera
) {
}
