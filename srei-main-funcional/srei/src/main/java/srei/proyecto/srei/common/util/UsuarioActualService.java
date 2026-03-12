package srei.proyecto.srei.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.usuario.Usuario;
import srei.proyecto.srei.usuario.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class UsuarioActualService {

    private final UsuarioRepository usuarioRepository;

    public Usuario obtener() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalArgumentException("No autenticado");
        }

        Object principal = auth.getPrincipal();

        // En Spring Security, el principal suele ser UserDetails (o a veces String = username).
        String correo;
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            correo = ud.getUsername();
        } else if (principal instanceof String s) {
            correo = s;
        } else {
            correo = auth.getName(); // fallback seguro
        }

        return usuarioRepository.findByCorreoIgnoreCase(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }
}
