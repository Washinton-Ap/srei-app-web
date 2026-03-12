package srei.proyecto.srei.facultad;



import org.springframework.stereotype.Service;
import java.util.List;

import srei.proyecto.srei.facultad.Facultad;
import srei.proyecto.srei.facultad.FacultadRepository;

@Service
public class FacultadService {

    private final FacultadRepository facultadRepository;

    public FacultadService(FacultadRepository facultadRepository) {
        this.facultadRepository = facultadRepository;
    }

    public List<Facultad> listar() {
        return facultadRepository.findAll();
    }
}