package com.example.CARSEm.model;



import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "activity",schema = "public")
public class Activity implements Serializable {

    @Id
    private String id;

    @Column(name = "authorid")
    private String authorId;
    private String author;
    private String title;

    @Column(name = "category")
    private String type;
    private String description;
    private String img;

    private LocalDateTime begin;

    private LocalDateTime ending;

    private double latitude;
    private double longitude;

    private String subcategories;



    //TODO: Añadir relación many to many con entidad Share


    public Activity() {
    }

    public Activity(String id) {
        this.id = id;
    }

    public Activity(String id, String authorId, String author, String title, String type, String description, String img, LocalDateTime begin, LocalDateTime ending, double latitude, double longitude, String subcategories) {
        this.id = id;
        this.authorId = authorId;
        this.author = author;
        this.title = title;
        this.type = type;
        this.description = description;
        this.img = img;
        this.begin = begin;
        this.ending = ending;
        this.latitude = latitude;
        this.longitude = longitude;
        this.subcategories = subcategories;
    }

    public String getAuthorId() {
        return authorId;
    }

    public String getAuthor() {
        return author;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }

    public String getImg() {
        return img;
    }

    public LocalDateTime getBegin() {
        return begin;
    }

    public LocalDateTime getEnding() {
        return ending;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getId() {
        return id;
    }


    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String type) {
        this.type = type;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setBegin(LocalDateTime begin) {
        this.begin = begin;
    }

    public void setEnding(LocalDateTime ending) {
        this.ending = ending;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubcategories() {
        return subcategories;
    }

    public void setSubcategories(String subcategories) {
        this.subcategories = subcategories;
    }
}
