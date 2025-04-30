import * as Context from "../event/context";
import * as Location from "../event/position";
import * as Schemas from "../realmSchemas/schema";
import * as Notification from "../event/notification";


// EMs
import EM from "./ems";
import { NativeModules } from "react-native";
const { SiddhiClientModule } = NativeModules;

let VERSION = "1.0.1";
let last = 1; // Refresco de contexto para el EM

/**
 * Sends current user's context to an EM
 * @param {*} em : EM that is going to receive the message
 */
async function fetchContext(em) {
    let json = Context.buildContextMessage();
    let tokenAuth = Schemas.currentAuthToken();
    console.log("AUTHTOKEN: " + tokenAuth);
    console.log("JSON ENVIADO EN REQUEST");
    console.log(JSON.stringify(json));
    try {
        let response = await fetch(em.address + '/app/context', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': tokenAuth
            },
            body: JSON.stringify(json)
        });
        let resJson = await response.json();
        return resJson;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Sends current user's context to an EM
 * @param {*} em : EM that is going to receive the message
 */
function fetchHello(em, message) {
    console.log('FetchHello: Communication try');
    console.log("EM: " + em.address);
    console.log(JSON.stringify(message));

    let tokenAuth = Schemas.currentAuthToken();
    console.log("AUTHTOKEN: " + tokenAuth);

    return fetch(em.address + '/app/hello', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : tokenAuth
        },
        body: JSON.stringify(message)
    })
        .then((response) => { console.log("OK: " + em.address + "; " + em.id); return response.json() })
        .then((responseJson) => {
            //console.log(responseJson);
            return responseJson;
        })
        .catch((error) => {
            //console.error(error);
        });

}

export function fetchFeedback(activity) {
    console.log("/app/feedback");
    let json = Context.buildFeedbackMessage(activity);
    //console.log(json);

    let tokenAuth = Schemas.currentAuthToken();
    console.log("AUTHTOKEN: " + tokenAuth);

    let address = '';
    // Search EM's address
    EM.list.forEach(em => {
        if (activity.author === em.id)
            address = em.address;
    });
    if (address == '') return;

    let str = address + '/app/feedback';
    //console.log(str);
    // Send post
    return fetch(str, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization' : tokenAuth
        },
        body: JSON.stringify(json)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log(responseJson);
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });

}

// NEW
async function fetchRecommendation(recommendations, token, em) {
    let weather = Schemas.retrieveLastContext('WEATHER');
    let location = Schemas.retrieveLastContext('LOCATION');
    let events = Schemas.retrieveContext('EVENTS');
    let json = Context.buildRecommendationMessage(recommendations, weather.json, location.json, events.json);
    console.log("Mensaje: " + JSON.stringify(json));

    let tokenAuth = Schemas.currentAuthToken();
    console.log("AUTHTOKEN: " + tokenAuth);

    try {
        let response = await fetch(em.address + '/app/context', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : tokenAuth
            },
            body: JSON.stringify(json)
        });
        let resJson = await response.json();
        console.log("RESPONSE: " + resJson);
        return resJson;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Starts communication with EM
 */
export function sayHello() {
    console.log("sayHello");
    // Get & check user's token
    let user = Schemas.retrieveUser();
    if (user === null) {
        return null;
    }
    console.log("sayHello 2");
    let token = user.token;
    // Get current location
    let myLocation = Schemas.retrieveCurrentLocation();
    if (myLocation === null) {
        return;
    }
    console.log("sayHello3");
    // Get profile setting max. distance. Convert to number
    let maxDistance = Number(Schemas.retrieveValueParameter(token, "PROFILE", "DISTANCE"));
    const managers = EM.list;
    // Gets EM data
    console.log("sayHello4");
    managers.forEach(em => {
        // Check if it's near
        if (em.coords != null) {
            let distance = Location.getDistanceLatLon(
                myLocation.lat, myLocation.lon, em.coords.lat, em.coords.lon);
            //console.log("myLocation.lat: " + myLocation.lat);
            //console.log("myLocation.lon: " + myLocation.lon);
            //console.log("lat: " + em.coords.lat);
            //console.log("lon: " + em.coords.lon);
            //console.log("MaxDistance: " + maxDistance);
            //console.log("Distance: " + distance);
            // Checks if it's close enough
            if (distance <= maxDistance) {
                console.log('Fetch: Trying to connect EM');
                buildHello(token, em);
            }
        } else {
            console.log('Fetch: Trying to connect EM 2');
            buildHello(token, em);
        }
    });
}

/**
 * Starts communication with EM
 */
