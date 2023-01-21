const Realm = require('realm');

/**
 * Position Schema
 */
export const PositionSchema = {
    name: 'Position',
    properties: {
        userId: 'string',
        lat: 'double',
        lon: 'double',
        timestamp: 'int',
    }
};


export function storeLocation(userId, position) {
    let time = (new Date()).getTime();
    myRealm.write(() => {
        myRealm.create('Position', {
            userId: userId,
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            timestamp: time
        });
    });
}

export function retrieveCurrentLocation() {
    let positions = myRealm.objects('Position').sorted('timestamp', true);
    if (positions.length > 0) {
        return positions[0];
    } else {
        return null;
    }
}

/**
 * Settings Schema
 */
export const SettingsSchema = {
    name: 'Setting',
    properties: {
        userId: 'string',
        type: 'string',     // [ SETTINGS | PROFILE | ORDER ] strings permits future ampliations
        key: 'string',
        value: 'bool',
    }
};

/**
 * Order is a special setting, its value is stored in key;
 * it modifies or creates a new order if does not exits
 */
export function modifyOrder(userId, key) {
    myRealm.write(() => {
        let order = myRealm.objects('Setting').filtered(
            'userId="' + userId + '" AND type="ORDER"'
        );
        if (order.length > 0) {
            // update it
            order[0].key = key;
        } else {
            myRealm.create('Setting', {
                userId: userId,
                type: "ORDER",
                key: key,
                value: true,
            });
        }
    });
}

/**
 * Retrieves current activity kind of order
 */
export function retrieveOrder(userId) {
    let order = myRealm.objects('Setting').filtered(
        'userId="' + userId + '" AND type="ORDER"'
    );
    if (order.length > 0) {
        // update it
        return order[0].key;
    } else {
        return 'default';
    }
}

export function storeSetting(userId, type, key, value) {

    myRealm.write(() => {
        myRealm.create('Setting', {
            userId: userId,
            type: type,     // [ SETTINGS | PROFILE ] strings permits future ampliations
            key: key,
            value: value,
        });
    });
}

export function retrieveValueSetting(userId, type, key) {
    let setting = myRealm.objects('Setting').filtered(
        'userId="' + userId + '" AND type="' + type +
        '" AND ' + 'key="' + key + '"'
    );
    if (setting.length > 0)
        return setting[0].value;
    else
        return true;
}

/**
 * Activity Schema
 */
export const ActivitySchema = {
    name: 'Activity',
    primaryKey: 'id',
    properties: {
        id: 'string',   // artificial key, authorId & user should be natural key
        authorId: 'string', // EM id
        author: 'string',   // EM title/name
        title: 'string',
        type: 'string',
        description: 'string',
        img: 'string?',     // ? -> optional
        begin: 'date?',
        ending: 'date?',
        longitude: 'double?',
        latitude: 'double?',
        rating: { type: 'int', default: 0 },
        state: { type: 'string', default: 'default' },    // Activity' state: default, saved...
        user: 'string', // User that received the activity
        clicked: { type: 'bool', default: false },
        discarded: { type: 'bool', default: false },
        date: 'date?', // creation/last update
    }
};

/**
 * Implements part of post-filtering phase, 
 * creates or modifies an activity, if it is
 * created or updated (relevant update) returns
 * true, otherwise returns false
 */
export function storeActivity(activity) {
    console.log("storeActivity");
    // Get current user
    let user = retrieveUser();
    // Checks if already exists this activity, as it is send by em it checks
    // author id & user, not internal id
    let oldActivity = retrieveActivityAuthor(activity);
    if (oldActivity != null) {
        // If already exits may be necessary to update
        return updateActivity(oldActivity, activity);
    }


    // Local id => authorId + user.token 
    let date = new Date();

    // CHANGED: not all activities have ending and begin
    if(activity.begin != 0 && activity.ending != 0){
        myRealm.write(() => {
            myRealm.create('Activity', {
                id: activity.id,
                authorId: activity.authorId,
                author: activity.author,
                title: activity.title,
                type: activity.type,
                description: activity.description,
                img: activity.img,
                begin: activity.begin,
                ending: activity.ending,
                longitude: activity.longitude,
                latitude: activity.latitude,
                // Default state
                user: user.token,
                discarded: false,
                clicked: false,
                date: date
            });
        });
    }else{
        myRealm.write(() => {
            myRealm.create('Activity', {
                id: activity.id,
                authorId: activity.authorId,
                author: activity.author,
                title: activity.title,
                type: activity.type,
                description: activity.description,
                img: activity.img,
                longitude: activity.longitude,
                latitude: activity.latitude,
                // Default state
                user: user.token,
                discarded: false,
                clicked: false,
                date: date
            });
        });
    }

    return true;
}

