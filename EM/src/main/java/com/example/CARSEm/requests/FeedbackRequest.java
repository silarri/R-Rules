package com.example.CARSEm.requests;

import com.example.CARSEm.model.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class FeedbackRequest {

    private Context context;
    private User user;
    private Activity activity;
    private Boolean clicked;
    private Boolean saved;
    private Boolean discarded;
    private int rate;

    public FeedbackRequest() {
    }

    public FeedbackRequest(Context context, User user, Activity activity, Boolean clicked, Boolean saved, Boolean discarded, int rate) {
        this.context = context;
        this.user = user;
        this.activity = activity;
        this.clicked = clicked;
        this.saved = saved;
        this.discarded = discarded;
        this.rate = rate;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Boolean getClicked() {
        return clicked;
    }

    public void setClicked(Boolean clicked) {
        this.clicked = clicked;
    }

    public Boolean getSaved() {
        return saved;
    }

    public void setSaved(Boolean saved) {
        this.saved = saved;
    }

    public Boolean getDiscarded() {
        return discarded;
    }

    public void setDiscarded(Boolean discarded) {
        this.discarded = discarded;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }
}
