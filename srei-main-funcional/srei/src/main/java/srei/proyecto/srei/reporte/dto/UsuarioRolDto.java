package srei.proyecto.srei.reporte.dto;



public record UsuarioRolDto(
    Long getid,
    String getapellidos,
    String getnombres,
    String getrol,
    String getcarrera,
    String getcontrasenaHash,
    String getcorreo,
    String getcreadoEn,
    String getfacultad,
    Boolean gethabilitado

){}