/**
 * Updates an activity, if the update is important
 * position or title it returns true, otherwise
 * returns false
 * @param {*} old 
 * @param {*} activity 
 */
function updateActivity(old, activity) {
    console.log("UPDATE ACTIVITY");
    let change = false;
    let date = new Date();
    // Build dates
    if (
        old.title != activity.title ||
        old.longitude != activity.longitude ||
        old.latitude != activity.latitude
    ) {
        change = true;
    }

    if(activity.begin != 0 && activity.ending != 0){
        myRealm.write(() => {
            // Ids doesnt change
            old.author = activity.author;
            old.title = activity.title;
            old.type = activity.type;
            old.description = activity.description;
            old.img = activity.img;
            old.begin = activity.begin;
            old.ending = activity.ending;
            old.longitude = activity.longitude;
            old.latitude = activity.latitude;
            old.date = date;
        });
    }else{
        myRealm.write(() => {
            // Ids doesnt change
            old.author = activity.author;
            old.title = activity.title;
            old.type = activity.type;
            old.description = activity.description;
            old.img = activity.img;
            old.longitude = activity.longitude;
            old.latitude = activity.latitude;
            old.date = date;
        });
    }
    
    return change;
}

/**
 * Formats begin & end date to be used in activity
 * @param {*} begin 
 * @param {*} end 
 */
function buildDates(date0, date1) {
    let begin = new Date();
    let end = new Date(9999, 12, 31);    // This date represents activities that never finish
    if (date0 != 0 && date0 <= date1) {
        let dateB = date0.split('/');
        let dateE = date1.split('/');
        if (dateB.length == 5 && dateE.length == 5) {
            let aa = dateB[0];
            let mm = parseInt(dateB[1]) - 1;  // months -> [0-11]
            let dd = dateB[2];
            let hh = dateB[3];
            let mi = dateB[4];
            begin = new Date(aa, mm, dd, hh, mi);
            aa = dateE[0];
            mm = parseInt(dateE[1]) - 1;
            dd = dateE[2];
            hh = dateE[3];
            mi = dateE[4];
            end = new Date(aa, mm, dd, hh, mi);
        }
    }
    // Return json with dates
    return {
        begin: begin,
        end: end
    };
}

/**
 * Returns true if exists any activity
 * with the same activity.id provided
 */
function existsActivity(activity) {
    let activities = myRealm.objects('Activity')
        .filtered('id = "' + activity.id + '"');

    return (activities.length > 0);
}

/**
 * Retrieve the activity with 
 * the same activity.authorId & 
 * user provided
 */
function retrieveActivityAuthor(activity) {
    let token = currentToken();
    // If token or activity is null it cannot exit
    if (token == null || activity == null) {
        return null;
    }
    let activities = myRealm.objects('Activity')
        .filtered('authorId = "' + activity.authorId + '" AND '
            + ' author = "' + activity.author + '" AND '
            + 'user = "' + token + '"');
    // console.log(activities[0]);
    if (activities.length > 0) {
        return activities[0];
    } else {
        return null;
    }
}

/**
 * Marks activity as
 */
export function markActivityAs(activity, action, value) {
    // Check that it exits
    if (!existsActivity(activity)) return null;
    myRealm.write(() => {
        switch (action) {
            case 'CLICKED':
                activity.clicked = true;
                break;
            case 'SAVED':
                if (value) activity.state = 'saved';
                else activity.state = 'default';
                break;
            case 'DISCARDED':
                activity.discarded = true;
                break;
            case 'RATED':
                activity.rating = value;
                break;
        }
    });
}

export function deleteAllActivities() {
    myRealm.write(() => {
        let activities = myRealm.objects('Activity');
        myRealm.delete(activities);
    });
}