export function startRecommendation(recommendations) {
    console.log("startRecommendation");
    // Get & check user's token
    let user = Schemas.retrieveUser();
    if (user === null) {
        return null;
    }

    let token = user.token;
    // Get current location
    let myLocation = Schemas.retrieveCurrentLocation();
    if (myLocation === null) {
        return;
    }
    // Get profile setting max. distance. Convert to number
    let maxDistance = Number(Schemas.retrieveValueParameter(token, "PROFILE", "DISTANCE"));
    const managers = EM.list;
    // Gets EM data

    managers.forEach(em => {
        // Check if it's near

        if (em.coords != null) {
            let distance = Location.getDistanceLatLon(
                myLocation.lat, myLocation.lon, em.coords.lat, em.coords.lon);
            //console.log("myLocation.lat: " + myLocation.lat);
            //console.log("myLocation.lon: " + myLocation.lon);
            //console.log("lat: " + em.coords.lat);
            //console.log("lon: " + em.coords.lon);
            //console.log("MaxDistance: " + maxDistance);
            //console.log("Distance: " + distance);
            // Checks if it's close enough
            if (distance <= maxDistance) {
                console.log('Fetch: Trying to connect EM');
                buildHello(token, em, recommendations);
            } else {
                console.log('Fetch: Trying to connect EM 2');
                buildHello(token, em, recommendations);
            }
        } else {
            console.log('Fetch: Trying to connect EM 3');
            buildHello(token, em, recommendations);
        }

    });
}


/**
 * Starts communication, sends public settings info to EMs
 */
async function buildHello(token, em, recommendations) {
    // Get refresh rate
    let rate = Number(Schemas.retrieveValueParameter(token, "PROFILE", "RATE"));
    if (last >= rate) { last = 1; }
    else {
        last++;
        return; // wait 
    }

    // Build message
    console.log("build Hello");
    let message = Context.buildHelloMessage();
    // 1. Start communication
    let response = await fetchHello(em, message);
    console.log("Hello");
    console.log("RESPONSE: " + JSON.stringify(response));

    console.log("RESPONSE: " + typeof response);
    // 2. Check if req is accepted

    if (typeof response === 'undefined') {
        console.log("Response undefined, em not found: " + em);
        return;
    }

    if (response.result === 'false') {
        console.log('req not accepted');
        return;
    }
    // 3. Send context every X minutes
    //let activities = await fetchContext(em);
    let activities = await fetchRecommendation(recommendations, token, em);
    console.log("LOG: 6- Items recomendados por el gestor de entorno:");
    console.log("LOG: Number of recommended items: " + activities.length);
    activities.forEach(act => {
        console.log("LOG: " + act.id + "; " + act.title + "; " + act.type + "; " + act.subcategories);
    });
    // 4. Process activities
    let notify = false;
    activities.forEach(act => {
        console.log("A;");
        if (Notification.processItem(act))
            console.log("TRUE");
        notify = true;
    });
    // 5. Local notification
    if (notify) Notification.localTest();
}

/**
 * Well done! This is working now
 */
export function testConnection() {
    console.log("Testing connection");

    // Token for API
    let tokenAuth = Schemas.currentAuthToken();
    console.log("AUTHTOKEN: " + tokenAuth);
    console.log(tokenAuth);
    console.log(typeof tokenAuth);
    const managers = EM.list;
    managers.forEach(em => {
        console.log('Fetch: ' + em.address);
        fetch(em.address + '/ping',
            {
                method: 'GET',
                headers: {
                    'Authorization': tokenAuth
                }})
            .then((response) => {
                return response.text();
            })
            .then((plainText) => {
                // console.log(plainText);
            })
            .catch((error) => {
                //console.error(error);
            });
    });
}


/**
 * ADDED: Register a new user
 */
export function registerUser() {
    console.log("User registry");
    const managers = EM.list;
    managers.forEach(em => {
        console.log('Fetch: ' + em.address);
        buildRegister(em).then((response) => { console.log(response); return response });
    });
}

async function buildRegister(em) {
    try {
        let tokenAuth = Schemas.currentAuthToken();
        console.log("AUTHTOKEN: " + tokenAuth);

        console.log("buildRegister");
        let user = Schemas.retrieveUser();
        if (user === null) {
            return null;
        }
        let token = user.token;
        console.log('Token: ' + token);
        let json = {
            id: token,
        };
        // console.log(JSON.stringify(json));
        let response = await fetch(em.address + '/users/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': tokenAuth
            },
            body: JSON.stringify(json)
        });
        let resJson = await response.json();
        return resJson;
    } catch (error) {
        console.log(error);
    }
}

export async function loginUser(login) {
    const managers = EM.list;
    
    let result = '';

    for(const em of managers){
        console.log('Fetch: ' + em.address);
        let response = await loginUserAux(em, login);
        console.log("RESPONSE IS: " + response);
        console.log("RESPONSE TYPE IS: " + typeof response);

        if (typeof response !== 'undefined'){
            result = response;
            break;
        }
    }
    console.log("RESULT: " + result);
    return result;
}

async function loginUserAux(em, login){
    let response = await fetch(em.address + '/users/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login)
    });
    return response;
}
