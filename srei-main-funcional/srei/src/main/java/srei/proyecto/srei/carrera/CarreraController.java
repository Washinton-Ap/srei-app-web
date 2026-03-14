package srei.proyecto.srei.carrera;


import org.springframework.web.bind.annotation.*;
import java.util.List;

import srei.proyecto.srei.carrera.Carrera;
import srei.proyecto.srei.carrera.CarreraService;

@RestController
@RequestMapping("/api/carreras")
@CrossOrigin
public class CarreraController {

    private final CarreraService carreraService;

    public CarreraController(CarreraService carreraService) {
        this.carreraService = carreraService;
    }

    @GetMapping("/{facultadId}")
    public List<Carrera> listar(@PathVariable Long facultadId) {
        return carreraService.listarPorFacultad(facultadId);
    }
}