export function deleteActivityById(id) {
    myRealm.write(() => {
        myRealm.delete(myRealm.objectForPrimaryKey('Activity', id));
    });
}

// Filter activities depending on settings
export function filterActivities(user) {
    let activities = myRealm.objects('Activity');
    // Retrieve user settings
    let settings = myRealm.objects('Setting')
        .filtered('userId = "' + user + '" AND type="SETTINGS"');

    // Filter by settings
    settings.forEach(element => {
        if (!element.value) {
            e = element.key;
            e = e.replace(/ /g, "");

            // Discards activities which type is false in settings schema
            activities = activities.filtered('type !="' + e + '"');
        }
    });
    // Sort activities retrieved
    let order = retrieveOrder(user);
    switch (order) {
        case 'title':
            activities = activities.sorted('title');
            break;
        case 'stars':
            activities = activities.sorted([['rating', true], ['title', false]]); // Rating descending then title ascending
            break;
        case 'time':
            activities = activities.sorted('ending'); // Nearest end
            break;
        case 'distance':
            // Not implemented
            // activities = activities.sorted('rating');
            break;
        case 'type':
            activities = activities.sorted('type');
            break;
        default:
            break;
    }
    return activities;
}

/**
 * User Schema
 */
export const UserSchema = {
    name: 'User',
    primaryKey: 'name',
    properties: {
        name: 'string',
        token: 'string?',
        authToken: 'string',
        password: 'string?',
        provider: 'string',      // [ FACEBOOK | GOOGLE | ... ]
        genre: 'string',
        birth: 'string'
    }
};

/**
 * Replaces current user if exists for a new one
 * if does not exist, it is created
 */
export function replaceUser(user) {
    console.log("ReplaceUser: " + user);
    // Remove users
    removeUsers();
    // Creates a new one
    myRealm.write(() => {
        myRealm.create('User', {
            name: user.email,
            token: user.token,
            authToken: user.authToken,
            genre: user.genre,
            password: user.password,
            birth: user.birth,
            // no password
            provider: user.provider
        },true);
    });
    console.log("ReplaceUser: OK");
}

// Removes current user
export function removeUsers() {
    // Checks if exist any user
    myRealm.write(() => {
        let users = myRealm.objects('User');
        if (users.length > 0) {
            // Delete current user
            myRealm.delete(users);
        }
    });
}

// Retrieves current user
export function retrieveUser() {
    let users = myRealm.objects('User');
    if (users.length > 0) {
        return users[0];
    } else {
        return null;
    }
}

// Retrieves current user token
export function currentToken() {
    let user = retrieveUser();
    if (user == null) {
        return null;
    } else {
        return user.token;
    }
}

// Retrieves current user token
export function currentAuthToken() {
    let user = retrieveUser();
    if (user == null) {
        return null;
    } else {
        return user.authToken;
    }
}

/**
 * JSON object schema
 * Used for current context
 */
export const JSONSchema = {
    name: 'JSON',
    properties: {
        id: 'int',
        key: 'string', // [WEATHER | LOCATION | SENSORIZAR]
        json: 'string'
    }
};

export function removeContext() {
    myRealm.write(() => {
        let context = myRealm.objects('JSON');
        myRealm.remove(context);
    });
}

/**
 * Remove all previous context than id
 */
export function removePreviousContext(id) {

    let context = myRealm.objects('JSON').filtered("id <= $0", id);

    myRealm.write(() => {
        myRealm.remove(context);
    });
}


/**
 * Creates new or update JSON object (context)
 */
export function CreateContext(key, json) {
    console.log("CONTEXT UPDATING");
    let lastId = myRealm.objects('JSON').filtered('key =$0', key).sorted('id', true)[0];
    const maxId = lastId == null ? 0 : lastId.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    console.log("new id:" + newId);

    myRealm.write(() => {

        // Not exits; create it
        myRealm.create('JSON', {
            id: newId,
            key: key,
            json: json
        }, true);

    });
}


/**
 * Retrieves JSON object (context)
 */
export function retrieveContext(key) {
    let objects = myRealm.objects('JSON').filtered('key ="' + key + '"').sorted("id", true);
    if (objects.length == 0) {
        return null;
    } else {
        console.log(objects[0].id)
        return objects[0];
    }
}

