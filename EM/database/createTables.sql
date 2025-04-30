DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS Weather;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Share;
DROP TABLE IF EXISTS Context;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS "user";

-- TABLAS PRINCIPALES


CREATE TABLE "user" (
    id          SERIAL PRIMARY KEY ,
    email       varchar(100) NOT NULL ,
    password    varchar(100) NOT NULL ,
    genre       varchar(20),
    birth       timestamp
);

CREATE TABLE Admin(
    id              varchar(120)    PRIMARY KEY,
    password        varchar(45),
    rol             varchar(45)
);

create table activity
(
    id            varchar(45)  not null
        constraint activity_pkey
            primary key,
    title         varchar(140) not null,
    authorid      varchar(45)  not null,
    author        varchar(45)  not null,
    description   text         not null,
    img           varchar(255),
    category      varchar(45),
    begin         timestamp,
    ending        timestamp,
    longitude     double precision,
    latitude      double precision,
    subcategories text
);

CREATE TABLE Context(
    idContext       serial          PRIMARY KEY,
    timestamp       timestamp       NOT NULL
);


-- TABLAS SECUNDARIAS
CREATE TABLE Share(
    idActivity      varchar(45),
    idUser          SERIAL,
    CONSTRAINT fk_activity FOREIGN KEY (idActivity) references Activity(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (idUser) references "user"(id) ON DELETE CASCADE,
    CONSTRAINT pk_share PRIMARY KEY (idActivity,idUser)
);

CREATE TABLE Feedback(
    idActivity      varchar(45),
    idUser          SERIAL,
    idContext       int,
    clicked         boolean,
    saved           boolean,
    discarded       boolean,
    rate            int,
    timestamp       timestamp,
    CONSTRAINT fk_activity FOREIGN KEY (idActivity) references Activity(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (idUser) references "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_context FOREIGN KEY (idContext) references Context(idContext) ON DELETE CASCADE
);

CREATE TABLE Weather(
    idWeather       serial             PRIMARY KEY,
    temperature     int,
    pressure        decimal(10),
    humidity        decimal(10),
    temp_min        int,
    temp_max        int,
    description     varchar(100),
    wind            int,
    clouds          int,
    idContext       int,
    CONSTRAINT fk_context FOREIGN KEY (idContext) references Context(idContext) ON DELETE CASCADE
);

CREATE TABLE Location(
    idLocation      serial             PRIMARY KEY,
    mocked          bool,
    speed           int,
    longitude       decimal(12),
    latitude        decimal(12),
    altitude        decimal(12),
    idContext       int,
    CONSTRAINT fk_context FOREIGN KEY (idContext) references Context(idContext) ON DELETE CASCADE
);

CREATE TABLE Event(
    idEvent         serial,
    description     varchar(255),
    calendar        varchar(255),
    title           varchar(255),
    startDate       timestamp,
    endDate         timestamp,
    allDay          bool,
    location        varchar(255),
    availability    varchar(45),
    idContext       int,
    CONSTRAINT fk_context FOREIGN KEY (idContext) references Context(idContext) ON DELETE CASCADE
);


