package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.model.Room;
import pe.edu.vallegrande.project.service.HabitacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/room")
public class HabitacionRest {

    private final HabitacionService habitacionService;

    @Autowired
    public HabitacionRest(HabitacionService habitacionService) {
        this.habitacionService = habitacionService;
    }

    @GetMapping
    public List<Room> findAll() {
        return habitacionService.findAll();
    }

     @GetMapping("/estado/{state}")
    public List<Room> findByState(@PathVariable String state) {
    return habitacionService.findByEstado(state); 
     }


    @GetMapping("/{id}")
    public Optional<Room> findById(@PathVariable Long id) {
        return habitacionService.findById(id);
    }

    @PostMapping("/save")
    public Room save(@RequestBody Room habitacion) {
        return habitacionService.save(habitacion);
    }

    @PutMapping("/update")
    public Room update(@RequestBody Room habitacion) {
        return habitacionService.update(habitacion);
    }

    @PutMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        habitacionService.delete(id);
    }

    @PutMapping("/restore/{id}")
    public void restore(@PathVariable Long id) {
        habitacionService.restore(id);
    }
}