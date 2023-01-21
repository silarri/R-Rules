package com.example.CARSEm.repository;


import com.example.CARSEm.model.Share;
import com.example.CARSEm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShareRepository extends JpaRepository<Share, Share.SharePK> {
    @Query(value = "SELECT * from Share s where s.iduser = :user", nativeQuery = true)
    List<Share> retrieveShareByUser(@Param("user") User user);
}
