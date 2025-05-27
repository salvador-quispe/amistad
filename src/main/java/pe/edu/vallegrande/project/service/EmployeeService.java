package pe.edu.vallegrande.project.service;

import pe.edu.vallegrande.project.model.Employee;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {

    List<Employee> findAll();
    
    List<Employee> findByState(String state);
    
    Optional<Employee> findById(Long id_employee);

    Employee save(Employee employee);

    Employee update(Employee employee);
    
    void delete(Long id_employee);

    void restore(Long id_employee);

}