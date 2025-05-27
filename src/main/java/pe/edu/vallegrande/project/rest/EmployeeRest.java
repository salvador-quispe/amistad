package pe.edu.vallegrande.project.rest;

import pe.edu.vallegrande.project.model.Employee;
import pe.edu.vallegrande.project.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/employee")
public class EmployeeRest {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeRest(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> findAll() {
        return employeeService.findAll();
    }

    @GetMapping("/state/{state}")
    public List<Employee> findByState(@PathVariable String state) {
        return employeeService.findByState(state);
    }

    @GetMapping("/{id_employee}")
    public Optional<Employee> findById(@PathVariable Long id_employee) {
        return employeeService.findById(id_employee);
    }

    @PostMapping("/save")
    public Employee save(@RequestBody Employee employee) {
        return employeeService.save(employee);
    }

    @PutMapping("/update")
    public Employee update(@RequestBody Employee employee) {
        return employeeService.update(employee);
    }

    @DeleteMapping("/delete/{id_employee}")
    public void delete(@PathVariable Long id_employee) {
        employeeService.delete(id_employee);
    }

    @PutMapping("/restore/{id_employee}")
    public void restore(@PathVariable Long id_employee) {
        employeeService.restore(id_employee);
    }

}
