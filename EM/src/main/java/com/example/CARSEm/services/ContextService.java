package com.example.CARSEm.services;

import com.example.CARSEm.model.Context;
import com.example.CARSEm.model.Event;
import com.example.CARSEm.model.Location;
import com.example.CARSEm.model.Weather;
import com.example.CARSEm.repository.ContextRepository;
import com.example.CARSEm.repository.EventRepository;
import com.example.CARSEm.repository.LocationRepository;
import com.example.CARSEm.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class ContextService {
    @Autowired
    private ContextRepository repository;

    @Autowired
    private EventService eventService;

    @Autowired
    private LocationService locationService;

    @Autowired
    private WeatherService weatherService;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public Context createContext(Context newContext){
       logger.log(Level.WARNING,newContext.toString());
       Context response = repository.save(newContext);
       return response;
   }

   public boolean existById(int idcontext){
       return repository.existsById(idcontext);
   }

    public void storeContext(Context context){
        Location location = context.getLocation();
        Weather weather = context.getWeather();
        List<Event> events = context.getEvents();
        LocalDateTime timestamp = context.getTimestamp();

        Context c = new Context();
        c.setTimestamp(timestamp);

        repository.save(c);

        location.setContext(c);
        locationService.createLocation(location);

        weather.setContext(c);
        weatherService.createWeather(weather);
        for(Event e : events){
            e.setContext(c);
            eventService.createEvent(e);
        }
    }

    public Context storeContext(List<Event> events, Location location, Weather weather, LocalDateTime timestamp){

        Context c = new Context();
        c.setTimestamp(timestamp);

        repository.save(c);

        location.setContext(c);
        locationService.createLocation(location);

        weather.setContext(c);
        weatherService.createWeather(weather);
        for(Event e : events){
            e.setContext(c);
            eventService.createEvent(e);
        }

        return c;
    }
}
