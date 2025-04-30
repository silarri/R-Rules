// DB
import * as Schemas from "../realmSchemas/schema";
import { NativeModules } from 'react-native';
const { SiddhiClientModule } = NativeModules;

let siddhiAppName = "siddhiApp";


/*
* Function to create and run new Siddhi App with context rules and triggering rules stored in realm.
* If there are not Triggering Rules it does nothing.
*
* SiddhiApp Format:
*   - stream names
*   - json queries
*   - context rules
*   - deny context rules (or not)
*   - triggering rules
*/
export function createSiddhiApp(){
    console.log("createSiddhiApp");

    let triggeringRules = Schemas.retrieveTriggeringRulesSwitchOn();

    // console.log(`createSiddhiApp: TR ${JSON.stringify(triggeringRules)}`);


    // If user hasn't added any triggering rule, we do nothing
    
    if(triggeringRules == null){
        // We should stop app because maybe triggering rules were disabled or removed
        SiddhiClientModule.stopApp();
        console.log("Not creating APP because there are not triggering rules");
    }else{
        // If user has added some triggering rule
        let introSiddhi = createSiddhiAppIntro();

        // We create Siddhi App and keep it in a string
        let contextRules = Schemas.retrieveContextRules();
        let contextRulesSiddhi = writeAllContextRules(contextRules);
        let triggeringRulesSiddhi = writeAllTriggeringRules(triggeringRules);
        let end = createSiddhiAppEnd();

        let app = introSiddhi + contextRulesSiddhi + triggeringRulesSiddhi + end;

        console.log("CONTEXT RULES: " + contextRulesSiddhi);

        // Stop Siddhi App
        SiddhiClientModule.stopApp();

        // Start new Sidhi App
        SiddhiClientModule.startApp(app);
    }
    
    console.log("createSiddhiApp ending");
};

/*
*   Creates Siddhi App Introduction: app name + streams + first queries for processing JSON context
*/
function createSiddhiAppIntro(){
    let intro = "@App:name('" + siddhiAppName + "')\n";
    let streams = "define stream Context (json string);\n" + 
    "define stream UserContext(contextId string, date string, time string);\n" +
    "define stream Observations(observedProperty string, optionalField string, observationValue string, contextId string);\n" + 
    "define stream Results(contextId string, recommendation string);\n" + 
    "@sink(type = 'log', prefix = 'LOGGER_FinalResult') define stream FinalResults(contextId string, recommendation string);\n" + 
    "@sink(type = 'log', prefix = 'LOGGER_Je') define stream Je(contextId string);\n" + 
    "@sink(type = 'log', prefix = 'LOGGER_Fes') define stream Fes(contextId string);\n";
    
    let introQueries = "@info(name='getUserContext') from Context select json:getString(json,'$.UserContext.contextId') as contextId, " +
            "json:getString(json,'$.UserContext.date') as date, json:getString(json,'$.UserContext.time') as time "  +
            "insert into UserContext;\n" + 
            "@info(name='getObservations') from Context#json:tokenizeAsObject(json, '$.Observations')" +
            "select json:getString(jsonElement, '$.observedProperty') as observedProperty, json:getString(jsonElement, '$.optionalField') as optionalField," + 
            "json:getString(jsonElement, '$.observationValue') as observationValue, json:getString(json,'$.UserContext.contextId') as contextId " +
            "insert into Observations;\n";

    return intro + streams + introQueries;
}


/*
* Build last query for getting 
*/
function createSiddhiAppEnd(){
    let end = "@info(name = 'finalResults') from Results#window.timeBatch(7 sec) select contextId, str:groupConcat(recommendation) as recommendation group by contextId insert into FinalResults;";
    return end;
}

/*
*   Writes all context rules in Siddhi Query Language
*/
function writeAllContextRules(contextRules){
    let result = "";
    contextRules.forEach(element => { 
        let rule = "";
        if(element.type == "Time-Based"){
            rule = createTimeBasedContextRule(element);
        }else if(element.type == "Calendar-Based"){
            rule = createCalendarBasedContextRule(element);
        }
        else if(element.type == "Weather"){
            rule = createWeatherContextRule(element);
        }else if(element.type == "Location"){
            rule = createLocationContextRule(element);
        }else if(element.type == "Server-Based"){
            rule = createServerBasedContextRule(element)
        }
        result = result + rule;
    });
    return result;
}


