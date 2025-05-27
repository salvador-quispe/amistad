package pe.edu.vallegrande.project.repository;

import pe.edu.vallegrande.project.model.Employee;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByState(String state);
}