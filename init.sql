CREATE TABLE users (
    id          VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE resume (
    user_id     VARCHAR,
    json        VARCHAR,
    PRIMARY KEY (user_id)
);

CREATE TABLE job (
    id          VARCHAR,
    title       VARCHAR,
    category    VARCHAR,
    type        VARCHAR,
    apply_link  VARCHAR,
    description VARCHAR,
    logo        VARCHAR,
    created_at  TIMESTAMP,
    location    VARCHAR,
    approved    BOOLEAN,
    PRIMARY KEY (id)
);

CREATE TABLE company (
    id          VARCHAR,
    name        VARCHAR,
    statement   VARCHAR,
    website     VARCHAR,
    email       VARCHAR,
    description VARCHAR,
    created_at  TIMESTAMP,
    logo        VARCHAR,
    PRIMARY KEY (id)
);

CREATE TABLE job_company (
    job_id      VARCHAR,
    company_id  VARCHAR,
    PRIMARY KEY (job_id, company_id)
);