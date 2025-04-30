package com.example.CARSEm.model;

import javax.persistence.*;

import java.io.Serializable;

import static javax.persistence.GenerationType.IDENTITY;
import static javax.persistence.GenerationType.SEQUENCE;

@Entity
@Table(name = "weather",schema = "public")
public class Weather implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int idweather;

    @Column(name = "temperature")
    private double temp;
    private int pressure;
    private int humidity;
    private double temp_min;
    private double temp_max;
    private String description;
    private double wind;
    private int clouds;

    // Weather es quien posee la clave foranea de la relación -> propietario
    @OneToOne
    @JoinColumn(name = "idcontext")
    private Context context;

    public Weather() {
    }

    public Weather(int idweather, double temp, int pressure, int humidity, double temp_min, double temp_max,
                   String description, double wind, int clouds, Context context) {
        this.idweather = idweather;
        this.temp = temp;
        this.pressure = pressure;
        this.humidity = humidity;
        this.temp_min = temp_min;
        this.temp_max = temp_max;
        this.description = description;
        this.wind = wind;
        this.clouds = clouds;
        this.context = context;
    }

    public double getTemp() {
        return temp;
    }

    public void setTemp(double temp) {
        this.temp = temp;
    }

    public int getPressure() {
        return pressure;
    }

    public void setPressure(int pressure) {
        this.pressure = pressure;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }

    public double getTemp_min() {
        return temp_min;
    }

    public void setTemp_min(double temp_min) {
        this.temp_min = temp_min;
    }

    public double getTemp_max() {
        return temp_max;
    }

    public void setTemp_max(double temp_max) {
        this.temp_max = temp_max;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getWind() {
        return wind;
    }

    public void setWind(double wind) {
        this.wind = wind;
    }

    public int getClouds() {
        return clouds;
    }

    public void setClouds(int clouds) {
        this.clouds = clouds;
    }

    public int getIdweather() {
        return idweather;
    }

    public void setIdweather(int idweather) {
        this.idweather = idweather;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    @Override
    public String toString() {
        return "Weather{" +
                "idweather=" + idweather +
                ", temp=" + temp +
                ", pressure=" + pressure +
                ", humidity=" + humidity +
                ", temp_min=" + temp_min +
                ", temp_max=" + temp_max +
                ", description='" + description + '\'' +
                ", wind=" + wind +
                ", clouds=" + clouds +
                ", context=" + context +
                '}';
    }
}