/*
*  Writes one time-based context rule in Siddhi Query Language
*/
function createTimeBasedContextRule(contextRule){
    let ini = "@info(name='";
    let from = "') from UserContext[((time:timestampInMilliseconds(time, 'HH:mm:ss') - time:timestampInMilliseconds('";
    let from2 = ":00', 'HH:mm:ss')) >= 0) and ((time:timestampInMilliseconds(time, 'HH:mm:ss') - time:timestampInMilliseconds('";
    let select = ":00', 'HH:mm:ss')) < 0)] select contextId insert into ";
    let ending = ";\n"

    let result = ini + contextRule.name + "CR" + from + contextRule.startTime + from2 + contextRule.endTime 
                + select + contextRule.name  + ending;
    return result;
};


/*
*  Writes one sensorizar Server-based context rule in Siddhi Query Language
*/
function createServerBasedContextRule(contextRule){
    let type;
    if( contextRule.measurement === 'temperature') type='Temperature';
    if( contextRule.measurement === 'co2') type= "CO2";
    if( contextRule.measurement === 'humidity') type=  "Humidity";
    console.log(`[NEW] -> CR : ${contextRule.name} | ${type}`);
    let ini = "@info(name='";
    let from = `') from Observations[(observedProperty=='${type}') and (observationValue=='${contextRule.server}') and ((convert(optionalField, 'double') ${contextRule.comparator} ${contextRule.value}))]`;
    
    let select = `select contextId insert into ${contextRule.name};\n`;
    let result = ini + contextRule.name + "CR" + from + select;

    console.log(`[NEW] -> CR : ${result}`);
    return result;
};


/** 
 * Writes one calendar-based context rule in Siddhi Query Language
*/
function createCalendarBasedContextRule(contextRule){
    let ini = "@info(name='";
    let from = "') from UserContext[(time:dayOfWeek(date, 'dd/MM/yyyy') == '";

    let days = contextRule.daysOfWeek;

    days = days.filter(function(element){
        if(element.checked){
            return element;
        }
    });

    let i = 0;
    days.forEach(element => {
        if(i != (days.length - 1)){
            from = from + element.key + "' or time:dayOfWeek(date, 'dd/MM/yyyy') == '";
        }else{
            from = from + element.key;
        }
        i++;
    });

    let from2 = "";

    if(contextRule.startDate != "__/__/__" && contextRule.endDate != "__/__/__"){
        from2 = "') and ((time:dateDiff(date, '" + contextRule.startDate + 
            "', 'dd/MM/yyyy', 'dd/MM/yyyy') >= 0 ) and (time:dateDiff(date, '" + contextRule.endDate +
            "', 'dd/MM/yyyy', 'dd/MM/yyyy') <= 0))"; 
    }else{
        from2 = "')";
    }

    let select = "] select contextId insert into ";
    let ending = ";\n";

    let result = ini + contextRule.name + "CR" + from + from2 + select + contextRule.name + ending;
    //console.log("Calendar-based: ");
    //console.log(result);
    return result;
}

/*
* Writes one weather context rule in Siddhi Query Language
*/
function createWeatherContextRule(contextRule){
    let ini = "@info(name='";
    let from = "')from Observations[(observedProperty=='Weather') and (observationValue == '";

    let weather = contextRule.weatherStatus;
    let i = 0;


    weather = weather.filter(function(element){
        if(element.checked){
            return element;
        }
    })

    weather.forEach(element => {
            if(i != (weather.length - 1)){
                from = from + element.key + "' or observationValue == '";
            }else{
                from = from + element.key;
            }
        i++;
    });

    let from2 = "') and (convert(optionalField, 'double') >=" ;
    let from3 = ") and (convert(optionalField, 'double') <=";

    let select = ")] select contextId as contextId insert into "; 
    let ending = ";\n"

    let result = ini + contextRule.name + "CR" + from + from2 + contextRule.minTemp + from3 + contextRule.maxTemp + select + contextRule.name + ending;
    


    return result;
}


