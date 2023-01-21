package com.example.CARSEm.model;


import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "context",schema = "public")
public class Context implements Serializable {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int idcontext;

    private LocalDateTime timestamp;

    @OneToOne(mappedBy = "context")
    private Location location;

    @OneToOne(mappedBy = "context")
    private Weather weather;

    @OneToMany(mappedBy = "context")
    private List<Event> events;

    public Context() {
    }

    public Context(int idcontext, LocalDateTime timestamp, Location location, Weather weather, List<Event> events) {
        this.idcontext = idcontext;
        this.timestamp = timestamp;
        this.location = location;
        this.weather = weather;
        this.events = events;
    }

    public int getIdcontext() {
        return idcontext;
    }

    public void setIdcontext(int idcontext) {
        this.idcontext = idcontext;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Weather getWeather() {
        return weather;
    }

    public void setWeather(Weather weather) {
        this.weather = weather;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    @Override
    public String toString() {
        return "Context{" +
                "id=" + idcontext +
                ", timestamp=" + timestamp +
                ", location=" + location +
                ", weather=" + weather +
                ", events=" + events +
                '}';
    }
}
