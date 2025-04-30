package com.example.CARSEm.services;

import com.example.CARSEm.model.Event;
import com.example.CARSEm.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EventService {
    @Autowired
    private EventRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public Event createEvent(Event newEvent){
       Event response = repository.save(newEvent);
       return response;
   }

}
