import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
    NativeModules,
    DeviceEventEmitter
} from 'react-native';
import { createStackNavigator, createDrawerNavigator } from "react-navigation";

import {getContextExamples, getContextRulesExamples, getActivitiesExamples} from "./testData/readJSON";

// DB
import * as Schemas from "./realmSchemas/schema";

import * as myPosition from "./event/position";
import * as Event from "./event/context";
import * as ExclusionSets from "./exclusionSets/checkExclusionSets";

// Screens
import HomeScreen from "./screens/home";
import SavedScreen from "./screens/saved";
import HistoricScreen from "./screens/historic";
import ActivityScreen from "./screens/activity";
import ProfileScreen from "./screens/profile";
import SettingsScreen from "./screens/settings";
import LoginScreen from "./screens/login";
import LoadingScreen from "./screens/loading";
import ContextScreen from "./screens/context";
import MapsScreen from "./screens/map";
import CustomDrawer from './screens/components/CustomDrawer';

// Exclusion sets screen
import ExclusionsAndPrioritiesScreen from './screens/exclusion-sets/exclusionsAndPriorities';
import AddExclusionSetScreen from './screens/exclusion-sets/addExclusionSet';
import EditExclusionSetScreen from './screens/exclusion-sets/editExclusionSet';

// Context-rules screen
import ContextRulesScreen from './screens/context-rules/contextRules';
import AddContextRuleScreen from './screens/context-rules/addContextRule';
import EditLocationContextRuleScreen from './screens/context-rules/editLocationContextRule';
import EditTimeBasedContextRuleScreen from './screens/context-rules/editTimeBasedContextRule';
import EditCalendarBasedContextRuleScreen from './screens/context-rules/editCalendarBasedContextRule';
import EditWeatherContextRuleScreen from './screens/context-rules/editWeatherContextRule';
import EditServerBasedContextRuleScreen from './screens/context-rules/editServerBasedContextRule';


// Triggering-rules screen
import TriggeringRulesScreen from './screens/triggering-rules/triggeringRules';
import EditTriggeringRuleScreen from './screens/triggering-rules/editTriggeringRule';
import AddTriggeringRuleScreen from './screens/triggering-rules/addTriggeringRule';

import * as Notification from "./event/notification";


import * as ExternalResquest from './external-servers/external-requests';

const { SiddhiClientModule } = NativeModules;


// It has the json context json exampls to send to siddhi
var jsonContextExample = [];


// Background task
import * as Communication from "./em/fetch"

// Sleep
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Returns the recommendation result as String
async function getResult() {
    // Obtenemos el resultado
    let result;
    await new Promise((resolve, reject) => {
        SiddhiClientModule.getResult(
            (eventId) => {
                result = eventId;
                resolve();
            }
        );
    });
    return result;
}

// Returns if the siddhi app is stopped
async function isStopped(task) {
  console.log(task + " async isStopped");
  // Obtenemos el resultado
  let result;
  await new Promise((resolve, reject) => {
      SiddhiClientModule.isStopped(
          (eventId) => {
              console.log(task + " Result obtained");
              result = eventId;
              resolve();
          }
      );
  });
  return result;
}

const SendContextTask = async () => {
  //console.log('Background world!');
  console.log("SENDCONTEXT TASK");
  //Communication.sayHello();
  let user = Schemas.retrieveUser();
  console.log("SENDCONTEXTASK" + user);
  // Check if user is logged for starting Siddhi and recommendations
 
  
  //TODO: Login disabled
  if(user != null){
    console.log("S USER LOGGED");
    //Communication.sayHello();
    
    // We connect with Siddhi Service
    SiddhiClientModule.connect();

    let stopped = await isStopped("S");
    console.log("S isStopped:" + stopped);

    if(!stopped){
      // For false context
     
      // NOTE: LOAD TEST CONTEXTS 
      // FAKE CONTEXT
      let context = jsonContextExample.shift();

      console.log("LOG: 1- Contexto de prueba");
      console.log("LOG: " + JSON.stringify(context));
      Schemas.CreateContext("LOCATION", JSON.stringify(context.Location));
      Schemas.CreateContext("WEATHER", JSON.stringify(context.Weather));
      Schemas.CreateContext("SENSORIZAR", JSON.stringify(context.Sensorizar));

     
      // Sensorizar communication
      const tokenObject = Schemas.retrieveCurrentToken();
      let sensorizarToken;
      const actualDate = new Date();
      console.log(`[NEW] -> Actual Date: ${actualDate}`);
     
      if(tokenObject !== null) {
        console.log(`[NEW] -> Token Date: ${tokenObject.timestamp}`);
        console.log(`[NEW] -> SUB TOTAL: ${Math.abs(actualDate - tokenObject.timestamp)/(60*1000)}`);
      }


      // Sensorizar token duration: 2.5 h (150 seconds)
      if(tokenObject === null || Math.abs(actualDate - tokenObject.timestamp)/(60*1000) > 150){
        sensorizarToken = await ExternalResquest.loginSensorizarServer();
      }else{
        sensorizarToken = tokenObject.token;
      }

      console.log(`[NEW] -> Token value: ${sensorizarToken}`);
      
      // GENERATE CONTEXT FROM DEVICE, DISABLED FOR TESTING
      // Generate new Siddhi context
      // Get and store new location
      // await ExternalResquest.getInfoServer(sensorizarToken);

      // let pos = await myPosition._getLocation();
      // Schemas.CreateContext("LOCATION", JSON.stringify(pos));
      // let wea = await myPosition._getCurrentWeather(pos);
      // let context = Event.buildSiddhiContext();
      // Build new Siddhi context

      context = Event.buildSiddhiContextForTest(context.UserContext);


      // If context was generated:
      if (context != null){
        context = JSON.stringify(context);
        console.log("LOG: 2-Contexto enviado a Siddhi");
        console.log("LOG: " + context);

        let activeTR = Schemas.getActiveTriggeringRulesName();
        console.log("LOG: 3-Triggering rules activas");
        console.log("LOG: " + activeTR);

        // Send new context to Siddhi
        SiddhiClientModule.sendEvent(context);
      }else{
        console.log("CONTEXT WAS NOT GENERATED");
      }
      
    }else{
      console.log("S SIDDHI APP IS STOPPED");
    }
  }else{
    console.log("S USER NOT LOGGED");
  }
}

