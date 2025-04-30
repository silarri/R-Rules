package com.example.CARSEm.repository;

import com.example.CARSEm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);

    boolean existsByEmail(String email);

    Boolean existsById(int id);

    User findById(int id);
    
    Long removeByEmail(String email);

    Long removeById(int id);
}
