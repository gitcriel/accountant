DROP TABLE IF EXISTS transaction CASCADE;
DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS pattern CASCADE;
DROP TABLE IF EXISTS institution CASCADE;


CREATE TABLE profile(
 id serial PRIMARY KEY,
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 name VARCHAR (200) NOT NULL
);

CREATE TABLE category(
 id serial PRIMARY KEY,
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 category_id INTEGER REFERENCES category(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 name VARCHAR (200) NOT NULL
);

CREATE TABLE pattern(
 id serial PRIMARY KEY,
 category_id INTEGER REFERENCES category(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 name VARCHAR (200) NOT NULL
);

CREATE TABLE institution(
 id serial PRIMARY KEY,
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 name VARCHAR (200) NOT NULL,
 parsing_pattern  VARCHAR (200) NOT NULL
);

CREATE TABLE transaction(
 id serial PRIMARY KEY,
 profile_id INTEGER REFERENCES profile(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 date TIMESTAMP,
 description VARCHAR (400) NOT NULL,
 category_id INTEGER REFERENCES category(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
 subcategory_id INTEGER REFERENCES category(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
 institution_id INTEGER REFERENCES institution(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
 amount DECIMAL NOT NULL
);