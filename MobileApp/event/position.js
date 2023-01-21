// Postion & Weather context
import React from 'react';
import {
    AsyncStorage, 
} from 'react-native';

import * as Schemas from "../realmSchemas/schema";
import oauth from "../oauth";   // root/oauth.js

// Radius of the earth in km 6371; circumference 40075 km
// 1 km is 1 * (360/40075) = 0.008983 degrees
const Degree = 0.008983;

/**
 * Retrieves current location
 */
export function _getLocationAsync() {
    console.log("get location async()");
    let token = Schemas.currentToken();
    if (token === null) { console.log("userNull"); return null; }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("getLocationAsync: " + JSON.stringify(position));
                // Save location to db 
                Schemas.CreateContext("LOCATION", JSON.stringify(position));
                // Get current weather
                _getCurrentWeather(position);
                // Realm
                Schemas.storeLocation(token, position);
                
                console.log("LOCATON STORED");
                resolve(position);
            },
            error => reject(error),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }
        )
    });
};


/**
 * Retrieves current location
 */

export function _getLocation() {
    return new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 200000, maximumAge: 100000 })
    );
}



/**
 * Retrieves current location
 */
 export function _getLocationAsyncForRules() {
     console.log("getLocationAsyncForRules");
     return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                console.log('coordinates');
                let coordinates = `${position.coords.longitude},${position.coords.latitude}`;
                
                console.log(coordinates);
                resolve(coordinates);
            },
            error => reject(error),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        )
    });
    
};


/**
 * Retrieves current weather for the location
 */
export async function _getCurrentWeather(location) {
    let lat = location.coords.latitude;
    let lon = location.coords.longitude;

    // Retrieve conditions using current coordinates
    // Temperature -> Celsius
    // Kelvin2Celsiuis(k) return c => k = c - 273,15
    try {
        let response = await fetch(
            'http://api.openweathermap.org/data/2.5/weather' +
            '?lat=' + lat + '&lon=' + lon + "&units=metric" +
            '&appid=' + oauth.openweathermap
        );
        let resJson = await response.json();
        resJson = JSON.stringify(resJson)

        // Set data & db
        Schemas.CreateContext("WEATHER", resJson);
        return true;
    } catch (error) {
        // Error routine
        console.log(error);
    }

};

/**
 * Retrieves coordinates from FB user
 * Not running now!
 */
export async function _getFacebookCoordinates() {
    try {
        let user = await AsyncStorage.getItem('user');
        let addres = user.location.name;
        let response = await fetch(
            'https://maps.googleapis.com/maps/api/geocode/json' +
            '?address=' + addres +
            '&key=' + oauth.androidGoogle
        );
        let resJson = await response.json();
        // AsyncStorage
        AsyncStorage.setItem('FBPosition', resJson);
    } catch (error) {
        // Error routine
        console.log(error);
    }

};

/**
 * Returns the distance between two coordinates in km.
 * It uses the Haversine formula https://en.wikipedia.org/wiki/Haversine_formula
 */
export function getDistanceLatLon(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

/**
 * Adds <0.5Km error to the coordinate 
 * @param {*} lat 
 * @param {*} lon 
 */
export function noiseCoordinate(lat, lon) {
    
    let deg = Degree;
    let random = Math.random();
    let sign = 1;
    // Latitude
    if (Math.random() > 0.5) sign = -1;
    else sign = 1;
    let lat1 = lat + sign*random*deg;
    // Longitude
    let lon1 = lon - sign*(1-random)*deg;

    // Mostrar diferencia con coordenadas originales
    //let km = getDistanceLatLon(lat, lon, lat1, lon1);
    //console.log('Noise: ' + km + ' Km');

    return {lat: lat1, lon: lon1};
}