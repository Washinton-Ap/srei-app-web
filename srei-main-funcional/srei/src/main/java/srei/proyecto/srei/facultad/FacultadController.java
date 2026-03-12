package srei.proyecto.srei.facultad;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import srei.proyecto.srei.facultad.Facultad;
import srei.proyecto.srei.facultad.FacultadService;

@RestController
@RequestMapping("/api/facultades")
@CrossOrigin
public class FacultadController {

    private final FacultadService facultadService;

    public FacultadController(FacultadService facultadService) {
        this.facultadService = facultadService;
    }

    @GetMapping
    public List<Facultad> listar() {
        return facultadService.listar();
    }
}
