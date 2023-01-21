package com.example.CARSEm.services;

import com.example.CARSEm.model.Location;
import com.example.CARSEm.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.logging.Logger;

@Service
public class LocationService {
    @Autowired
    private LocationRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public Location createLocation(Location newLocation){
       Location response = repository.save(newLocation);
       return response;
   }

}