/** 
 * Writes one location context rule in Siddhi Query Language
*/
function createLocationContextRule(contextRule){
    let ini = "@info(name='";
    let from = "') from Observations[observedProperty =='Location' and optionalField =='";
    let from2 = "' and convert(observationValue, 'int') <=";
    let select = "] select contextId insert into ";
    let ending = ";\n"

    let result = ini + contextRule.name + "CR" + from + contextRule.name + from2 + contextRule.locationError + 
        select + contextRule.name + ending;
    
    
    return result;
}


/*
* Writes all triggering rules in Siddhi Query Language.
* Add those context rules that should be denied.
* result = denyContextRules + triggeringRules.
*/
function writeAllTriggeringRules(triggeringRules){
    let result = "";
    let denyRules = [];
    triggeringRules.forEach(element => {
        console.log(`[NEW] -> TR:  ${element.name} ${element.denyContextRule}`);

        let rule = createTriggeringRule(element);
        result = result + rule[0];
        rule[1].forEach(e => denyRules.push(e));
    });

    // We write deny context rules 
    let denyCR = createNegatedContextRules(denyRules);
    //console.log(denyCR);

    console.log("CONTEXT RULES NEGADAS:" + denyCR);
    console.log("TRIGGERING RULES:" + result);
    
    // Return first deny context rules and then triggering rules
    return denyCR + result;
}


/*
*  Writes one triggering rule in Siddhi Query Language
*/
function createTriggeringRule(triggeringRule){
    console.log("createTriggeringRule");
    let contextRules = Object.keys(triggeringRule.contextRules).map(key => triggeringRule.contextRules[key]);
    let denyRules = triggeringRule.denyContextRule;

    // console.log(`[NEW] -> TR: DENYRULES ${JSON.stringify(denyRules)}`);

    // For CR type time and calendar
    let cR1 = [];

    // For CR type locaton and weather
    let cR2 = [];
    
    let denyCR = [];
    let denyCR1 = [];
    let denyCR2 = [];
    let i = 0;

    // We separate context rules in denyRules or not
    contextRules.forEach(element => {
        if(denyRules[i]){
            if(element.type == "Time-Based" || element.type == "Calendar-Based"){
                console.log(`[NEW] -> TR: Server-Based DENY RULE`);
                denyCR1.push(element);
            }else{
                denyCR2.push(element);
            }
        }else{
            if(element.type == "Time-Based" || element.type == "Calendar-Based"){
                cR1.push(element);
            }else if(element.type ==  "Location" || element.type == "Weather"  || element.type == "Server-Based"){
                cR2.push(element);
            }
        }
        i++;
    });

    // We order by name context rules that are used by the triggering rule because we need that for Siddhi logic work
    if (cR1.length != 0) cR1.sort(order);
    if (cR2.length != 0) cR2.sort(order);
    if (denyCR1.length != 0) denyCR1.sort(order);
    if (denyCR2.length != 0) denyCR2.sort(order);


    let ini = "@info(name='";

    let from = "";
    if(cR1.length > 0){
        // There are normal time/calendar based
        // If there are cR

        let first = cR1[0];
        from = "') from every e0 = " + first.name + " ";
        
        // We add CR to FROM in siddhi rule
        cR1.shift();
        let e = 1;

        // First rules of Time and Calendar
        from = auxCR(from, cR1, e);
        e = e + cR1.length;

        // Second denied Time and Calendar
        from = auxDenyCR(from,denyCR1,e);
        e = e + denyCR1.length;

        // Third Weather and Location
        from = auxCR(from, cR2, e);
        e = e + cR2.length;

        // Fourth denied Weather and Location
        from = auxDenyCR(from, denyCR2, e);
        

    }else if(denyCR1.length > 0){
        console.log(`DENYCR1 I'm here`);
        // There are not time/calendar based CR normal but there are denied CR
        let first = denyCR1[0];
        from = "') from every e0 = not" + first.name + " ";
        
        let denyCRCopy = denyCR1.slice();

        // We add CR to FROM in siddhi rule
        denyCR1.shift();
        e = 1;

        // First denied rules of Time and Calendar
        from = auxDenyCR(from, denyCR1, e);
        e = e + denyCR1.length;

        from = auxCR(from, cR2, e);
        e = e + cR2.length;

        from = auxDenyCR(from,denyCR2, e);
        console.log(`from ${from}`);

        denyCR1 = denyCRCopy;

    }else if(cR2.length > 0){
        // There are not time/calendar based but there are normal weather/location
        let first = cR2[0];
        from = "') from every e0 = " + first.name + " ";
        
        // We add CR to FROM in siddhi rule
        cR2.shift();
        e = 1;

        from = auxCR(from, cR2, e);
        e = e + cR2.length;

        from = auxDenyCR(from, denyCR2, e);

    }
    else{
        // There are not time/calendar based CR, there are not normal calendar/location CR but there are denied calendar/location
        let first = denyCR2[0];
        from = "') from every e0 = not" + first.name + " ";
        
        let denyCRCopy = denyCR2.slice();

        denyCR2.shift();
        e=1;

        from = auxDenyCR(from, denyCR2, e);

        denyCR2 = denyCRCopy;
    }

    
    let select = "select e0.contextId, '" + triggeringRule.recommendationType + "' as recommendation insert into Results" ;
    let end = ";\n";

    // Return format: ["triggering siddhi rule", [context rules we have to deny]]
    let result = []
    result.push(ini + triggeringRule.name + "TR" + from + select + end);
    denyCR = denyCR1.concat(denyCR2);

    result.push(denyCR);
    console.log(`AAAAAAAAAAAAAAAAAAAA ${denyCR.length}`);
    return result;
}

