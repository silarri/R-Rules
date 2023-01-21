package com.example.CARSEm.controllers;


import com.example.CARSEm.model.*;
import com.example.CARSEm.requests.AppContextRequest;
import com.example.CARSEm.requests.AppHelloRequest;
import com.example.CARSEm.requests.FeedbackRequest;
import com.example.CARSEm.requests.RecommendationRequest;
import com.example.CARSEm.services.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.common.LongPrimitiveIterator;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.similarity.ItemSimilarity;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/app")
public class AppController {

    @Autowired
    UserService userService;

    @Autowired
    ContextService contextService;

    @Autowired
    ActivityService activityService;

    @Autowired
    ShareService shareService;

    @Autowired
    FeedbackService feedbackService;

    @Autowired
    AuthorizationService authorizationService;

    Logger logger = Logger.getLogger(this.getClass().getName());


    //TODO: ¿Completar esta petición?
    @Operation(summary = "Recibe la información de ajustes de un nuevo usuario. En\n" +
            "caso de que sea apto para el EM, devuelve true. En caso contrario, false")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "El nuevo usuario es apto para el EM",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No existe un usuario con ese identificador",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "EL body debe contar con un identificador de usuario y Settings",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "El token es inválido o el usuario no tiene acceso a esa información " +
                            "(token no corresponde a user)",
                    content = @Content(mediaType = "application/json")),
    })
    @PostMapping(value = "/hello", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<JSONObject> hello(HttpServletRequest request, @RequestBody AppHelloRequest body) {
        logger.log(Level.WARNING,"/app/hello");

        String token = request.getHeader("Authorization");
        User user = userService.findUserById(body.getUser());
        if(body.getSettings()==null){
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", false);
            responseBody.put("reason?","Body must have a user and a settings");

            return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
        }else if(!authorizationService.tokenFormatIsValid(token) || !authorizationService.tokenIsValid(token)){
            JSONObject response = new JSONObject();
            response.put("error", "Invalid token");

            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }else if(user == null){
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", false);
            responseBody.put("reason?","That user does not exist");

            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
        }else if(!authorizationService.userHasAccess(token, user)){
            JSONObject error = new JSONObject();
            error.put("error","No tienes acceso a esos datos");
            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }else{
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", true);
            responseBody.put("reason?","OK");
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }
    }


    @Operation(summary = "Actualiza el estado del usuario con el contexto especificado. Devuelve " +
            "una lista con todas las actividades recomendadas para el usuario en dicho contexto y que sean de " +
            "las categorías enviadas como parámetro. " +
            "Se recomienda no reenviar la misma actividad a menos que su contenido haya sido actualizado")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Se actualiza el estado del usuario y se devuelve la lista de actividades que no han " +
                            "sido enviadas",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "No existe un usuario con ese identificador o no existe ese recomendador",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "El token es inválido o el usuario no tiene acceso a esa información " +
                            "(token no corresponde a user)",
                    content = @Content(mediaType = "application/json")),
    })
    @PostMapping(value = "/context", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> context(HttpServletRequest request, @RequestBody AppContextRequest body) {
        logger.log(Level.WARNING,"/app/context");

        String token = request.getHeader("Authorization");

        Context context = body.getContext();
        User userBody = body.getUser();

        User user = userService.findUserById(userBody.getId());
        List<String> categories = body.getCategories();
        String recommender = body.getRecommender();

        if(!authorizationService.tokenFormatIsValid(token) || !authorizationService.tokenIsValid(token)){
            JSONObject response = new JSONObject();
            response.put("error", "Invalid token");

            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }else if(user == null){
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", false);
            responseBody.put("reason?","That user does not exist");

            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
        }
        else if(!authorizationService.userHasAccess(token, user)){
            JSONObject error = new JSONObject();
            error.put("error","No tienes acceso a esos datos");

            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }else if(recommender.equals("random")){
            // Almacenamos el nuevo contexto en la base de datos
            long startTime = System.currentTimeMillis();
            contextService.storeContext(context);
            User u = userService.findUserById(userBody.getId());

            // Invoke random recommender
            List<Activity> response = randomRecommender2(categories, u);

            List<Share> newShare = new ArrayList<>();
            for (Activity a: response) {
                Share share = new Share(a,user);
                newShare.add(share);
            }
            shareService.createShareAll(newShare);


            return new ResponseEntity<>(response, HttpStatus.OK);
        }else if(recommender.equals("mahout")){
            logger.log(Level.WARNING, "mahout recommender");
            long startTime = System.currentTimeMillis();
            contextService.storeContext(context);
            User u = userService.findUserById(userBody.getId());
            logger.log(Level.WARNING, "USER ID: " + u.getId() );
            // Invoke random recommender

            long middleTime = System.currentTimeMillis();
            List<Activity> response = mahoutRecommender(categories, u);
            long middleTime2 = System.currentTimeMillis();

            List<Share> newShare = new ArrayList<>();
            for (Activity a: response) {
                Share share = new Share(a,user);
                newShare.add(share);
            }
            shareService.createShareAll(newShare);


            long endTime = System.currentTimeMillis();
            logger.log(Level.WARNING, String.valueOf(middleTime - startTime));
            logger.log(Level.WARNING,String.valueOf(middleTime2 - middleTime));
            logger.log(Level.WARNING,String.valueOf(endTime - middleTime2));

            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else{
            JSONObject error = new JSONObject();
            error.put("error","No hay ningún recomendador con ese nombre");

            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
    }


    @Operation(summary = "Almacena o actualiza el feedback indicado en la base de datos." +
            "          En caso de almacenar o modificar algún dato devuelve true. En caso contrario, false")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Se almacena el feedback y el contexto de la actividad y el usuario",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(
                    responseCode = "404",
                    description = "La actividad y el usuario deben existir en el EM",
                    content = @Content(mediaType = "application/json")
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "El token es inválido o el usuario no tiene acceso a esa información " +
                            "(token no corresponde a user)",
                    content = @Content(mediaType = "application/json")),
    })


    @PostMapping(value = "/feedback", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> feedback(HttpServletRequest request, @RequestBody FeedbackRequest body) {
        logger.log(Level.WARNING,"/app/feedback");

        String token = request.getHeader("Authorization");

        User u = body.getUser();
        User user = userService.findUserById(u.getId());
        Activity a = body.getActivity();
        Context c = body.getContext();
        LocalDateTime timestamp = java.time.LocalDateTime.now();

        // Comprobamos si el usuario y actividad existen
        if(!userService.existById(u.getId()) || !activityService.existById(a.getId())){
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", false);
            responseBody.put("reason?","Body must have a user and activity that already exist");

            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);

        }else if(!authorizationService.tokenFormatIsValid(token) || !authorizationService.tokenIsValid(token)){
            JSONObject response = new JSONObject();
            response.put("error", "Invalid token");

            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }else if(user == null){
            JSONObject responseBody = new JSONObject();
            responseBody.put("result", false);
            responseBody.put("reason?","That user does not exist");

            return new ResponseEntity<>(responseBody, HttpStatus.NOT_FOUND);
        }
        else if(!authorizationService.userHasAccess(token, user)){
            JSONObject error = new JSONObject();
            error.put("error","No tienes acceso a esos datos");

            return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);

        }else{

            // Creamos el contexto
            Context newContext = contextService.storeContext(c.getEvents(), c.getLocation(),c.getWeather(),
                    c.getTimestamp());

            // Creamos el feedback
            Feedback newFeedback = new Feedback(body.getClicked(),body.getSaved(),body.getDiscarded(),body.getRate(),
                    newContext,u,a,timestamp);
            feedbackService.createFeedback(newFeedback);

            JSONObject responseBody = new JSONObject();
            responseBody.put("result", true);
            return new ResponseEntity<>(responseBody, HttpStatus.OK);
        }
    }


    List<Activity> getActivitiesNotShared(User user){
        List<Activity> userActivities = shareService.getActivitiesFromUser(user);
        return activityService.getDiferent(userActivities);
    }

    List<Activity> randomRecommender2(List<String> categories, User user){
        List<Activity> result = new ArrayList<Activity>();
        // Get shared for user
        List<Activity> userAll = shareService.getActivitiesFromUser(user);
        List<Activity> allActivities = activityService.getAll();
        // Get activities that weren't shared to the user
        allActivities.removeAll(userAll);

        if(!allActivities.isEmpty()){
            // We filter activities of cat type
            for (String cat : categories) {
                String c = cat.toLowerCase();
                // Get activities from allActivities with cetegory = cat
                List<Activity> aux = allActivities.stream().filter((p) -> p.getType().toLowerCase().equals(c)).
                        collect(Collectors.toList());

                // Add to the result
                logger.log(Level.WARNING, cat + ": " +  aux.size());
                result.addAll(aux);
            }

            // Shuffle activities
            Collections.shuffle(result);

            // We get random activities
            Random r = new Random();
            int random = r.nextInt(10);
            if(result.size() > 0 && result.size() >= random){
                logger.log(Level.WARNING, "RANDOM: " + random);
                result = result.subList(0, random);
            }else{
                result = result.subList(0, result.size());
            }
        }
        logger.log(Level.WARNING, "Result size: " + result.size());
        return result;
    }



    List<Activity> mahoutRecommender(List<String> categories, User user){
        long startTime = System.currentTimeMillis();
        List<Activity> recommended = new ArrayList<Activity>();
        List<Activity> result = new ArrayList<Activity>();
        // Get and save all activities
        // Get shared for user
        List<Activity> userAll = shareService.getActivitiesFromUser(user);


        List<Activity> allActivities = activityService.getAll();


        // Get activities that weren't shared to the user
        allActivities.removeAll(userAll);
        // Activate mahout recommender
        long middleTime = System.currentTimeMillis();
        // Activate mahout recommender
        Resource resource = new ClassPathResource("ratings.csv");
        try {
            File file = resource.getFile();

            DataModel dm = new FileDataModel(file);
            ItemSimilarity similarity = new EuclideanDistanceSimilarity(dm);

            GenericItemBasedRecommender recommender = new GenericItemBasedRecommender(dm, similarity);

            long middleTime2 = System.currentTimeMillis();

            // Get mahout activities
            List<RecommendedItem> recommendations = recommender.recommend(0,300);

            long middleTime3 = System.currentTimeMillis();
            // Get info from activities selected by Mahout
            for (RecommendedItem recommendation : recommendations) {
                // Filter by cats activated from Siddhi
                for (Activity item : allActivities){
                    if(Integer.parseInt(item.getId()) == recommendation.getItemID()){
                        recommended.add(item);
                    }
                }
            }

            long middleTime4 = System.currentTimeMillis();
            logger.log(Level.WARNING,"MAHOUT END");

            for (Activity act : recommended){
                String aCat = act.getType().toLowerCase();
                boolean existCat = categories.stream().anyMatch(element -> aCat.equals(element.toLowerCase()));
                if(existCat){
                    result.add(act);
                }
            }

            logger.log(Level.WARNING, String.valueOf(result.size()));
            long middleTime5 = System.currentTimeMillis();

            Collections.shuffle(result);

            // We get random activities
            Random r = new Random();
            // Number between 1 and 8
            int random = r.nextInt(9 - 1) + 1;
            if(result.size() > 0 && result.size() >= random){
                logger.log(Level.WARNING, "RANDOM: " + random);
                result = result.subList(0, random);
            }else{
                result = result.subList(0, result.size());
            }

            long endTime = System.currentTimeMillis();

            logger.log(Level.WARNING, "T1: " + String.valueOf(middleTime - startTime));
            logger.log(Level.WARNING,"T2: " + String.valueOf(middleTime2 - middleTime));
            logger.log(Level.WARNING,"T3: " + String.valueOf(middleTime3 - middleTime2));
            logger.log(Level.WARNING,"T4: " + String.valueOf(middleTime4 - middleTime3));
            logger.log(Level.WARNING,"T5: " + String.valueOf(middleTime5 - middleTime4));
            logger.log(Level.WARNING,"T6:" + String.valueOf(endTime - middleTime5));

            logger.log(Level.WARNING, "BYE");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TasteException e) {
            e.printStackTrace();
        }

        // Return X activites, we don't want to saturate the user
        return result;
    }

}
