package com.example.CARSEm.services;

import com.example.CARSEm.model.Activity;

import com.example.CARSEm.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class ActivityService {
    @Autowired
    private ActivityRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public Activity createActivity(Activity newActivity){
       Activity response = repository.save(newActivity);
       return response;
   }

   public List<Activity> createActivities(List<Activity> newActivities){
       List<Activity> response = repository.saveAll(newActivities);

       return response;
   }

   public Boolean existById(String idActivity){
       return repository.existsById(idActivity);
   }

   public void deleteById(String idActivity){ repository.deleteById(idActivity);}

   public void deleteAll(){ repository.deleteAll();}

   public boolean isEmpty(){
       List<Activity> activities = repository.findAll();
       return activities.isEmpty();
   }

   public Activity findById(String idActivity){
       return repository.findById(idActivity).get();
   }

   public List<Activity> retrieveActivate(){
       LocalDateTime date = LocalDateTime.now();
       logger.log(Level.WARNING,date.toString());
       return repository.retrieveActive(date);
   }

  

   public List<Activity> getAll(){
       return repository.findAll();
   }

   public List<Activity> getDiferent(List<Activity> activities){
       List<Activity> allActivities = repository.findAll();
       allActivities.removeAll(activities);
       return allActivities;
   }

   public List<Activity> getDiferentByCat(List<Activity> activities, String cat){
    List<Activity> allActivities = repository.retrieveByCat(cat);
    allActivities.removeAll(activities);
    return allActivities;
}
}
