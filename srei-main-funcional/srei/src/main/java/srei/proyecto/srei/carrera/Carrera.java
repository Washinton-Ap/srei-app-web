package srei.proyecto.srei.carrera;


import jakarta.persistence.*;
import srei.proyecto.srei.facultad.Facultad;

@Entity
@Table(name = "carrera")
public class Carrera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idcarrera;

    private String nombre;

    @ManyToOne
    @JoinColumn(name = "idfacultad")
    private Facultad facultad;

    public Carrera() {}

    public Long getId() {
        return idcarrera;
    }

    public String getNombre() {
        return nombre;
    }

    public Facultad getFacultad() {
        return facultad;
    }

    public void setId(Long id) {
        this.idcarrera = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setFacultad(Facultad facultad) {
        this.facultad = facultad;
    }
}