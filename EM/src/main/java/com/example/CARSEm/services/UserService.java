package com.example.CARSEm.services;

import com.example.CARSEm.model.User;
import com.example.CARSEm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.transaction.Transactional;
import java.util.List;
import java.util.logging.Logger;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository repository;


    Logger logger = Logger.getLogger(this.getClass().getName());

    public User createUser(User newUser){
        if(newUser != null){
            repository.save(newUser);
            return newUser;
        }else{
            return null;
        }
    }

    public User findUserById(int id){
        // Comprobamos si existe
        if(repository.existsById(id)){
            return repository.findById(id);
        }else{
            return null;
        }
    }

    public User findUserByEmail(String email){
        // Comprobamos si existe
        if(repository.existsByEmail(email)){
            return repository.findByEmail(email);
        }else{
            return null;
        }
    }

    public Boolean removeUserById(int id){
        if(repository.existsById(id)){
            repository.removeById(id);
            return true;
        }else{
            return false;
        }
    }

    public Boolean removeUserByEmail(String email){
        if(repository.existsByEmail(email)){
            repository.removeByEmail(email);
            return true;
        }else{
            return false;
        }
    }


    public List<User> getAllUsers(){
        return repository.findAll();
    }

    public List<User> deleteAllUsers(){
        List<User> response = repository.findAll();
        repository.deleteAll();
        return response;
    }

    public boolean isEmpty(){
        List<User> users = repository.findAll();
        return users.isEmpty();
    }


    public Boolean existById(int userId){
        return repository.existsById(userId);
    }

    public Boolean existByEmail(String email){
        return repository.findByEmail(email) != null;
    }
}
