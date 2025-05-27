package pe.edu.vallegrande.project.service.impl;

import pe.edu.vallegrande.project.model.Room;
import pe.edu.vallegrande.project.repository.HabitacionRepository;
import pe.edu.vallegrande.project.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class HabitacionServiceImpl implements HabitacionService {

    private final HabitacionRepository habitacionRepository;

    @Autowired
    public HabitacionServiceImpl(HabitacionRepository habitacionRepository) {
        this.habitacionRepository = habitacionRepository;
    }

    @Override
    public List<Room> findAll() {
        log.info("Listando todas las habitaciones.");
        return habitacionRepository.findAll();
    }

    @Override
    public List<Room> findByEstado(String estado) {
        log.info("Listando habitaciones con estado: {}", estado);
        return habitacionRepository.findByState(estado);
    }

    @Override
    public Optional<Room> findById(Long id) {
        log.info("Buscando habitación por ID: {}", id);
        return habitacionRepository.findById(id);
    }

    @Override
    public Room save(Room habitacion) {
        log.info("Registrando nueva habitación: {}", habitacion);
        return habitacionRepository.save(habitacion);
    }

    @Override
    public Room update(Room habitacion) {
        log.info("Actualizando habitación: {}", habitacion);
        return habitacionRepository.save(habitacion);
    }

    @Override
    public void delete(Long id) {
        log.info("Desactivando habitación con ID: {}", id);
        Optional<Room> habitacion = habitacionRepository.findById(id);
        habitacion.ifPresent(hab -> {
            hab.setState("I"); 
            habitacionRepository.save(hab);
        });
    }

    @Override
    public void restore(Long id) {
        log.info("Restaurando habitación con ID: {}", id);
        Optional<Room> habitacion = habitacionRepository.findById(id);
        habitacion.ifPresent(hab -> {
            hab.setState("A");
            habitacionRepository.save(hab);
        });
    }
}
