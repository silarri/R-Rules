package com.carsproject.Siddhi;


import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;


import com.carsproject.Result;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import io.siddhi.core.SiddhiAppRuntime;
import io.siddhi.core.SiddhiManager;
import io.siddhi.core.event.Event;
import io.siddhi.core.query.output.callback.QueryCallback;
import io.siddhi.core.stream.input.InputHandler;
import io.siddhi.core.stream.output.StreamCallback;

public class SiddhiAppManager {

    private static final String TAG = "SIDDHIAPPMANAGER";

    // Siddhi Management
    private SiddhiManager siddhiManager;
    private SiddhiAppRuntime siddhiAppRuntime;
    InputHandler inputHandler;

    // Attributes
    private String appName;
    private String app;
    private Context context;

    // context_id, recommendation1, recommendation2, recommendation3...
    //private String result;
    private Result result;

    // Experiments
    private long startTime;
    private List<Long> timeList;

    /*
    *   Constructor
    */
    public SiddhiAppManager(Context context) {
        // SiddhiManager
        this.siddhiManager = new SiddhiManager();
        this.context = context;
        //this.result = "start";
        this.result = new Result();
        result.setResult("start");
        startTime = 0;
        timeList = new ArrayList<>();
    }

    /*
    *   Starts Siddhi
    */
    public String startSiddhiApp(String newApp){
        Log.d(TAG, "startSiddhiApp");

        if(newApp.equals("")){
            // Read siddhi rules from assets file
            readSiddhiRulesFromFile();
        }else{
            app = newApp;
        }

        //Log.d(TAG, app);
        // We create the siddhi execution runtime
        siddhiAppRuntime = siddhiManager.createSiddhiAppRuntime(app);
        appName = siddhiAppRuntime.getName();

        // We declare an inputHandler to send "Context" events to siddhi
        inputHandler = siddhiAppRuntime.getInputHandler("Context");

        // Start the app
        siddhiAppRuntime.start();

        // Receive the results in group: context_id, recommendation1, recommendation2, recommendation3...
        siddhiAppRuntime.addCallback("finalResults", new QueryCallback() {
            @Override
            public void receive(long timestamp, Event[] inEvents, Event[] removeEvents) {
                // long endTime = System.currentTimeMillis();
                String data = "";
                //EventPrinter.print(inEvents);
                int len = inEvents[0].getData().length;
                //Log.d(TAG, "Number of events:" + len );
                for (int i = 0;i<len;i++){
                    data = data + (String) inEvents[0].getData(i) + ",";
                }

                synchronized (result){
                    Log.d(TAG, "Going to set result");
                    result.setResult(data);
                    result.notify();
                    Log.d(TAG, "Notify done");
                }

                //Log.d(TAG, "RESULT: " + result);
                //Log.d(TAG, "EXECUTION TIME: " + (endTime - startTime));
            }
        });

        // Receive each recommendation triggering rule
        siddhiAppRuntime.addCallback("Results", new StreamCallback() {
            @Override
            public void receive(Event[] events) {
                //Log.d(TAG, "RESULT ARRIVED");

                // We keep the end time
                long endTime = System.currentTimeMillis();
                //EventPrinter.print(events);
                //Log.d(TAG, "RESULT: " + result);

                // We calculate the latency since event was sent
                //Log.d(TAG, "EXECUTION TIME: " + (endTime - startTime));
                //timeList.add(endTime - startTime);

                // We print all times until the moment
                //Log.d(TAG, Arrays.toString(timeList.toArray()));
            }
        });

        return appName;
    }

    /*
    *   Detiene Siddhi
    */
    public void stopSiddhiApp(){
        Log.d(TAG, "STOPPED");
        siddhiAppRuntime.shutdown();
    }

    /*
    *   Send event to siddhi
    */
    public void sendEvent(String context){
        Log.d(TAG, "EVENT SENT");

        try {
            // We keep the start time
            startTime = System.currentTimeMillis();
            inputHandler.send(new Object[]{context});
            Log.d(TAG, "EVENT SENT: DONE");

        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    /*
    *   Get result
    */
    public String getResult(){
        String r = result.getResult();
        //result.setResult("");
        return r;
    }

    public Result getResultObject(){
        return result;
    }

    /*
    *   Read rules from file /assets/example1.txt
    */
    private void readSiddhiRulesFromFile(){
        BufferedReader file = null;
        try {
            file = new BufferedReader(new InputStreamReader(context.getAssets().open("example.txt")));
            app = readAllLines(file);

            Log.d(TAG, app);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /*
    *   Read lines auxiliar
    */
    private String readAllLines(BufferedReader reader) throws IOException {
        StringBuilder content = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            content.append(line);
            content.append(System.lineSeparator());
        }

        return content.toString();
    }

    /*
    *   Create an example of "Context" event
    */
    private UserContext createUserContext(){
        JsonObject UserContext = new JsonObject();
        JsonObject Preference = new JsonObject();
        JsonObject Preference2 = new JsonObject();
        JsonObject Preference3 = new JsonObject();
        JsonObject Observation = new JsonObject();


        UserContext.addProperty("hasId", "22");
        UserContext.addProperty("date","2021/07/28");
        UserContext.addProperty("time", "11:40:00");
        UserContext.addProperty("status", "onHolidays");
        UserContext.addProperty("atHome", "no");

        Preference.addProperty("typeOf", "Shows");
        Preference.addProperty("where", "Open-Air");

        Preference2.addProperty("typeOf", "Music");
        Preference2.addProperty("where", "Indoor");

        Preference3.addProperty("typeOf", "Culture");
        Preference3.addProperty("where", "Both");

        Observation.addProperty("observedBy","sensorTEst");
        Observation.addProperty("featureOfInterest","Me");
        Observation.addProperty("observedProperty","WeatherStatus");
        Observation.addProperty("observationValue","Snow");
        Observation.addProperty("timeOfMeasurement","10:00:00");

        List<JsonObject> Preferences = new ArrayList<>();
        Preferences.add(Preference);
        Preferences.add(Preference2);
        Preferences.add(Preference3);

        List<JsonObject> Observations = new ArrayList<>();
        Observations.add(Observation);
        UserContext userContext = new UserContext(UserContext, Preferences,Observations);

        return userContext;
    }
}