/**
 * Retrieves Last JSON object (context)
 */
export function retrieveLastContext(key) {
    let objects = myRealm.objects('JSON').filtered('key ="' + key + '"').sorted('id', true);
    if (objects.length > 0) {
        return objects[0];
    } else {
        return null;
    }
}

/**
 * Parameter Schema
 */
export const ParameterSchema = {
    name: 'Parameter',
    properties: {
        userId: 'string',
        type: 'string',     // [ SETTINGS | PROFILE | ORDER ] strings permits future ampliations
        key: 'string',
        value: 'string',
    }
};

export function storeParameter(userId, type, key, value) {
    // Check if exits
    let par = retrieveParameter(userId, type, key);
    myRealm.write(() => {
        if (par != null) {
            // Update
            par.value = value;
        } else {
            // New, create
            myRealm.create('Parameter', {
                userId: userId,
                type: type,     // [ SETTINGS | PROFILE ] strings permits future ampliations
                key: key,
                value: value,
            });
        }
    });
}

export function retrieveParameter(userId, type, key) {
    let setting = myRealm.objects('Parameter').filtered(
        'userId="' + userId + '" AND type="' + type +
        '" AND ' + 'key="' + key + '"'
    );
    if (setting.length > 0)
        return setting[0];
    else
        return null;
}

export function retrieveValueParameter(userId, type, key) {
    let setting = myRealm.objects('Parameter').filtered(
        'userId="' + userId + '" AND type="' + type +
        '" AND ' + 'key="' + key + '"'
    );
    if (setting.length > 0)
        return setting[0].value;
    else
        return null;
}

// NEW: Irene

const KeyBoolSchema = {
    name: "KeyBool",
    embedded: true, // default: false
    properties: {
        key: "string",
        checked: "bool"
    },
};



/**
 * Context Rule Schema
 */
export const ContextRuleSchema = {
    name: 'ContextRule',
    primaryKey: 'id',
    properties: {
        id: 'int',
        type: 'string',
        name: 'string',
        gpsLatitude: 'double?',
        gpsLongitude: 'double?',
        locationError: 'int?',
        startTime: 'string?',
        endTime: 'string?',
        daysOfWeek: 'KeyBool[]',
        startDate: 'string?',
        endDate: 'string?',
        weatherStatus: 'KeyBool[]',
        minTemp: 'int?',
        maxTemp: 'int?',
        server: 'string?',
        measurement: 'string?',
        comparator: 'string?',
        value: 'float?',
        triggeringRules: {
            type: 'linkingObjects',
            objectType: 'TriggeringRule',
            property: 'contextRules'
        }
    }
};

export function storeContextRulesFromJson(json){
    console.log("storeContextRulesFromJson");
    myRealm.write(() => {
        json.forEach(obj => {
            myRealm.create('ContextRule', obj);
        });
    });
    console.log("storeContextRulesFromJson END");
};


// Store new Location Context Rule
export function storeLocationContextRule(name, gpsLatitude, gpsLongitude, meters) {

    // Create id 
    const lastContextRule = myRealm.objects('ContextRule').sorted('id', true)[0];
    const maxId = lastContextRule == null ? 0 : lastContextRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    myRealm.write(() => {
        let cr = myRealm.create('ContextRule', {
            id: newId,
            type: "Location",
            name: name,
            gpsLatitude: gpsLatitude,
            gpsLongitude: gpsLongitude,
            locationError: meters,
            startTime: null,
            endTime: null,
            startDate: null,
            endDate: null,
            minTemp: null,
            maxTemp: null
        });
    });
};


// Store new time-based rule
export function storeTimeBasedContextRule(name, startTime, endTime) {

    // Create id 
    const lastContextRule = myRealm.objects('ContextRule').sorted('id', true)[0];
    const maxId = lastContextRule == null ? 0 : lastContextRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: newId,
            type: "Time-Based",
            name: name,
            startTime: startTime,
            endTime: endTime,
            gpsLatitude: null,
            gpsLongitude: null,
            locationError: null,
            startDate: null,
            endDate: null,
            minTemp: null,
            maxTemp: null
        });
    });
};


