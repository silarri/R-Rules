// DB
import * as Schemas from "../realmSchemas/schema";
import * as Location from "./position";


export function buildSiddhiContext(){
    console.log("buildSiddhiContext");
    let location = Schemas.retrieveLastContext("LOCATION");
    let weather = Schemas.retrieveLastContext("WEATHER");
    let sensorizar = Schemas.retrieveLastContext("SENSORIZAR");

    let userContext = buildUserSiddhiContext(location.id, getDate(), getTime());

    let locationObservations = buildLocationSiddhiContext(JSON.parse(location.json));
    let weatherObservation = buildWeatherSiddhiContext(JSON.parse(weather.json));
    let sensorizarObservatons = buildServerBasedSiddhiContext(JSON.parse(sensorizar.json));

    let observations = weatherObservation.concat(locationObservations);
    observations = observations.concat(sensorizarObservatons);

    let context = {
        "UserContext" : userContext,
        "Observations" : observations
    }

    console.log(context);
    return context;
    
}

export function buildSiddhiContextForTest(userContext){
    console.log("buildSiddhiContext");
    let location = Schemas.retrieveLastContext("LOCATION");
    let weather = Schemas.retrieveLastContext("WEATHER");
    let sensorizar = Schemas.retrieveLastContext("SENSORIZAR");

    

    let locationObservations = buildLocationSiddhiContext(JSON.parse(location.json));
    let weatherObservation = buildWeatherSiddhiContext(JSON.parse(weather.json));
    let sensorizarObservatons = buildServerBasedSiddhiContext(sensorizar.json);

    let observations = weatherObservation.concat(locationObservations);
    observations = observations.concat(sensorizarObservatons);


    let context = {
        "UserContext" : userContext,
        "Observations" : observations
    }

    console.log(`[NEW] Context: ${JSON.stringify(context)}`);
    return context;
    
}


export function buildContextMessage() {
    let user = Schemas.retrieveUser();
    let json = buildContext(user);
    // Retrieve user
    json.user = buildUser(user);
    return json;
}

export function buildRecommendationMessage(recommendations, weather, location, events){
   
    let user = Schemas.retrieveUser();
    let json = buildContextAux(user, location, weather, events);
    console.log("Context: " + JSON.stringify(json));
    
    json.categories = recommendations;

    // Recommender can be mahout or random
    json.recommender = "mahout";
    // Retrieve user
    json.user = buildUser(user);

    return json;
}

function buildUserSiddhiContext(id, date, time){
    let userContext = {
        "contextId" : id.toString(),
        "date" : date,
        "time" : time
    }
    return userContext;
}

function buildWeatherSiddhiContext(weather){
    let weatherStatus = weather.weather[0].main;
    let temp = weather.main.temp;

    let observation = {"observedProperty" : "Weather",
                        "optionalField": temp.toString(),
                        "observationValue": weatherStatus};

    return [observation];
}

// Sensorizar case
function buildServerBasedSiddhiContext(sensorizar){
    console.log(`SENSORIZAR: ${JSON.stringify(sensorizar)}`);
    console.log(`SENSORIZAR OBJECT: ${typeof sensorizar}`)
    const object = JSON.parse(sensorizar);
    let observation1 = {
        "observedProperty" : "CO2",
        "optionalField": object.co2[0].value,
        "observationValue": "sensorizar"};
    let observation2 = {
        "observedProperty" : "Temperature",
        "optionalField": object.temperature[0].value,
        "observationValue": "sensorizar"};
    let observation3 = {
        "observedProperty" : "Humidity",
        "optionalField": object.humidity[0].value,
        "observationValue": "sensorizar"};
    return [observation1, observation2, observation3];
}




function buildLocationSiddhiContext(pos){
    let lat1 = pos.coords.latitude;
    let lon1 = pos.coords.longitude;
    let locationCR = Schemas.retrieveLocationCR();
    let locatonObservations = [];
    if(locationCR != null){
        locationCR.forEach(element => {
            let distanceKM = distanceBetweenCoords(lat1, lon1, element.gpsLatitude, element.gpsLongitude);
            let distanceM = Math.round(distanceKM * 1000);
            let observation = { "observedProperty" : "Location",
                                "optionalField": element.name,
                                "observationValue": distanceM.toString()};

            locatonObservations.push(observation);
        })
    }
    return locatonObservations;
}

// Extracted from https://www.codegrepper.com/code-examples/javascript/js+calculate+distance+between+two+coordinates
function distanceBetweenCoords(lat1, lon1, lat2, lon2){
    // It uses  the ‘haversine’ formula 
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; //km

    return d;   
}

// Extracted from https://www.codegrepper.com/code-examples/javascript/js+calculate+distance+between+two+coordinates
function toRad(Value) 
{
    return Value * Math.PI / 180;
}

