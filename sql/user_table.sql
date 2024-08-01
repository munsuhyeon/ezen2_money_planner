-- create schema account_book;

use account_book;

create table user (
user_id varchar(20), 
password varchar(20), 
email varchar(30),
user_name varchar(20), 
sns_id varchar(20), 
login_type varchar(20), 
date_time datetime,
user_image varchar(200),

primary key (`user_id`));


;

