package com.example.CARSEm.controllers;

import com.example.CARSEm.services.AuthorizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
public class PingController {

    @Autowired
    private AuthorizationService authorizationService;

    Logger logger = Logger.getLogger(this.getClass().getName());

    @Operation(summary = "Comprueba si el EM está disponible. Si no lo está, la petición no se completará con éxito")
    @ApiResponse(
            responseCode = "200",
            description = "El EM está disponible")
    @GetMapping("/ping")
    public ResponseEntity<?> ping (HttpServletRequest request) {
        logger.log(Level.WARNING,"/ping");
        String token = request.getHeader("Authorization");
        if(authorizationService.tokenFormatIsValid(token) && authorizationService.tokenIsValid(token)){

            return new ResponseEntity<>("ping ok", HttpStatus.OK);
        }else{
            JSONObject response = new JSONObject();
            response.put("error", "Invalid token");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
    }

}
