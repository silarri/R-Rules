package com.example.CARSEm.requests;

import java.util.List;

import com.example.CARSEm.model.Context;
import com.example.CARSEm.model.User;

public class AppContextRequest {
    private Context context;
    private List<String> categories;
    private User user;
    private String recommender;

    public AppContextRequest(Context context, List<String> categories, User user, String recommender) {
        this.context = context;
        this.categories = categories;
        this.user = user;
        this.recommender = recommender;
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

    public List<String> getCategories(){
        return categories;
    }

    public void setCategories(List<String> categories){
        this.categories = categories;
    }

    public String getRecommender() {
        return recommender;
    }

    public void setRecommender(String recommender) {
        this.recommender = recommender;
    }
}
