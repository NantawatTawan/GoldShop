package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.Employee;
import com.maneelak.stockpawn.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ไม่พบพนักงานที่มี id = " + id));
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Integer id, Employee updated) {
        Employee emp = getEmployeeById(id);

        emp.setFullName(updated.getFullName());
        emp.setPhone(updated.getPhone());
        emp.setPosition(updated.getPosition());
        emp.setStartDate(updated.getStartDate());
        emp.setSalary(updated.getSalary());
        emp.setIsActive(updated.getIsActive());

        return employeeRepository.save(emp);
    }

    public void deleteEmployee(Integer id) {
        Employee emp = getEmployeeById(id);
        emp.setIsActive(false); 
        employeeRepository.save(emp);
    }
}
