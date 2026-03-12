package srei.proyecto.srei.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import srei.proyecto.srei.auth.dto.LoginRequest;
import srei.proyecto.srei.auth.dto.LoginResponse;
import srei.proyecto.srei.auth.dto.RegisterRequest;
import srei.proyecto.srei.security.JwtService;
import srei.proyecto.srei.usuario.*;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.correo(), request.contrasena()));

        Usuario u = usuarioRepository.findByCorreoIgnoreCase(request.correo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        List<String> roles = u.getRoles().stream().map(r -> r.getNombre().name()).toList();
        String token = jwtService.generarToken(u.getCorreo(), roles);

        return new LoginResponse(token, u.getCorreo(), u.getNombres(), u.getApellidos(), roles);
    }

    public LoginResponse registerAsistente(RegisterRequest request) {
        if (usuarioRepository.existsByCorreoIgnoreCase(request.correo())) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }

        Rol rolAsistente = rolRepository.findByNombre(RolNombre.ASISTENTE)
                .orElseThrow(() -> new IllegalArgumentException("Rol ASISTENTE no existe"));

        Usuario u = Usuario.builder()
                .nombres(request.nombres())
                .apellidos(request.apellidos())
                .correo(request.correo())
                .contrasenaHash(encoder.encode(request.contrasena()))
                .habilitado(true)
                .roles(Set.of(rolAsistente))
                .build();

        usuarioRepository.save(u);

        List<String> roles = u.getRoles().stream().map(r -> r.getNombre().name()).toList();
        String token = jwtService.generarToken(u.getCorreo(), roles);
        return new LoginResponse(token, u.getCorreo(), u.getNombres(), u.getApellidos(), roles);
    }
}
