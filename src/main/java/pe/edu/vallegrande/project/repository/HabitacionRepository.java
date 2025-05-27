package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Room;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface HabitacionRepository extends JpaRepository<Room, Long> {
    List<Room> findByState(String state);
}

