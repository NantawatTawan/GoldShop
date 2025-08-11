package com.maneelak.stockpawn.service;

import com.maneelak.stockpawn.entity.Customer;
import com.maneelak.stockpawn.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Integer id, Customer customerData) {
        return customerRepository.findById(id).map(customer -> {
            customer.setName(customerData.getName());
            customer.setPhone(customerData.getPhone());
            customer.setAddress(customerData.getAddress());
            customer.setIdCardData(customerData.getIdCardData());
            return customerRepository.save(customer);
        }).orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }

    public List<Customer> searchByName(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Customer> searchByPhone(String phone) {
        return customerRepository.findByPhone(phone);
    }
}