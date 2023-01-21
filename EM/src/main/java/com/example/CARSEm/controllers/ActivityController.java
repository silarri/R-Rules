package com.example.CARSEm.controllers;

import com.example.CARSEm.model.Activity;
import com.example.CARSEm.requests.ActivitiesRequest;
import com.example.CARSEm.services.ActivityService;
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



import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    @Autowired
    ActivityService activityService;

    Logger logger = Logger.getLogger(this.getClass().getName());


    @Operation(summary = "Devuelve el objeto actividad asociado al identificador especificado")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve la actividad correspondiente al id proporcionado",
                    content = @Content(mediaType = "application/json")
            ),@ApiResponse(
                    responseCode = "404",
                    description = "No existe ninguna actividad con ese id",
                    content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping(value = "/retrieve/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>  retrieveID(@PathVariable String id){
        logger.log(Level.WARNING,"/activity/retrieve/" + id);

        if(activityService.existById(id)){
            Activity response = activityService.findById(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No existe ninguna actividad con ese id");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }


    @Operation(summary = "Devuelve una lista de las actividades almacenadas cuya fecha de finalización sea igual " +
            "o posterior a la actual")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve la lista de las actividades almacenadas con fecha igual o posterior a la " +
                            "actual",
                    content = @Content(mediaType = "application/json")
            ),@ApiResponse(
                responseCode = "404",
                description = "No existen actividades activas en este momento",
                content = @Content(mediaType = "application/json")
            )
    })
    @GetMapping(value = "/retrieve/active", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>  retrieveActive(){
        logger.log(Level.WARNING,"/activity/retrieve/active");

        List<Activity> response = activityService.retrieveActivate();
        if(!response.isEmpty()){
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No existen actividades activas en estos momentos");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "Devuelve una lista de todas las actividades almacenadas")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve la lista de las actividades almacenadas",
                    content = @Content(mediaType = "application/json")
            ),@ApiResponse(
            responseCode = "404",
            description = "No existen actividades almacenadas en este momento",
            content = @Content(mediaType = "application/json")
    )
    })
    @GetMapping(value = "/retrieve/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?>  retrieveAll(){
        logger.log(Level.WARNING,"/activity/retrieve/all");

        if(!activityService.isEmpty()){
            List<Activity> response = activityService.getAll();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ninguna actividad almacenada");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    @Operation(summary = "Crea una actividad cuyo identificador es id. En caso de que ya exista una actividad " +
            "con ese identificador, la actualiza")
    @ApiResponses(value = {
            @ApiResponse(
                  responseCode = "200",
                  description = "Devuelve la actividad creada/actualizada",
                  content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "El id de la actividad y id no coinciden",
                    content = @Content(mediaType = "application/json"))
    })

    @PostMapping(value = "/store/{id}",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> StoreID(@PathVariable String id, @RequestBody Activity body){
        logger.log(Level.WARNING,"/activity/store/" + id);

        // Comprueba que la petición es válida
        if(id.equals(body.getId())){

            // Si existe una activity con ese id, lo actualiza, sino lo crea
            Activity response = activityService.createActivity(body);
            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","El id y el id de la actividad deben coincidir");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }



    @Operation(summary = "Crea las actividades que se pasan como parámetro")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Devuelve la actividades creadas/actualizadas",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "El array de actividades no puede ser nulo",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping(value = "/store",consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> Store(@RequestBody ActivitiesRequest body){
        List<Activity> activities = body.getActivities();

        if(!activities.isEmpty()){
            List<Activity> response = activityService.createActivities(activities);

            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","La lista de actividades no puede ser nula");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    @Operation(summary = "Elimina la actividad cuyo identificador sea igual al indicado y su feedback asociado en caso " +
            "de que exista")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "La actividad se ha borrado con éxito",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No existe una actividad con ese id",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping(value = "/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> DeleteID(@PathVariable String id){
        logger.log(Level.WARNING,"/activity/delete/" + id);

        // Comprueba si la actividad con ese id existe y en ese caso la elimina
        if(activityService.existById(id)){
            activityService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No existe una actividad con el id proporcionado");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }


    @Operation(summary = "Elimina todas las actividades en caso de que haya actividades almacenadas")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Se han eliminado todas las actividades almacenadas",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No hay ninguna actividad almacenada",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping(value = "/delete/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> DeleteAll(){
        logger.log(Level.WARNING,"/activity/delete/all");

        if(!activityService.isEmpty()){
            activityService.deleteAll();
            return new ResponseEntity<>(HttpStatus.OK);
        }else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ninguna actividad almacenada");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


}
