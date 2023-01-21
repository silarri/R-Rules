var PushNotification = require('react-native-push-notification-ce');
// DB
import * as Schemas from "../realmSchemas/schema";

export function configureNotifications() {
    PushNotification.configure({

        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            // console.log('TOKEN:', token);
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);

            // process the notification
            try {         
                // Notifications are not transporting activities' info anymore
                // It is going to be communicated via http request
                processItem(notification);
            } catch (error) {
                console.log(error);
            }
        },

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
        senderID: "19740375620",

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
          * (optional) default: true
          * - Specified if permissions (ios) and token (android and ios) will requested or not,
          * - if not, you must call PushNotificationsHandler.requestPermissions() later
          */
        requestPermissions: true,
    });

    PushNotification.appStart() // Tells the bridge when the app has started so it can display tapped notifications
};

/**
 * Process the item received with the notification, returns false
 * if cannot create the activity, otherwise it returns true
 * @param {*} items : may use the same structure as
 * Activity Schema
 */
export function processItem(item) {
    console.log(`CREATE NOTIFICATION ${item.id}: ${JSON.stringify(item)}`);
    // Check mandatory attributes & others
    if (item.id == null) return false;
    console.log(`CREATE NOTIFICATION : 1`);

    if (item.authorId == null) return false;
    console.log(`CREATE NOTIFICATION : 2`);

    if (item.author == null) return false;
    console.log(`CREATE NOTIFICATION : 3`);

    if (item.title == null) return false;
    console.log(`CREATE NOTIFICATION : 4`);

    if (item.description == null) return false;
    console.log(`CREATE NOTIFICATION : 5`);

    // Type
    if (item.type == null) item.type = 'Others';
    // Coords
    console.log(`CREATE NOTIFICATION : 6`);

    if (item.latitude == null) item.latitude = 0;
    console.log(`CREATE NOTIFICATION : 7`);

    if (item.longitude == null) item.longitude = 0;
    console.log(`CREATE NOTIFICATION : 8`);

    // Dates
    if (item.begin == null) item.begin = 0;
    console.log(`CREATE NOTIFICATION : 9`);

    if (item.ending == null) item.ending = 0;
    console.log(`CREATE NOTIFICATION : 10`);

    
    // Create activity
    let notification = {};
    notification.id = item.id;
    notification.authorId = item.authorId;
    notification.author = item.author;
    notification.title = item.title;
    notification.type = item.type;
    notification.description = item.description;
    notification.img = item.img;
    notification.begin = item.begin;
    notification.ending = item.ending;
    notification.longitude = item.longitude;
    notification.latitude = item.latitude;
    notification.user = Schemas.retrieveUser();

    console.log("Activity to store:");

    // Store activity in database
    return Schemas.storeActivity(notification);
}

export function localScheduledTest() {

    PushNotification.localNotificationSchedule({
        message: "Tap on me please ;)", // (required)
        date: new Date(Date.now() + (5 * 1000)), // in 5 secs
        largeIcon: "ic_cars_fore",
        smallIcon: "ic_cars_fore",
    });
}

export function localTest() {

    PushNotification.localNotification({
        autoCancel: true,
        largeIcon: "ic_launcher_foreground",
        smallIcon: "ic_launcher_foreground",
        color: "green",
        vibrate: true,
        vibration: 300,
        title: "CARS Notification",
        message: "You may have new activities",
        playSound: true,
    });
}

export function activityUpdate() {

    PushNotification.localNotification({
        autoCancel: true,
        largeIcon: "ic_cars_fore",
        smallIcon: "ic_cars_fore",
        title: "New items available",
        message: "Check new activities",
        color: "green",
        vibrate: true,
        vibration: 300,
    });
}