// Store new calendar-based rule
export function storeCalendarBasedContextRule(name, daysOfWeek, startDate, endDate) {

    console.log("DAYS OF WEEK: ");
    console.log(daysOfWeek);

    // Create id 
    const lastContextRule = myRealm.objects('ContextRule').sorted('id', true)[0];
    const maxId = lastContextRule == null ? 0 : lastContextRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: newId,
            type: "Calendar-Based",
            startDate: startDate,
            endDate: endDate,
            daysOfWeek: daysOfWeek,
            name: name,
            startTime: null,
            endTime: null,
            gpsLatitude: null,
            gpsLongitude: null,
            locationError: null,
            minTemp: null,
            maxTemp: null
        });
    });
};

// Store new calendar-based rule
export function storeWeatherContextRule(name, weatherStatus, minTemp, maxTemp) {


    // Create id 
    const lastContextRule = myRealm.objects('ContextRule').sorted('id', true)[0];
    const maxId = lastContextRule == null ? 0 : lastContextRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: newId,
            type: "Weather",
            weatherStatus: weatherStatus,
            minTemp: minTemp,
            maxTemp: maxTemp,
            startDate: null,
            endDate: null,
            name: name,
            startTime: null,
            endTime: null,
            gpsLatitude: null,
            gpsLongitude: null,
            locationError: null
        });
    });
};

export function storeServerBasedContextRule(name, server, measurement, comparator, value) {
    console.log(`storeServerBasedContextRule`);


    // Create id 
    const lastContextRule = myRealm.objects('ContextRule').sorted('id', true)[0];
    const maxId = lastContextRule == null ? 0 : lastContextRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: newId,
            type: "Server-Based",
            name: name,
            server: server,
            measurement: measurement,
            comparator: comparator,
            value: value,
        });
    });
};


// Update an existing location context rule
export function updateLocationContextRule(id, name, gpsLatitude, gpsLongitude, locationError) {
    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: id,
            name: name,
            gpsLatitude: gpsLatitude,
            gpsLongitude: gpsLongitude,
            locationError: locationError
        }, true);
    });
};


// Update an existing time-based context rule
export function updateTimeBasedContextRule(id, name, startTime, endTime) {
    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: id,
            name: name,
            startTime: startTime,
            endTime: endTime
        }, true);
    });
};


// Update an existing calendar-based context rule
export function updateCalendarBasedContextRule(id, name, daysOfWeek, startDate, endDate) {
    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: id,
            name: name,
            daysOfWeek: daysOfWeek,
            startDate: startDate,
            endDate: endDate
        }, true);
    });
};

// Update an existing weather context rule
export function updateWeatherContextRule(id, name, weatherStatus, minTemp, maxTemp) {
    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: id,
            name: name,
            weatherStatus: weatherStatus,
            minTemp: minTemp,
            maxTemp: maxTemp,
        }, true);
    });
};

export function updateServerBasedContextRule(id, name, server,measurement, comparator, value) {
    myRealm.write(() => {
        myRealm.create('ContextRule', {
            id: id,
            name: name,
            server: server,
            measurement: measurement,
            comparator: comparator,
            value: value
        }, true);
    });
};

// Retrieve all context rules sorted by name
export function retrieveContextRules() {
    let contextRules = myRealm.objects('ContextRule').sorted('name');

    if (contextRules.length > 0) {
        return contextRules;
    } else {
        return null;
    }
}

// Returns the triggering rules associated with a context rule
export function retrieveTriggeringRulesFromContextRule(id) {
    let result = myRealm.objectForPrimaryKey('ContextRule', id);
    return result.triggeringRules;
}


// Retrieve all Location CR
export function retrieveLocationCR() {
    let locationCR = myRealm.objects('ContextRule').filtered("type == 'Location'");
    if (locationCR.length > 0) {
        return locationCR;
    } else {
        return null;
    }
}

// Delete a context rule by id
export function deleteContextRuleById(id) {
    myRealm.write(() => {
        myRealm.delete(myRealm.objectForPrimaryKey('ContextRule', id));
    });
}

// Checks if exists a context rule with that name
export function existsByNameContextRule(name) {
    let exist = myRealm.objects('ContextRule').filtered("name == $0", name);
    if (exist.length == 0) {
        return false;
    } else {
        return true;
    }
}


