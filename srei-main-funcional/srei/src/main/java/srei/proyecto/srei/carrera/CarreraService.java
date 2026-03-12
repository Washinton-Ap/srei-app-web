package srei.proyecto.srei.carrera;


import org.springframework.stereotype.Service;
import java.util.List;

import srei.proyecto.srei.carrera.Carrera;
import srei.proyecto.srei.carrera.CarreraRepository;

@Service
public class CarreraService {

    private final CarreraRepository carreraRepository;

    public CarreraService(CarreraRepository carreraRepository) {
        this.carreraRepository = carreraRepository;
    }

    public List<Carrera> listarPorFacultad(Long facultadId) {
        return carreraRepository.findByFacultadId(facultadId);
    }
}