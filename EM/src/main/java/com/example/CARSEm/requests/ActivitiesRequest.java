package com.example.CARSEm.requests;

import com.example.CARSEm.model.Activity;

import java.util.List;

public class ActivitiesRequest {
    private List<Activity> activities;

    public ActivitiesRequest() {
    }

    public ActivitiesRequest(List<Activity> activities) {
        this.activities = activities;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}
