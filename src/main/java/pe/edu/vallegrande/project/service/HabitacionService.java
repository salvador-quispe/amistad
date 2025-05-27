package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.model.Room;
import java.util.List;
import java.util.Optional;

public interface HabitacionService {

    List<Room> findAll();
    
    List<Room> findByEstado(String estado);
    
    Optional<Room> findById(Long id);

    Room save(Room habitacion);

    Room update(Room habitacion);
    
    void delete(Long id);

    void restore(Long id);
}