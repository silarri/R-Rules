package com.carsproject;


import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Build;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;;

import org.apache.log4j.BasicConfigurator;



public class SiddhiClientModule extends ReactContextBaseJavaModule {

    private static final String TAG = "SIDDHI CLIENT MODULE";
    private SiddhiService siddhiService;
    private boolean mBound = false;
    private String appName;
    // private SiddhiAppController appController;
    private Context context;

    /** Defines callbacks for service binding, passed to bindService() */
    private ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName className,
                                       IBinder service) {
            Log.d(TAG, "onServiceConnected");
            // We've bound to LocalService, cast the IBinder and get SiddhiService instance
            SiddhiService.SiddhiBinder binder = (SiddhiService.SiddhiBinder) service;
            siddhiService = binder.getService();
            mBound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            mBound = false;
        }

    };

    /*
    *   Constructor
    */
    public SiddhiClientModule(ReactApplicationContext reactContext) {
        super(reactContext);

        Log.d(TAG,"constructor");
        BasicConfigurator.configure();
        context = reactContext;
    }


    /*
    *   Connext to the service. We call startService so the service won't die when components unBind
    */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public void connect() {
        Log.d(TAG,"connect()");

        context = getReactApplicationContext();
        Intent intent = new Intent(context, SiddhiService.class);
        context.startService(intent);

        // Connect with Siddhi
        context.bindService(intent,connection, Context.BIND_AUTO_CREATE);
    }


    /*
    *   Start Siddhi Application
    */
    @ReactMethod()
    public void startApp(String app) {
        Log.d(TAG,"startApp()");
        if (mBound){
            try {
                appName = siddhiService.startSiddhiApp(app);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }


    /*
    *   Stop Siddhi Application
    */
    @ReactMethod()
    public void stopApp() {
        Log.d(TAG,"stopApp()");
        if(mBound) {
            try {
                siddhiService.stopSiddhiApp(appName);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        }
    }

    /*
    *   Send event to Siddhi for processing
    */
    @ReactMethod()
    public void sendEvent(String context) {
        if (mBound) {
            Log.d(TAG, "sendEvent()");
            siddhiService.sendEvent(context);
        }
    }

    /*
    *    Get new result from Siddhi. It runs a thread for not blocking app because we invoke a wait()
     */
    @ReactMethod
    public void getResult(Callback callback) {
        if(mBound){
            // Passing callback because we need it for returning result to JS code (react-native code)
            Runnable r = new Task(callback);
            new Thread(r).start();
        }
    }

    @ReactMethod
    public void isStopped(Callback callback){
        if(mBound){
            Log.d(TAG, "IS BOUND");
            Log.d(TAG, "isStopped()");
            Boolean isStopped = siddhiService.isStopped();
            callback.invoke(isStopped);
        }else{
            Log.d(TAG, "IS NOT BOUND");
        }
    }

    @Override
    public String getName() {
        return "SiddhiClientModule";
    }


    /*
    *   Task for waiting and getting a new result from Siddhi (for Thread)
     */
    private class Task implements Runnable {

        Result result;
        Callback callback;

        public Task(Callback callback) {
            // store parameter for later user
            this.callback = callback;
        }

        @Override
        public void run() {
            Log.d(TAG, "Running thread for getting result");
            String r = "";
            try {
                result = siddhiService.getResultObject();

                synchronized (result){
                    Log.d(TAG, "Before THREAD WHILE");
                    r = result.getResult();
                    while(r.equals("")) {
                        Log.d(TAG, "Going to wait");
                        result.wait();
                        r = result.getResult();
                        Log.d(TAG, "Get result done");
                    }
                }
            } catch (RemoteException | InterruptedException e) {
                e.printStackTrace();
            }
            Log.d(TAG,"Thread while ended");
            Log.d(TAG,r);
            callback.invoke(r);
        }
    }
}
