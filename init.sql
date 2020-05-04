CREATE TABLE users (
    id          VARCHAR(70),
    PRIMARY KEY (id)
);

CREATE TABLE resume (
    user_id     VARCHAR(70),
    json        VARCHAR(25000),
    PRIMARY KEY (user_id)
);

CREATE TABLE job (
    id          VARCHAR(25),
    title       VARCHAR(128),
    category    VARCHAR CHECK (category IN ('Design','Programming','Customer Support','Copywriting','DevOps & Sysadmin','Sales & Marketing','Business & Management','Finance & Legal','Product','Administrative','Education','Translation & Transacription','Medial/Health','Other')),
    type        VARCHAR CHECK (type IN ('Full-time','Internship','Project')),
    apply_link  VARCHAR(256),
    description VARCHAR(1000),
    created_at  TIMESTAMP,
    location    VARCHAR(64),
    approved    BOOLEAN,
    PRIMARY KEY (id)
);

CREATE TABLE company (
    id          VARCHAR(25),
    name        VARCHAR(128),
    statement   VARCHAR(256),
    website     VARCHAR(256),
    email       VARCHAR(70),
    description VARCHAR(256),
    created_at  TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE job_company (
    job_id      VARCHAR(70),
    company_id  VARCHAR(25),
    PRIMARY KEY (job_id, company_id)
);