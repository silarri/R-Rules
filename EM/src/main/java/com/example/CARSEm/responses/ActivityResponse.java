package com.example.CARSEm.responses;

public class ActivityResponse {

    String id;
    String authorId;
    String author;
    String title;
    String type;
    String description;
    String img;
    String begin;
    String end;
    double latitude;
    double longitude;

    public ActivityResponse(String id, String authorId, String author, String title, String type, String description,
                            String img, String begin, String end, double latitude, double longitude) {
        this.id = id;
        this.authorId = authorId;
        this.author = author;
        this.title = title;
        this.type = type;
        this.description = description;
        this.img = img;
        this.begin = begin;
        this.end = end;
        this.latitude = latitude;
        this.longitude = longitude;
    }


    public String getId() {
        return id;
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

    public String getBegin() {
        return begin;
    }

    public String getEnd() {
        return end;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }


    public void setId(String id) {
        this.id = id;
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

    public void setType(String type) {
        this.type = type;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setBegin(String begin) {
        this.begin = begin;
    }

    public void setEnd(String end) {
        this.end = end;
    }

    public void setImg(String img) {
        this.img = img;
    }

}
