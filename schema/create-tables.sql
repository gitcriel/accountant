DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS permission CASCADE;
DROP TABLE IF EXISTS account_role CASCADE;
DROP TABLE IF EXISTS role_permission CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS password_reset_token CASCADE;

CREATE TABLE account(
 id serial PRIMARY KEY,
 email VARCHAR (254) UNIQUE NOT NULL,
 password VARCHAR (128) NOT NULL,
 salt VARCHAR (16) NOT NULL,
 created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
 last_login TIMESTAMP
);

CREATE TABLE role(
 id serial PRIMARY KEY,
 name VARCHAR (50) UNIQUE NOT NULL
);

CREATE TABLE permission(
 id serial PRIMARY KEY,
 name VARCHAR (50) UNIQUE NOT NULL
);

CREATE TABLE account_role(
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 role_id INTEGER REFERENCES role(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX account_role_account_id ON account_role USING HASH (account_id);
CREATE INDEX account_role_role_id ON account_role USING HASH (role_id);

CREATE TABLE role_permission(
 role_id INTEGER REFERENCES role(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 permission_id INTEGER REFERENCES permission(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX role_permission_role_id ON role_permission USING HASH (role_id);
CREATE INDEX role_permission_permission_id ON role_permission USING HASH (permission_id);

CREATE TABLE session(
 id serial PRIMARY KEY,
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 session_token VARCHAR (32) NOT NULL,
 created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
 expiry_date TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE password_reset_token(
 id serial PRIMARY KEY,
 account_id INTEGER REFERENCES account(id) ON UPDATE NO ACTION ON DELETE CASCADE,
 token VARCHAR (32) NOT NULL,
 created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
 expiry_date TIMESTAMP WITHOUT TIME ZONE
);
