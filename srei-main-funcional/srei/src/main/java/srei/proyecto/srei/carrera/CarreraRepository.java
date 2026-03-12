package srei.proyecto.srei.carrera;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import srei.proyecto.srei.carrera.Carrera;

public interface CarreraRepository extends JpaRepository<Carrera, Long> {

    List<Carrera> findByFacultadId(Long facultadId);

}