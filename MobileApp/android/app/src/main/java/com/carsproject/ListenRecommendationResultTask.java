package com.carsproject;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import java.time.LocalDateTime;

// Headless.js task for send events and get result
public class ListenRecommendationResultTask extends HeadlessJsTaskService {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        Bundle extras = intent.getExtras();

        Log.v("ResultTask", "Hello that: " + LocalDateTime.now().toString());

        if (extras != null) {

            return new HeadlessJsTaskConfig(
                    "ListenRecommendationResultTask",
                    Arguments.fromBundle(extras),
                    0000, // timeout for the task
                    true // optional: defines whether or not  the task is allowed in foreground. Default is false
            );
        }
        return null;
    }

}
