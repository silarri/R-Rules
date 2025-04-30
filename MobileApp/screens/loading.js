import React from 'react';
import {
    AppRegistry, Image, Platform,
    StyleSheet, View, Alert,
    AsyncStorage, ActivityIndicator, NativeModules
} from 'react-native';
import {
    Container, Button, Text,
    Icon
} from 'native-base';


import {getContextRulesExamples, getExclusionSetsExamples} from "../testData/readJSON";
// It has the json context RULES json examples
var jsonContextRulesExample = [];
var jsonExclusionSetsExample = [];

import oauth from "../oauth";   // root/oauth.js

// Events
import * as myCalendar from "../event/calendar";
import * as myPosition from "../event/position";
// Notifications
import * as Notifications from '../event/notification';
// Icon
import icon from "../icon.png";
// Communication
import * as Communication from "../em/fetch";

// DB
import * as Schemas from "../realmSchemas/schema";

const { SiddhiClientModule } = NativeModules;
import * as CreateSiddhiApp from "../siddhi/createSiddhiApp";

export default class LoadingScreen extends React.Component {

    static navigationOptions = {
        header: null,
        title: "loading", // Not show; header is hidden
    }

    constructor(props) {
        super(props);
    }


    fakeLogin = async () => {
        // Check permissions
        console.log("SOLICITAR PERMISO CALNDARIO");
        let calendar = await RNCalendarEvents.authorizeEventStore();
        console.log("SOLICITADO: " + calendar);

        //console.log("ANTES DE GEOLOCALIZACIÓN");
        let location = await navigator.geolocation.requestAuthorization();
        //console.log("DESPUÉS DE GEOLOCALIZACIÓN: " + location);

        if (location === 'authorized' && calendar === 'authorized') {
            let user = Schemas.retrieveUser();
            if (user !== null) {
                // Navigate to home
                this.props.navigation.navigate('Home');
            }   
        } else {
            // No permissions, cannot continue

        }
    }


    componentDidMount = async () => {
        // Configure notifications
        Notifications.configureNotifications();
        
        this.props.navigation.setParams({ headerMode: 'none' });
        try {
            // Allow notifications
            //myNotification._registerForPushNotificationsAsync();
            let user = Schemas.retrieveUser();
            console.log("user");
            console.log(user);

            // If user exists -> login
            if (user !== null) {
                
                // Get location & current weather
                await myPosition._getLocationAsync();

                // Calendar
                myCalendar._getCalendarAsync();

                // Set Facebook location
                //this._getFacebookCoordinates();

                // Start Siddhi and app 
                SiddhiClientModule.connect();
                CreateSiddhiApp.createSiddhiApp();

                console.log("LOADING: AFTER CREATESIDDHIAPP");

                // Navigate to home
                this.props.navigation.navigate('Home');
            } else {
                // No user available
                // TODO: Login disabled

                // User test because login is disabled
                let loginUser = {
                    "email" : "test@gmail.com",
                    "password" : "1234test5678"
                }
                console.log("Going to login");
                let response = await Communication.loginUser(loginUser);
                let headers = response.headers;
                let body = await response.json();
                let user = body.user;
                let tokenAuth = headers.map.authorization;
                
                let newUser = {
                    email: user.email,
                    token: user.id.toString(),
                    authToken: "Basic " + tokenAuth,
                    password: "1234test5678",
                    provider: 'CARS-em',
                    genre: user.genre,
                    birth: user.birth
                };
                Schemas.replaceUser(newUser);
                

                // We login as user test because login is disabled, so we start Siddhi App
                // When login fixed, we only need to start siddhi app when login is done
                console.log('Login done');
                Alert.alert("INFO", "You are logged as " + newUser.email + " user for testing");
                
                // NOTE:  LOAD DEFINED CONTEXT RULES
                jsonContextRulesExample = getContextRulesExamples();
                Schemas.storeContextRulesFromJson(jsonContextRulesExample);

                // NOTE: LOAD DEFINED EXCLUSION SETS
                jsonExclusionSetsExample = getExclusionSetsExamples();
                Schemas.storeExclusionSetsFromJson(jsonExclusionSetsExample);

                // Start Siddhi and app 
                SiddhiClientModule.connect();
                CreateSiddhiApp.createSiddhiApp();

                // This actions should be executed in login screen, but it is not working
                await this.fakeLogin();
                
                //this.props.navigation.navigate('Login');
            }
        } catch (error) {
            // Error - repeat login
            console.log("LOADING: ERROR");
            console.log(error);   // debug
            this.props.navigation.navigate('Home');
            //this.props.navigation.navigate('Login');
        }
    }

    // Not currently running
    /*
    _getFacebookCoordinates = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            let address = user.location.name;
            let response = await fetch(
                'https://maps.googleapis.com/maps/api/geocode/json' +
                '?address=' + address +
                '&key=' + oauth.androidGoogle
            );
            let resJson = await response.json();
            let position = JSON.parse('{' +
                '"formatted_address": "' + resJson.results[0].formatted_address + '", ' +
                '"location": ' + JSON.stringify(resJson.results[0].geometry.location) +
                '}'
            );
            // AsyncStorage
            AsyncStorage.setItem('FBPosition', JSON.stringify(position));
        } catch (error) {
            // Error routine
            console.log(error);
            console.log(error);
        }

    }; */

    _getConditionsAsync = async () => {
        console.log("Loading location");
        try {
            await myPosition._getLocationAsync();
        } catch (error) {
            // Error
            console.log(error);
        }
    }

    render() {
        return (
            <View style={styles.view}>
                <Image style={styles.icon} source={icon} />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    view: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'white',
    },
    icon: {
        height: 120,
        width: 120,
    },
});