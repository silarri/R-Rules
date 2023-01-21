package com.carsproject;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.calendarevents.CalendarEventsPackage;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.apache.log4j.BasicConfigurator;

public class MainActivity extends ReactActivity {

    private boolean serviceRunning = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

        BasicConfigurator.configure();
        //startService(new Intent(this, SiddhiService.class));
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "CARSProject";
    }

    /**
     * Starts background process
     */
    @Override
    public void onPause() {
        super.onPause();

        // Checks if service has started
        if (!serviceRunning){
            serviceRunning = true;
            //startService(new Intent(this, SiddhiService.class));
            Log.d("SERVICES ", "STARTED");
            startService(new Intent(this, ScheduleTaskService.class));

            Context context = getApplicationContext();

            Intent service = new Intent(context, ListenRecommendationResultTask.class);
            Bundle bundle = new Bundle();

            bundle.putString("foo", "bar");
            service.putExtras(bundle);

            // Lanzamos una nueva tarea ListenRecommendationResultTask
            context.startService(service);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        CalendarEventsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults);
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
