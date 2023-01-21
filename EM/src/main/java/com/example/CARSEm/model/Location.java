package com.example.CARSEm.model;

import javax.persistence.*;

import java.io.Serializable;

import static javax.persistence.GenerationType.IDENTITY;
import static javax.persistence.GenerationType.SEQUENCE;

@Entity
@Table(name = "location",schema = "public")
public class Location implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int idlocation;

    private Boolean mocked;
    private int speed;
    private double altitude;
    private double longitude;
    private double latitude;

    // Location es quien posee la clave foranea de la relación -> propietario
    @OneToOne
    @JoinColumn(name = "idcontext")
    private Context context;

    public Location() {
    }

    public Location(int idlocation, Boolean mocked, int speed, double altitude,
                    double longitude, double latitude, Context context) {
        this.idlocation = idlocation;
        this.mocked = mocked;
        this.speed = speed;
        this.altitude = altitude;
        this.longitude = longitude;
        this.latitude = latitude;
        this.context = context;
    }

    public Boolean getMocked() {
        return mocked;
    }

    public void setMocked(Boolean mocked) {
        this.mocked = mocked;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public double getAltitude() {
        return altitude;
    }

    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public int getIdlocation() {
        return idlocation;
    }

    public void setIdlocation(int idlocation) {
        this.idlocation = idlocation;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    @Override
    public String toString() {
        return "Location{" +
                "idlocation=" + idlocation +
                ", mocked=" + mocked +
                ", speed=" + speed +
                ", altitude=" + altitude +
                ", longitude=" + longitude +
                ", latitude=" + latitude +
                ", context=" + context +
                '}';
    }
}
