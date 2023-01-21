package com.example.CARSEm.requests;

import java.util.List;

public class RecommendationRequest {
    List<String> recommendations;
    // User
    // Context


    public RecommendationRequest() {
    }

    public RecommendationRequest(List<String> recommendations) {
        this.recommendations = recommendations;
    }

    public List<String> getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(List<String> recommendations) {
        this.recommendations = recommendations;
    }
}
