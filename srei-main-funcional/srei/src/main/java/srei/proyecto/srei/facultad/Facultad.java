package srei.proyecto.srei.facultad;

import jakarta.persistence.*;

@Entity
@Table(name = "facultad")
public class Facultad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idfacultad;

    private String nombre;

    public Facultad() {}

    public Facultad(Long id, String nombre) {
        this.idfacultad = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return idfacultad;
    }

    public void setId(Long id) {
        this.idfacultad = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}