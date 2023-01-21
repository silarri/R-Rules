package com.example.CARSEm.services;

import com.example.CARSEm.model.Weather;
import com.example.CARSEm.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class WeatherService {
    @Autowired
    private WeatherRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public Weather createWeather(Weather newWeather){
       Weather response = repository.save(newWeather);
       return response;
   }

}