// Create deny context rules
function createNegatedContextRules(denyCR){
    console.log(`TESTTTTTTTTTTTTTTTTTTT: ${denyCR.length}`);
    let notRepeated = [...new Map(denyCR.map(item =>
        [item['id'], item])).values()];
    
    notRepeated.sort(order);
    
    console.log(`TESTTTTTTTTTTTTTTTTTTT: ${notRepeated}`);


    let result = "";
    notRepeated.forEach(element => { 
        let rule = createDenyContextRule(element);
        result = result + rule;});
    return result; 
}



// Create a deny context rule. It will have "not" in query name and stream name
function createDenyContextRule(denyCR){
    let result = "";
    if(denyCR.type == "Time-Based"){
        result = createDenyTimeBasedContextRule(denyCR);
    }else if(denyCR.type == "Calendar-Based"){
        result = createDenyCalendarBasedContextRule(denyCR);
    }
    else if(denyCR.type == "Weather"){
        result = createDenyWeatherContextRule(denyCR);
    }else if(denyCR.type == "Location"){
        result = createDenyLocationContextRule(denyCR);
    }else if(denyCR.type == "Server-Based"){
        console.log(`OK`);
        result = createDenyServerBasedContextRule(denyCR);
    }
    console.log(`CREATE DENY RULE ${JSON.stringify(result)}`);
    return result;
}

function createDenyTimeBasedContextRule(denyCR){
    let ini = "@info(name='not";
    let from = "') from UserContext[((time:timestampInMilliseconds(time, 'HH:mm:ss') - time:timestampInMilliseconds('";
    let from2 = ":00', 'HH:mm:ss')) < 0) or ((time:timestampInMilliseconds(time, 'HH:mm:ss') - time:timestampInMilliseconds('";
    let select = ":00', 'HH:mm:ss')) >= 0)] select contextId insert into not";
    let ending = ";\n"

    let result = ini + denyCR.name + "CR" + from + denyCR.startTime + from2 + denyCR.endTime 
                + select + denyCR.name + ending;
    return result;
}

