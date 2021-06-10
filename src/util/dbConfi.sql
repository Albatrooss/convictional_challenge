CREATE DATABASE convictional;

CREATE TABLE product(
    code varchar(30) PRIMARY KEY,
    title varchar(128),
    vendor varchar(128),
    body_html varchar(128),
);

CREATE TABLE variant(
    id varchar(30) PRIMARY KEY,
    product_id: varchar(30),
    title varchar(128),
    sku varchar(128),
    available int,
    inventory_quantity int,
    weight_value int,
    weight_unit varchar(30)
);

CREATE TABLE image(
    id SERIAL PRIMARY KEY,
    source varchar(240),
    variant_id varchar(30)
);