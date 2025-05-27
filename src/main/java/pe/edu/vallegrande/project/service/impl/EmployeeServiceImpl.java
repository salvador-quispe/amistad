package pe.edu.vallegrande.project.service.impl;

import pe.edu.vallegrande.project.model.Employee;
import pe.edu.vallegrande.project.repository.EmployeeRepository;
import pe.edu.vallegrande.project.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public List<Employee> findAll() {
        log.info("Listando Datos: ");
        return employeeRepository.findAll();
    }

    @Override
    public List<Employee> findByState(String state) {
        log.info("Listando Datos: ");
        return employeeRepository.findByState(state);
    }

    @Override
    public Optional<Employee> findById(Long id) {
        log.info("Listando Datos por ID: ");
        return employeeRepository.findById(id);
    }

    @Override
    public Employee save(Employee employee) {
        log.info("Registrondo Datos: " + employee.toString());
        return employeeRepository.save(employee);
    }

    @Override
    public Employee update(Employee employee) {
        log.info("Editando Datos: " + employee.toString());
        return employeeRepository.save(employee);
    }

    @Override
    public void delete(Long id) {
        log.info("Listando Datos por ID: ");
        Optional<Employee> employee= employeeRepository.findById(id);
        employee.ifPresent(
            em->{em.setState("I");
            employeeRepository.save(em);}
        );
    }

    @Override
    public void restore(Long id_employee) {
        log.info("Listando Datos por ID: ");
        Optional<Employee> empleado= employeeRepository.findById(id_employee);
        empleado.ifPresent(
            em->{em.setState("A");
            employeeRepository.save(em);}
        );
    }

}