function createDenyServerBasedContextRule(contextRule){
    let denySign;
    if( contextRule.comparator === '>') denySign='<=';
    if( contextRule.comparator === '=') denySign= "!=";
    if( contextRule.comparator === '<') denySign=  ">=";

    let type;
    if( contextRule.measurement === 'temperature') type='Temperature';
    if( contextRule.measurement === 'co2') type= "CO2";
    if( contextRule.measurement === 'humidity') type=  "Humidity";
    console.log(`[NEW] -> CR : ${contextRule.name} | ${type}`);
    let ini = "@info(name='not";
    let from = `') from Observations[(observedProperty=='${type}') and (observationValue=='${contextRule.server}') and ((convert(optionalField, 'double') ${denySign} ${contextRule.value}))]`;
    
    let select = `select contextId insert into not${contextRule.name};\n`;
    let result = ini + contextRule.name + "CR" + from + select;

    console.log(`[NEW] -> CR : ${result}`);
    return result;
};

function createDenyCalendarBasedContextRule(denyCR){
    let ini = "@info(name='not";

    let from = "') from UserContext[(time:dayOfWeek(date, 'dd/MM/yyyy') != '";

    let days = denyCR.daysOfWeek;

    days = days.filter(function(element){
        if(element.checked){
            return element;
        }
    });

    let i = 0;
    days.forEach(element => {
        if(i != (days.length - 1)){
            from = from + element.key + "' and time:dayOfWeek(date, 'dd/MM/yyyy') != '";
        }else{
            from = from + element.key;
        }
        i++;
    });

    let from2 = "";

    if(denyCR.startDate != "__/__/__" && denyCR.endDate != "__/__/__"){
        from2 = "') or ((time:dateDiff(date, '" + denyCR.startDate + 
            "', 'dd/MM/yyyy', 'dd/MM/yyyy') < 0 ) or (time:dateDiff(date, '" + denyCR.endDate +
            "', 'dd/MM/yyyy', 'dd/MM/yyyy') > 0))"; 
    }else{
        from2 = "')";
    }

    let select = "] select contextId as contextId insert into not";
    let ending = ";\n";

    let result = ini + denyCR.name + "CR" + from + from2 + select  + denyCR.name + ending;
    
    return result;
}

function createDenyWeatherContextRule(denyCR){
    let ini = "@info(name='not";
    let from = "')from Observations[((observedProperty=='Weather') and (observationValue != '";

    let weather = denyCR.weatherStatus;
    let i = 0;

    weather = weather.filter(function(element){
        if(element.checked){
            return element;
        }
    })

    weather.forEach(element => {
            if(i != (weather.length - 1)){
                from = from + element.key + "' and observationValue != '";
            }else{
                from = from + element.key;
            }
        i++;
    });

    let from2 = "')) or ((convert(optionalField, 'double') <" ;
    let from3 = ") or (convert(optionalField, 'double') >";

    let select = "))] select contextId as contextId insert into not"; 
    let ending = ";\n"

    let result = ini + denyCR.name + "CR" + from + from2 + denyCR.minTemp + from3 + denyCR.maxTemp + select +  denyCR.name + ending;
    
    
    
    return result;
}


function createDenyLocationContextRule(denyCR){
    let ini = "@info(name='not";
    let from = "') from Observations[observedProperty =='Location' and optionalField =='";
    let from2 = "' and convert(observationValue, 'int') >";
    let select = "] select contextId insert into not";
    let ending = ";\n"

    let result = ini + denyCR.name + "CR" + from + denyCR.name + from2 + denyCR.locationError + 
        select + denyCR.name + ending;
   
    
    return result;
}


// Auxiliar function to order object array by name field (used in createTriggeringRule())
function order(a, b){
    if(a.name.toUpperCase() < b.name.toUpperCase()){
        return -1
    }else if(a.name.toUpperCase() == b.name.toUpperCase()){
        return 0
    }else{
        return 1
    }
}

function auxCR(from,cR, e){
    if(cR.length > 0){
        // Second rules of Weather and Location
        cR.forEach(element => {
            let sentence = "-> every e" + e + " = " + element.name + "[e0.contextId == e" + e + ".contextId] "; 
            from = from + sentence;
            e++;
        });
    }
    return from;
}

function auxDenyCR(from, denyCR, e){
    if(denyCR.length > 0){
        denyCR.forEach(element => {
            let sentence = "-> every e" + e + " = not" + element.name + "[e0.contextId == e" + e + ".contextId] "; 
            from = from + sentence;
            e++;
        })
    }
    return from;
}