// Checks if exists a context rule with that name
export function existsByNameContextRuleAndId(id, name) {
    let exist = myRealm.objects('ContextRule').filtered("name == $0 AND id != $1", name, id);
    if (exist.length == 0) {
        return false;
    } else {
        return true;
    }
}


/*
*   TRIGGERING RULE SCHEMA
*/

export const TriggeringRuleSchema = {
    name: 'TriggeringRule',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        recommendationType: 'string',
        switchState: 'bool',
        contextRules: 'ContextRule[]',
        denyContextRule: 'bool[]'
    }
};

// Store new triggering rule
export function storeTriggeringRule(name, contextRulesArray, recommendationType) {
    console.log("storeTriggeringRule");

    // Create id 
    const lastTriggeringRule = myRealm.objects('TriggeringRule').sorted('id', true)[0];
    const maxId = lastTriggeringRule == null ? 0 : lastTriggeringRule.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    let contextRules = [];
    let denyContextRule = [];

    // Prepare array to insert into schema
    contextRulesArray.forEach((element) => {
        let items = myRealm.objects('ContextRule').filtered('id==$0', element.selection);
        contextRules.push(items[0]);

        denyContextRule.push(element.checked);
    })


    myRealm.write(() => {
        myRealm.create('TriggeringRule', {
            id: newId,
            name: name,
            recommendationType: recommendationType,
            switchState: true,
            contextRules: contextRules,
            denyContextRule: denyContextRule
        });
    });
};


// Update an existing triggering rule
export function updateTriggeringRule(id, name, contextRulesArray, recommendationType) {

    let contextRules = [];
    let denyContextRule = [];

    // Prepare array to insert into schema
    contextRulesArray.forEach((element) => {
        let items = myRealm.objects('ContextRule').filtered('id==$0', element.selection);
        contextRules.push(items[0]);

        denyContextRule.push(element.checked);
    })

    myRealm.write(() => {
        myRealm.create('TriggeringRule', {
            id: id,
            name: name,
            recommendationType: recommendationType,
            switchState: true,
            contextRules: contextRules,
            denyContextRule: denyContextRule
        }, true);
    });
};


// Retrieve all triggering rules sorted by name
export function retrieveTriggeringRules() {
    let triggeringRules = myRealm.objects('TriggeringRule').sorted('name');

    if (triggeringRules.length > 0) {
        return triggeringRules;
    } else {
        return null;
    }
}


// Retrieve all triggering rules sorted by name
export function retrieveTriggeringRulesSwitchOn() {
    let triggeringRules = myRealm.objects('TriggeringRule').filtered("switchState==true").sorted('name');

    if (triggeringRules.length > 0) {
        return triggeringRules;
    } else {
        return null;
    }
}

// Delete triggering rules by id
export function deleteTriggeringRuleById(id) {
    myRealm.write(() => {
        myRealm.delete(myRealm.objectForPrimaryKey('TriggeringRule', id));
    });
}


// Update the switch state of a triggering rule
export function updateStateTriggeringRule(id, ruleState) {
    myRealm.write(() => {
        myRealm.create('TriggeringRule', {
            id: id,
            switchState: ruleState
        }, true);
    });
};

// Checks if exists a triggering rule with that name
export function existsByNameTriggeringRule(name) {
    let exist = myRealm.objects('TriggeringRule').filtered("name == $0", name);
    if (exist.length == 0) {
        return false;
    } else {
        return true;
    }
}

// Checks if exists a triggering rule with that name
export function existsByNameTriggeringRuleAndId(id, name) {
    let exist = myRealm.objects('TriggeringRule').filtered("name == $0 AND id != $1", name, id);
    if (exist.length == 0) {
        return false;
    } else {
        return true;
    }
}

export function getActiveTriggeringRulesName(){
    let result = []
    let triggeringRules = myRealm.objects('TriggeringRule').filtered("switchState==true").sorted('name');
    if(triggeringRules.length > 0){
        triggeringRules.forEach(element => {
            result.push(element.name)
        })
    }
    return result;
}



/*
*   EXCLUSION SET SCHEMA
*/

// First item from recomendationType will be the highest priority 
export const ExclusionSetSchema = {
    name: 'ExclusionSet',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        pos: 'int',
        recommendationType: 'string[]'
    }
};

