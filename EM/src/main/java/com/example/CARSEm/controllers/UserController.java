package com.example.CARSEm.controllers;

import com.example.CARSEm.model.User;
import com.example.CARSEm.requests.LoginRequest;
import com.example.CARSEm.services.AuthorizationService;
import com.example.CARSEm.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    AuthorizationService authorizationService;

    // Encode password hash
    @Autowired
    BCryptPasswordEncoder bCryptPasswordEncoder;

    Logger logger = Logger.getLogger(this.getClass().getName());


    // ADDED: no estaba en la propuesta original
    @Operation(summary = "Registra un usuario nuevo en el EM")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "No puede crear al usuario porque ya existe. Devuelve false",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "201",
                    description = "Registra el nuevo usuario",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @PostMapping(value = "/register",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> register(@RequestBody User body){
        logger.log(Level.WARNING,"/users/register");
        JSONObject response = new JSONObject();

        String email = body.getEmail();

        if(!userService.existByEmail(email)){
            String password = body.getPassword();
            String genre = body.getGenre();
            LocalDate birth = body.getBirth();

            User u = new User(email,password,genre,birth);
            u.setPassword(bCryptPasswordEncoder.encode(u.getPassword()));
            u = userService.createUser(u);

            response.put("result",u);
            return new ResponseEntity<>(response,HttpStatus.CREATED);
        }else{
            response.put("result","Ya existe un usuario con ese email");
            return new ResponseEntity<>(response,HttpStatus.OK);
        }
    }

    @Operation(summary = "Elimina los datos de un usuario")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "404",
                    description = "No puede eliminar la cuenta de un usuario porque no existe",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "200",
                    description = "Se ha eliminado el usuario correctamente",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @PostMapping(value = "/deleteAccount",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteAccount(HttpServletRequest request){
        logger.log(Level.WARNING,"/users/deleteAccount");
        JSONObject response = new JSONObject();

        String token = request.getHeader("Authorization");

        if(authorizationService.tokenFormatIsValid(token) && authorizationService.tokenIsValid(token)){
            String email = authorizationService.getEmail(token);
            userService.removeUserByEmail(email);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("error", "Invalid token");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "Inicio de sesión de un usuario")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "El inicio de sesión ha sido correcto",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No existe un usuario con ese email",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "401",
                    description = "Login fallido. Usuario o contraseña incorrectos",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @PostMapping(value = "/login",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest body){
        logger.log(Level.WARNING,"/users/login");
        JSONObject response = new JSONObject();

        String email = body.getEmail();

        if(userService.existByEmail(email)){
            // Check if passwords coincide
            String password = body.getPassword();
            User u = userService.findUserByEmail(email);
            String encodedPassword = u.getPassword();
            if(BCrypt.checkpw(password, encodedPassword)){
                String token = email + ":" + password;
                token = Base64.getEncoder().encodeToString(token.getBytes());
                logger.log(Level.WARNING, "Token: " + token);
                HttpHeaders headers = new HttpHeaders();
                headers.add("Authorization", token);

                response.put("user", u);

                return new ResponseEntity<>(response,headers,HttpStatus.OK);
            }else{
                response.put("error", "Username and/or password are incorrect");
                return new ResponseEntity<>(response,HttpStatus.UNAUTHORIZED);
            }
        }else{
            response.put("error", "There is no user registered with this email address");
            return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Cierre de sesión de un usuario")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Se ha cerrado sesión correctamente",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "403",
                    description = "El token es inválido",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @PostMapping(value = "/logout",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(HttpServletRequest request){
        logger.log(Level.WARNING,"/users/logout");

        String token = request.getHeader("Authorization");

        if(authorizationService.tokenFormatIsValid(token) && authorizationService.tokenIsValid(token)){
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            JSONObject response = new JSONObject();
            response.put("error", "Invalid token");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Operation(summary = "Devuelve la información asociada a un usuario con el identificador especificado")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve el usuario especificado",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "El usuario especificado no existe",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "403",
                    description = "El usuario especificado no coincide con el token y no tiene acceso a los datos",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @GetMapping(value = "/retrieve/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> retrieveID(HttpServletRequest request, @PathVariable int id){
        logger.log(Level.WARNING,"/users/retrieve/" + id);

        String token = request.getHeader("Authorization");

        User response = userService.findUserById(id);
        // Si encuentra el usuario -> 200
        if(response != null && authorizationService.tokenFormatIsValid(token) &&
                authorizationService.tokenIsValid(token)){
            if(authorizationService.userHasAccess(token, response)){
                return new ResponseEntity<>(response, HttpStatus.OK);
            }else{
                JSONObject error = new JSONObject();
                error.put("error","No tienes acceso a esos datos");
                return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
            }
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No existe ningun usuario con ese identificador");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

    }

    @Operation(summary = "Devuelve una lista con la información asociada a los usuarios almacenados en la base de datos")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve una lista con todos los usuarios",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No hay usuarios registrados",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping(value = "/retrieve/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> retrieveAll(){
        logger.log(Level.WARNING,"/users/retrieve/all");
        if(!userService.isEmpty()){
            List<User> response = userService.getAllUsers();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ningun usuario registrado");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

    }



    @Operation(summary = "Elimina la información asociada al usuario con el identificador indicado. " +
            "Devuelve true si elimina al usuario indicado. En caso contrario, false")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve true porque el usuario se ha eliminado",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "El usuario especificado no existe y no se puede eliminar, devuelve false",
                    content = @Content(mediaType = "application/json")),
    }
    )
    @PostMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> DeleteID(@PathVariable int id){
        logger.log(Level.WARNING,"/users/delete/" + id);

        Boolean response = userService.removeUserById(id);
        // Si existe devuelve 200, si no un 404
        if(response){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ningun usuario registrado con ese id");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }


    @Operation(summary = "Elimina la información asociada a los usuarios almacenados en la base " +
            "de datos y devuelve una lista con los usuarios eliminados")
    @ApiResponses(value = {
            @ApiResponse(
                responseCode = "200",
                description = "Devuelve una lista con todos los usuarios que ha eliminado,",
                content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "No hay usuarios registrados",
                    content = @Content(mediaType = "application/json")
            )})
    @PostMapping(value = "/delete/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> DeleteAll(){
        logger.log(Level.WARNING,"/users/delete/all");
        if(!userService.isEmpty()){
            List<User> response = userService.deleteAllUsers();
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ningun usuario registrado");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }
}
