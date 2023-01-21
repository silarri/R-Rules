package com.carsproject;



import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import com.carsproject.Siddhi.SiddhiAppManager;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;


public class SiddhiService extends Service {

    private static final String TAG = "SIDDHI SERVICE";
    private final IBinder binder = new SiddhiBinder();
    private Intent intent;

    private Boolean isStopped = true;


    // Hacemos que no sea necesario instanciar la clase
    private static SiddhiService siddhiService;
    //private SiddhiRemoteService siddhiRemoteService;

    private SiddhiAppManager siddhiAppManager = new SiddhiAppManager(this);


    public class SiddhiBinder extends Binder {
        SiddhiService getService() {
            // Return this instance of LocalService so clients can call public methods
            return SiddhiService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }


    /*
    * Public methods for clients
    */
    public String startSiddhiApp(String siddhiApp) throws RemoteException {
        if(isStopped){
            Log.d(TAG, "startSiddhiApp()");
            siddhiAppManager.startSiddhiApp(siddhiApp);
            isStopped = false;
            return siddhiApp;
        }else {
            Log.d(TAG, "startSiddhiApp does nothing bc not stopped");
            return "";
        }
    }

    public void stopSiddhiApp(String siddhiAppName) throws RemoteException {
        if(!isStopped){
            Log.d(TAG, "stopSiddhiApp()");
            isStopped = true;
            siddhiAppManager.stopSiddhiApp();
        }else{
            Log.d(TAG, "stopSiddhiApp does nothing bc is already stopped");
        }
    }

    public void sendEvent(String context){
        if(!isStopped){
            Log.d(TAG, "sendEvent()");
            siddhiAppManager.sendEvent(context);
        }else{
            Log.d(TAG, "stopSiddhiApp does nothing bc is already stopped");
        }
    }

    public String getResult(){
        return siddhiAppManager.getResult();
    }

    public Result getResultObject() throws RemoteException {
        return siddhiAppManager.getResultObject();
    }

    public Boolean isStopped(){
        return isStopped;
    }


    @Override
    public void onCreate(){
        super.onCreate();
        intent = new Intent("SiddhiService");
        siddhiService = this;

        Log.d(TAG, "onCreate()");
        // Iniciamos la aplicación Siddhi
        //siddhiAppManager.startSiddhiApp("");
        //isStopped = false;
    }

    @Override
    public void onDestroy(){
        super.onDestroy();
        siddhiService = null;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId){


        Notification notification = createNotification("es.unizar.eina.siddhibackground",
                "SIDDHI_CHANNEL", "Siddhi",
                "Siddhi Platform Service started",R.drawable.icon,100,false);

        startForeground(100,notification);
        return START_STICKY;
    }


    // Copied from: https://github.com/siddhi-io/siddhi-android-platform/blob/master/siddhi-android-platform/src/main/java/org/wso2/siddhi/android/platform/SiddhiAppService.java
    @RequiresApi(api = Build.VERSION_CODES.M)
    public Notification createNotification(String notificationChanelId,
                                           String notificationChannelName, String notificationTitle,
                                           String notificationBody, int notificationIcon,
                                           int notificationId,
                                           boolean enableStyle) {
        //create android notifications
        NotificationManager notificationManager = (NotificationManager) getSystemService(
                Context.NOTIFICATION_SERVICE);
        Notification notification;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(notificationChanelId,
                    notificationChannelName, NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
            Notification.Builder builder = new Notification.Builder(getApplicationContext(),
                    notificationChanelId)
                    .setContentTitle(notificationTitle)
                    .setContentText(notificationBody)
                    .setSmallIcon(notificationIcon)
                    .setAutoCancel(true);
            if (enableStyle) {
                builder.setStyle(new Notification.BigTextStyle().bigText(notificationBody));
            }
            notification = builder.build();
        } else {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(this,
                    notificationChannelName)
                    .setContentTitle(notificationTitle)
                    .setContentText(notificationBody)
                    .setSmallIcon(notificationIcon);
            if (enableStyle) {
                builder.setStyle(new NotificationCompat.BigTextStyle().bigText(notificationBody));
            }
            notification = builder.build();
        }
        notificationManager.notify(notificationId, notification);
        return notification;
    }

}


