# SREI - Sistema de Registro de Eventos Interculturales (UTEQ)

Stack: **Angular 21 + Spring Boot 3 (Java 17) + PostgreSQL**.

## 1) Requisitos
- Node.js (recomendado 20+)
- Angular CLI (se instala con `npm install` del proyecto)
- Java JDK 17
- PostgreSQL

## 2) Base de datos
Crea una base de datos vacía (nombre por defecto):

```sql
CREATE DATABASE bdsreiwdaux;
```

Credenciales por defecto en `srei/src/main/resources/application.properties`:
- usuario: `postgres`
- contraseña: `123456`
- puerto: `5432`

> Si tu Postgres es distinto, cambia esas 3 líneas.

## 3) Ejecutar Backend (Spring Boot)
Abre una terminal en la carpeta `srei/`:

### En Windows (PowerShell)
```powershell
cd srei
mvnw.cmd spring-boot:run
```

### En Linux/Mac/Git Bash
```bash
cd srei
chmod +x mvnw
./mvnw spring-boot:run
```

Backend: `http://localhost:8080`

## 4) Ejecutar Frontend (Angular)
Abre otra terminal en `frontend/`:

```bash
cd frontend
npm install
npm start
```

Frontend: `http://localhost:4200`

## 5) Usuarios demo (clave: Admin123*)
- `admin@uteq.edu.ec` (ADMIN)
- `decano@uteq.edu.ec` (DECANO)
- `coordinador@uteq.edu.ec` (COORDINADOR)
- `docente@uteq.edu.ec` (DOCENTE)
- `asistente@gmail.com` (ASISTENTE)

## 6) Funcionalidades implementadas
- Login/Registro (ASISTENTE)
- ADMIN: crear usuarios, habilitar/deshabilitar
- DOCENTE: proponer evento (sube imagen + PDF)
- DECANO: aprobar/rechazar eventos de FACULTAD
- COORDINADOR: aprobar/rechazar eventos de CARRERA
- Comentarios + censura (ADMIN)
- Asistencia con QR (ASISTENTE)
- Trivia + ranking por evento
- Reportes (DECANO/COORDINADOR): participantes e impacto

## 7) Plantilla PDF
La plantilla se descarga desde:
`http://localhost:8080/api/eventos/plantilla-informe`
