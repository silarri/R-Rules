package com.carsproject;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import android.util.Log;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import java.time.LocalDateTime;

// Headless.js task for send events and get result
public class SendContextTask extends HeadlessJsTaskService {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        Bundle extras = intent.getExtras();

        Log.v("CARS", "Hello that: " + LocalDateTime.now().toString());

        if (extras != null) {

            return new HeadlessJsTaskConfig(
                    "SendContextTask",
                    Arguments.fromBundle(extras),
                    5000, // timeout for the task
                    true // optional: defines whether or not  the task is allowed in foreground. Default is false
            );
        }
        return null;
    }

}