function getTime(){
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function getDate(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return day + "/" + month + "/" + year;
}

function buildContext(user) {
    let weather = Schemas.retrieveContext('WEATHER');
    let location = Schemas.retrieveContext('LOCATION');
    // let events = Schemas.retrieveContext('EVENTS');
    // Return JSON message
    return buildContextAux(user, location.json, weather.json, events.json);
}

/**
 * It checks user's privacy 
 * settings to decide which info is going to be shared
 */
function buildContextAux(user, location, weather, events) {
    // Defines JSON to be sent
    let datetime = new Date().toISOString();
    let json = {
        context: {
            timestamp: datetime,
        }
    };
    // Check privacy settings
    let permission = true;
    let userId = user.token;
    // Build location
    permission = Schemas.retrieveValueSetting(userId, 'PROFILE', 'Location');
    if (permission) {
        // Check accuracy
        let accuracy = Schemas.retrieveValueSetting(userId, 'PROFILE', 'Accurate Location');
        buildLocation(json, location, accuracy); 
    }
    // Build weather
    permission = Schemas.retrieveValueSetting(userId, 'PROFILE', 'Weather');
    if (permission) buildWeather(json, weather);
    // Build calendar events
    permission = Schemas.retrieveValueSetting(userId, 'PROFILE', 'Calendar events');
    if (permission) buildEvents(json, events);
    // Return json message
    return json;
}



function buildUser(userObj) {
    let token = userObj.token;
    let permission = Schemas.retrieveValueSetting(token, 'PROFILE', 'User profile');
    if (permission) {
        // Retrieve personal info.
    } 
    return { id: token };
}



/**
 * Builds location, if accuracy is false it adds noise to longitude & latitude (< 1Km)
 * @param {*} json 
 * @param {*} location 
 * @param {*} accuracy 
 */
function buildLocation(json, location, accuracy) {
    location = JSON.parse(location);
    // Accurate location (default)
    let lon = location.coords.longitude;
    let lat = location.coords.latitude;
    if (!accuracy) {
        // Add error to location
        let coords = Location.noiseCoordinate(
            location.coords.longitude,
            location.coords.latitude
        );
        lon = coords.lon;
        lat = coords.lat;
    }
    location = {
        mocked: location.mocked,
        speed: location.coords.speed,
        altitude: location.coords.altitude,
        longitude: lon,
        latitude: lat
    };
    json.context.location = location;
    
}

function buildWeather(json, weather) {
    json.context.weather = {};
    weather = JSON.parse(weather);
    json.context.weather.temp = weather.main.temp;
    json.context.weather.description = weather.weather[0].main;

    /*
    json.context.weather.pressure = weather.main.pressure;
    json.context.weather.humidity = weather.main.humidity;
    json.context.weather.temp_min = weather.main.temp_min;
    json.context.weather.temp_max = weather.main.temp_max;
    json.context.weather.wind = weather.wind.speed;
    */
}

function buildEvents(json, events) {
    json.context.events = [];
    events = JSON.parse(events);
    events.forEach(element => {
        // Checks that title is not the email account
        let calendar = checkTitle(element.calendar.title);
        event = {
            description: element.description,
            calendar: calendar,
            title: element.title,
            begin: element.startDate,
            end: element.endDate,
            allDay: element.allDay,
            location: element.location,
            availability: element.availability
        };
        // Push new event
        json.context.events.push(event);
    });
}

/**
 * Checks that title is not an email account,
 * if it is, returns "NOT AVAILABLE",
 * if it is not, returns same title
 */
function checkTitle(title) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(title).toLowerCase()))
        return "NOT AVAILABLE"; // is an email
    else
        return title;
}

/**
 * Builds hello JSON message
 */
export function buildHelloMessage() {
    let token = Schemas.retrieveUser().token;
    let user = Schemas.retrieveValueSetting(token, "PROFILE", "User profile");
    let location = Schemas.retrieveValueSetting(token, "PROFILE", "Location");
    let accuracy = false;
    if (location) {
        // location enabled
        accuracy = Schemas.retrieveValueSetting(token, "PROFILE", "Accurate Location");
    } 
    let weather = Schemas.retrieveValueSetting(token, "PROFILE", "Weather");
    let calendar = Schemas.retrieveValueSetting(token, "PROFILE", "Calendar events");

    let message = {
        user: token,
        settings: {
            user: user,
            location: {
                setting: location,
                accuracy: accuracy,
            },
            weather: weather,
            calendar: calendar
        }
    };
    // Return hello message
    console.log(message);
    return message;
}

/**
 * Builds a feedback message
 */
export function buildFeedbackMessage(activity) {
    let user = Schemas.retrieveUser();
    // Build context
    let json = buildContext(user);
    // Build user
    json.user = buildUser(user);
    // Build activity
    json.activity = buildActivity(activity);
    // Build feedback values
    json = buildFeedbackValues(activity, json);
    // Return json
    return json;
}

/**
 * Build activity json object to be sent
 */
function buildActivity(activity) {
    let json = {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        authorid: activity.authorId,
        author: activity.author,
        img: activity.img,
        category: activity.category,
        begin: activity.begin,
        end: activity.end, 
        longitude: activity.longitude,
        latitude: activity.latitude
    };
    return json;
}

/**
 * Builds feedback specific values from user-activity
 */
function buildFeedbackValues(activity, json) {
    // Clicked
    json.clicked = activity.clicked;
    // Saved
    if (activity.state == 'saved') json.saved = true;
    else json.saved = false;
    // Discarded
    json.discarded = activity.discarded;
    // Rating
    json.rate = activity.rating;
    // return json
    return json;
}