package com.carsproject;

import android.app.Service;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import java.util.Timer;
import java.util.TimerTask;

// Timer cada 30 segundos -> Lanza NewContextTask
public class ScheduleTaskService extends Service {
    // constant
    public static final long NOTIFY_INTERVAL =  30 * 1000; // 900 seconds
    // run on another Thread to avoid crash
    private Handler mHandler = new Handler();
    // timer handling
    private Timer mTimer = null;



    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        Log.d("Schedule", "onCreate scheduling");
        // cancel if already existed
        if (mTimer != null) {
            mTimer.cancel();
        } else {
            // recreate new
            mTimer = new Timer();
        }
        // schedule task
        mTimer.scheduleAtFixedRate(new Task(), 0, NOTIFY_INTERVAL);

    }

    class Task extends TimerTask {

        private static final String TAG = "SCHEDULETASKSERVICE";
        private String appName;


        @Override
        public void run() {
            // run on another thread
            mHandler.post(new Runnable() {

                @Override
                public void run() {
                    try {
                        // Schedule headless JS task
                        Context context = getApplicationContext();

                        Intent service = new Intent(context, SendContextTask.class);
                        Bundle bundle = new Bundle();

                        bundle.putString("foo", "bar");
                        service.putExtras(bundle);

                        // Lanzamos una nueva tarea NewContextTask
                        context.startService(service);
                        HeadlessJsTaskService.acquireWakeLockNow(context);
                    } catch (Exception e){
                        Log.d("SCHEDULETASKSERVICE", e.getMessage());
                    }
                }
            });
        }

    }
}

