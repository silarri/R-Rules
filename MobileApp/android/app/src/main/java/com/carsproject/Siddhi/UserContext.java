package com.carsproject.Siddhi;

import com.google.gson.JsonObject;

import java.util.List;

public class UserContext {
    private JsonObject UserContext;
    private List<JsonObject> Preferences;
    private List<JsonObject> Observations;

    public UserContext(JsonObject userContext, List<JsonObject> preferences, List<JsonObject> observations) {
        UserContext = userContext;
        Preferences = preferences;
        Observations = observations;
    }
}
