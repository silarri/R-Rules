package com.carsproject;

import android.os.Parcel;
import android.os.Parcelable;

public class Result implements Parcelable {
    private String result;

    public Result(){
        result = null;
    }

    protected Result(Parcel in) {
        result = in.readString();
    }

    public static final Creator<Result> CREATOR = new Creator<Result>() {
        @Override
        public Result createFromParcel(Parcel in) {
            return new Result(in);
        }

        @Override
        public Result[] newArray(int size) {
            return new Result[size];
        }
    };

    public void setResult(String result){
        this.result = result;
    }

    public String getResult(){
        String r = this.result;
        // Initialize the variable
        this.result = "";
        return r;
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(result);
    }
}