const ListenRecommendationResultTask = async () => {
    // Delay for waiting all things to start (serivces...)
    await sleep(4000);

    console.log("ListenRecommendationResultTask: STARTED");
    while(true){
      //console.log("L WHILE START");

      // Check if user is logged for starting Siddhi and recommendations
      // let user = Schemas.retrieveUser();
      let user = '';
      //TODO: Login disabled
      if(user != null){
        console.log("L USER LOGGED");

        let stopped = await isStopped("L");
        console.log("L isStopped:" + stopped);
        if(!stopped){
          console.log('L Result: WANTED');
          let result = await getResult();
          console.log('L Result: ' + result);
          if(result != "start"){
            let r = result.split(",");
            let id = r.shift();

            // COMMENT FOR TESTING -> IF CONTEXT CREATED IN DEVICE, DELETE COMMENT
            let lastContext = Schemas.retrieveLastContext("LOCATION");
            let weather = Schemas.retrieveLastContext("WEATHER");
            // if(Number(id) == lastContext.id || Number(id) == weather.id){
             
              console.log("LOG: 4- Tipos de recomendación activadas por Siddhi para el contexto: " + id);
              console.log("LOG: " + r);

              let recommendations = ExclusionSets.getRecommendationsWithExclusionSets(r);
              
              console.log("LOG: 5- Tipos de recomendación activadas filtradas por los EXCLUSION SETS: ");
              console.log("LOG: " + recommendations);
              
              // iniciar recomendación -> nos comunicamos con EM
              let recommendationsCopy = r;
              console.log("GOING TO START RECOMMENDATION: " + JSON.stringify(recommendationsCopy));

              if(recommendationsCopy.find((rec) => rec === 'changeRoom')){
                console.log(`[NEW] -> NEW RECOMMENDER ACTIVE`);
                let activity = jsonActivitiesExample.shift();
                Notification.processItem(activity);
                if(recommendationsCopy.length > 2){
                  console.log(`[NEW] -> OLD RECOMMENDER ACTIVE TOO`);
                  Communication.startRecommendation(recommendations);
                }
              }else{
                console.log(`[NEW] -> OLD RECOMMENDER ACTIVE`);
                Communication.startRecommendation(recommendations);
              }
            // }
          }
        }else{
          console.log("LOG: INFO: Siddhi app is STOPPED -> no active triggering rules");
          await sleep(5000);
          console.log("L SIDDHI APP IS STOPPED");
        }
      }else{
        console.log("L USER NOT LOGGED");
        // Sleeping 30 seconds before retrying
        await sleep(30000);
      }
    }
}



// Registrar Headless.js task
// Se ejecutará cada 30 segundos
AppRegistry.registerHeadlessTask('SendContextTask', () => SendContextTask);

// Se ejecuta constantemente porque no acaba (parámetro de timeout está a 0) -> es un bucle infinito
AppRegistry.registerHeadlessTask('ListenRecommendationResultTask', () => ListenRecommendationResultTask);

// READ JSON CONTEXT EXAMPLE
jsonContextExample = getContextExamples();
jsonActivitiesExample = getActivitiesExamples();

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Saved: { screen: SavedScreen },
    Historic: { screen: HistoricScreen },
    Activity: { screen: ActivityScreen },
    Profile: { screen: ProfileScreen },
    Settings: { screen: SettingsScreen },
    Login: { screen: LoginScreen },
    Loading: { screen: LoadingScreen },
    Context: { screen: ContextScreen },
    Maps: { screen: MapsScreen },
    Recommendation_triggering_rules: { screen: TriggeringRulesScreen },
    Recommendation_exclusions_and_priorities : { screen: ExclusionsAndPrioritiesScreen },
    Context_rules : { screen: ContextRulesScreen },
    Define_context_rule: {screen: AddContextRuleScreen},
    Edit_Location_Context_Rule: {screen: EditLocationContextRuleScreen},
    Edit_Time_Based_Context_Rule: {screen: EditTimeBasedContextRuleScreen},
    Edit_Calendar_Based_Context_Rule: {screen: EditCalendarBasedContextRuleScreen},
    Edit_Weather_Context_Rule: {screen: EditWeatherContextRuleScreen},
    Define_triggering_rule: {screen: AddTriggeringRuleScreen},
    Edit_Triggering_Rule: {screen: EditTriggeringRuleScreen},
    Define_Exclusion_Set: {screen: AddExclusionSetScreen},
    Edit_Exclusion_Set: { screen: EditExclusionSetScreen},
    Edit_Server_Based_Context_Rule: {screen: EditServerBasedContextRuleScreen}
  },
  {
    initialRouteName: "Loading",
    headerMode: 'float',
  }
);

// Drawer
const AppDrawer = createDrawerNavigator({
  Main: { screen: AppNavigator },
}, {
  mode: 'modal',
  headerMode: 'none',
  contentComponent: CustomDrawer,
});

export default class App extends Component {

  render() {
    return <AppDrawer />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
