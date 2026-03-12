package srei.proyecto.srei.auth.dto;

import java.util.List;

public record LoginResponse(
        String token,
        String correo,
        String nombres,
        String apellidos,
        List<String> roles
) {
}
