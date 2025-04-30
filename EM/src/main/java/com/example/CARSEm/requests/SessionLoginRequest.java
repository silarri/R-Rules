package com.example.CARSEm.requests;

public class SessionLoginRequest {
    private int user;
    private String pass;

    public SessionLoginRequest(int user, String pass) {
        this.user = user;
        this.pass = pass;
    }

    public int getUser() {
        return user;
    }

    public void setUser(int user) {
        this.user = user;
    }

    public String getPass() {
        return pass;
    }

    public void setPass(String pass) {
        this.pass = pass;
    }
}
