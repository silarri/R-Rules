package com.example.CARSEm.model;

import org.apache.tomcat.jni.Local;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import static javax.persistence.GenerationType.IDENTITY;
import static javax.persistence.GenerationType.SEQUENCE;


@Entity
@Table(name = "event",schema = "public")
public class Event implements Serializable  {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int idevent;

    private String description;
    private String calendar;
    private String title;

    @Column(name = "startdate")
    private LocalDateTime startDate;

    @Column(name="enddate")
    private LocalDateTime endDate;

    @Column(name = "allday")
    private Boolean allDay;
    private String location;
    private String availability;



    // Event tiene la FK de Context
    @ManyToOne
    @JoinColumn(name = "idcontext")
    private Context context;

    public Event() {
    }

    public Event(int idevent, String description, String calendar, String title, LocalDateTime startDate,
                 LocalDateTime endDate, Boolean allDay, String location, String availability, Context context) {
        this.idevent = idevent;
        this.description = description;
        this.calendar = calendar;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.allDay = allDay;
        this.location = location;
        this.availability = availability;
        this.context = context;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCalendar() {
        return calendar;
    }

    public void setCalendar(String calendar) {
        this.calendar = calendar;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Boolean getAllDay() {
        return allDay;
    }

    public void setAllDay(Boolean allDay) {
        this.allDay = allDay;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public int getIdevent() {
        return idevent;
    }

    public void setIdevent(int idevent) {
        this.idevent = idevent;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    @Override
    public String toString() {
        return "Event{" +
                "idevent=" + idevent +
                ", description='" + description + '\'' +
                ", calendar='" + calendar + '\'' +
                ", title='" + title + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", allDay=" + allDay +
                ", location='" + location + '\'' +
                ", availability='" + availability + '\'' +
                ", context=" + context +
                '}';
    }
}
