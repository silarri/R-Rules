package com.example.CARSEm.requests;


public class AppHelloRequest {

    public static class Settings{

        public class Location{
            private boolean setting;
            private boolean accuracy;

            public Location() {
            }

            public Location(boolean setting, boolean accuracy) {
                this.setting = setting;
                this.accuracy = accuracy;
            }

            public boolean isSetting() {
                return setting;
            }

            public void setSetting(boolean setting) {
                this.setting = setting;
            }

            public boolean isAccuracy() {
                return accuracy;
            }

            public void setAccuracy(boolean accuracy) {
                this.accuracy = accuracy;
            }
        }

        private boolean user;
        private Location location;
        private boolean weather;
        private boolean calendar;

        public Settings() {
        }

        public Settings(boolean user, Location location, boolean weather, boolean calendar) {
            this.user = user;
            this.location = location;
            this.weather = weather;
            this.calendar = calendar;
        }

        public boolean isUser() {
            return user;
        }

        public void setUser(boolean user) {
            this.user = user;
        }

        public Location isLocation() {
            return location;
        }

        public void setLocation(Location location) {
            this.location = location;
        }

        public boolean isWeather() {
            return weather;
        }

        public void setWeather(boolean weather) {
            this.weather = weather;
        }

        public boolean isCalendar() {
            return calendar;
        }

        public void setCalendar(boolean calendar) {
            this.calendar = calendar;
        }
    }

    private int user;
    private Settings settings;


    public AppHelloRequest(int user, Settings  settings) {
        this.user = user;
        this.settings = settings;
    }

    public int getUser() {
        return user;
    }

    public void setUser(int user) {
        this.user = user;
    }

    public Settings getSettings() {
        return settings;
    }

    public void setSettings(Settings settings) {
        this.settings = settings;
    }
}
