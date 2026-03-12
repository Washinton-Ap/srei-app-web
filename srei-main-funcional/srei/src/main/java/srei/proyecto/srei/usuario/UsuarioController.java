package srei.proyecto.srei.usuario;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import srei.proyecto.srei.usuario.dto.UsuarioCrearRequest;
import srei.proyecto.srei.usuario.dto.UsuarioDto;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDto>> listar() {
        return ResponseEntity.ok(usuarioService.listar());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> crear(@Valid @RequestBody UsuarioCrearRequest req) {
        return ResponseEntity.ok(usuarioService.crear(req));
    }

    @PatchMapping("/{id}/habilitado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> habilitar(@PathVariable Long id, @RequestParam boolean valor) {
        return ResponseEntity.ok(usuarioService.setHabilitado(id, valor));
    }

    @PostMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> asignarRol(@PathVariable Long id, @RequestParam RolNombre rol) {
        return ResponseEntity.ok(usuarioService.asignarRol(id, rol));
    }

    @PostMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDto> listarRoles(@PathVariable Long id, @RequestParam RolNombre rol) {
        return ResponseEntity.ok(usuarioService.asignarRol(id, rol));
    }
}
