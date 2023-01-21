// Calendar context
import RNCalendarEvents from 'react-native-calendar-events';

import * as Schemas from "../realmSchemas/schema";

/**
 * Retrieves calendar events for this week
 */
export async function _getCalendarAsync() {
    try {
        console.log("_getCalendarAsync(): start");
        let permission = await RNCalendarEvents.authorizeEventStore();
        console.log("_getCalendarAsync(): " + permission);

        if (permission === 'authorized') {
            console.log("_getCalendarAsync(): authorized");
            let calendars = await RNCalendarEvents.findCalendars();

            console.log("_getCalendarAsync(): " + calendars);

            Schemas.CreateContext("CALENDARS", JSON.stringify(calendars));


            // Calendar events
            let calendarIds = [];
            const end = new Date();
            const start = new Date();
            end.setDate(start.getDate() + 7);   // Ends in 7 days

            for (let index = 0; index < calendars.length; index++) {
                calendarIds.push(calendars[index].id + ''); // Add (string) Calendar Id
            }

            console.log("_getCalendarAsync(): before events");
            let events = await RNCalendarEvents.fetchAllEvents(start, end, calendarIds);
            console.log("_getCalendarAsync():" + events);
            Schemas.CreateContext("EVENTS", JSON.stringify(events));
            console.log("_getCalendarAsync(): END");
        }
    } catch (error) {
        console.log("_getCalendarAsync(): ERROR");
        console.log(error);
    }
}