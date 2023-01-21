package com.example.CARSEm.services;

import com.example.CARSEm.model.Activity;
import com.example.CARSEm.model.Share;
import com.example.CARSEm.model.User;
import com.example.CARSEm.repository.ShareRepository;
import com.example.CARSEm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class ShareService {

    @Autowired
    private ShareRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

    public Share createShare(Share s){
        Share newShare = repository.save(s);
        return newShare;
    }

    public List<Share> createShareAll(List<Share> shareList){
        List<Share> newShare = repository.saveAll(shareList);
        return  newShare;
    }

    public List<Activity> getActivitiesFromUser(User user){
        List<Share> shares = repository.retrieveShareByUser(user);
        List<Activity> activities = new ArrayList<>();
        for(Share s: shares){
            activities.add(s.getIdactivity());
        }
        return activities;
    }

    public List<Activity> getActivitiesFromUserByCat(User user, String cat){
        List<Share> shares = repository.retrieveShareByUser(user);
        List<Activity> activities = new ArrayList<>();
        for(Share s: shares){
            Activity aux = s.getIdactivity();

            // ToLowerCase for comparation
            String c = aux.getType().toLowerCase();
            if(c.equals(cat)){
                activities.add(s.getIdactivity());
            }
        }
        return activities;
    }
}
