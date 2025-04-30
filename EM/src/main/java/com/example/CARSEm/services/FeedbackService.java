package com.example.CARSEm.services;

import com.example.CARSEm.model.Feedback;
import com.example.CARSEm.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository repository;

    Logger logger = Logger.getLogger(this.getClass().getName());

   public boolean existById(Feedback feedback){
       return repository.existsById(feedback.getFeedbackPK());
   }

   public Feedback createFeedback(Feedback feedback){
       return repository.save(feedback);
   }
}
