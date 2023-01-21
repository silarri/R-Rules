package com.example.CARSEm.repository;

import com.example.CARSEm.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, String> {
    @Query(value = "SELECT * from Activity a where a.ending >= :actualDate", nativeQuery = true)
    List<Activity> retrieveActive(@Param("actualDate") LocalDateTime actualDate);

    @Query(value = "SELECT * from Activity a where lower(a.category) = :cat", nativeQuery = true)
    List<Activity> retrieveByCat(@Param("cat") String cat);
}
