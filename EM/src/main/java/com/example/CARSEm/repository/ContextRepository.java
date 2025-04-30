package com.example.CARSEm.repository;


import com.example.CARSEm.model.Context;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ContextRepository extends JpaRepository<Context, Integer> {

}