export function storeExclusionSetsFromJson(json){
    console.log("storeExclusionSetsFromJson");
    myRealm.write(() => {
        json.forEach(obj => {
            myRealm.create('ExclusionSet', obj);
        });
    });
    console.log("storeExclusionSetsFromJson END");
};

// Store a new exclusion set
export function storeExclusionSet(name, recommendationTypes) {
    console.log("storeExclusionSet");

    // Create id 
    const lastExclusionSet = myRealm.objects('ExclusionSet').sorted('id', true)[0];
    const maxId = lastExclusionSet == null ? 0 : lastExclusionSet.id;
    const newId = maxId == 0 ? 1 : maxId + 1;

    let recommendationTypeArray = [];
    recommendationTypes.forEach((element) => {
        recommendationTypeArray.push(element.selection);
    });
    console.log(recommendationTypeArray);

    //recommendationTypeArray = "test"

    myRealm.write(() => {
        myRealm.create('ExclusionSet', {
            id: newId,
            name: name,
            pos: newId,
            recommendationType: recommendationTypeArray
        });
    });
};


// Update an existing exclusion set
export function updateExclusionSet(id, name, pos, recommendationTypes) {
    console.log("upateExclusionSet");

    // Create id 
    let recommendationTypeArray = [];
    recommendationTypes.forEach((element) => {
        recommendationTypeArray.push(element.selection);
    });
    console.log(recommendationTypeArray);

    //recommendationTypeArray = "test"

    myRealm.write(() => {
        myRealm.create('ExclusionSet', {
            id: id,
            name: name,
            pos: pos,
            recommendationType: recommendationTypeArray
        }, true);
    });
};

// Update an existing exclusion set
export function updateExclusionSetPos(id, pos) {
    console.log("upateExclusionSet");

    //recommendationTypeArray = "test"

    myRealm.write(() => {
        myRealm.create('ExclusionSet', {
            id: id,
            pos: pos,
        }, true);
    });
};


// Retrieve exclusion set sorted by name
export function retrieveExclusionSets() {
    let exclusionSets = myRealm.objects('ExclusionSet').sorted('name');

    if (exclusionSets.length > 0) {
        return exclusionSets;
    } else {
        return null;
    }
}

// Retrieve exclusion set sorted by pos
export function retrieveExclusionSetsSortByPos() {
    let exclusionSets = myRealm.objects('ExclusionSet').sorted('pos');

    if (exclusionSets.length > 0) {
        return exclusionSets;
    } else {
        return null;
    }
}

export function retrieveExclusionSetByPos(pos) {
    let exclusionSet = myRealm.objects('ExclusionSet').filtered("pos==$0", pos);

    if (exclusionSet.length > 0) {
        return exclusionSet[0];
    } else {
        return null;
    }
}

// Delete exclusion set by id
export function deleteExclusionSetById(id) {
    myRealm.write(() => {
        myRealm.delete(myRealm.objectForPrimaryKey('ExclusionSet', id));
    });
}


/**
 * User Schema
 */
 export const TokenSchema = {
    name: 'Token',
    primaryKey: 'id',
    properties: {
        id: 'int',
        token: 'string?', // sensorizar, other external servers
        provider: 'string', 
        timestamp: 'date'
    }
};


export function storeServerToken(token, provider, date) {
    // Create id 
    const lastToken = myRealm.objects('Token').sorted('id', true)[0];
    const maxId = lastToken == null ? 0 : lastToken.id;
    const newId = maxId == 0 ? 1 : maxId + 1;
    let time = (new Date()).getTime();
    myRealm.write(() => {
        myRealm.create('Token', {
            id: newId,
            token: token,
            provider: provider,
            timestamp: date
        });
    });
}

// Retrieves current user serve token
export function retrieveCurrentToken() {
    let users = myRealm.objects('Token');
    if (users.length > 0) {
        return users[0];
    } else {
        return null;
    }
}



export const myRealm = new Realm({
    schema: [
        ActivitySchema,
        SettingsSchema,
        ParameterSchema,
        PositionSchema,
        UserSchema,
        JSONSchema,
        ContextRuleSchema,
        TriggeringRuleSchema,
        ExclusionSetSchema,
        KeyBoolSchema,
        TokenSchema
    ]
});