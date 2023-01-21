package com.example.CARSEm.services;

import com.example.CARSEm.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class AuthorizationService {
    @Autowired
    private UserService userService;


    Logger logger = Logger.getLogger(this.getClass().getName());

    public Boolean tokenFormatIsValid(String token){

        logger.log(Level.WARNING, "TOKENFORMATISVALID");
        logger.log(Level.WARNING, token);
        if(token == null || !token.startsWith("Basic ")){
            logger.log(Level.WARNING, "TOKENFORMATISVALID false");
            return false;
        }else {
            logger.log(Level.WARNING, "TOKENFORMATISVALID true");
            return true;
        }
    }

    public Boolean tokenIsValid(String token){
        token = token.replace("Basic ", "");
        // Decode token
        byte[] decodedBytes = Base64.getDecoder().decode(token);
        String decodedString = new String(decodedBytes);
        // Get email and password hash
        String email = decodedString.split(":")[0];
        String password = decodedString.split(":")[1];

        // Check if token is valid
        User u = userService.findUserByEmail(email);

        /* silarri, 15/12/2022 */
        if(u != null && password.equals(u.getPassword())){
        //if(u != null && BCrypt.checkpw(password, u.getPassword())){
            logger.log(Level.WARNING, "TOKENISVALID TRUE");
            return true;
        }else{
            logger.log(Level.WARNING, "TOKENISVALID FALSE");
            return false;
        }

    }

    public String getEmail(String token){
        token = token.replace("Basic ", "");
        // Decode token
        byte[] decodedBytes = Base64.getDecoder().decode(token);
        String decodedString = new String(decodedBytes);
        // Get email and password hash
        String email = decodedString.split(":")[0];

        return email;
    }

    public Boolean userHasAccess(String token, User user){
        logger.log(Level.WARNING, user.getEmail());
        logger.log(Level.WARNING, getEmail(token));
        if(getEmail(token).equals(user.getEmail())){
            return true;
        }else{
            return false;
        }
    }
}
