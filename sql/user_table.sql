-- create schema account_book; 

use account_book;

create table user (
userid varchar(20), 
password varchar(20), 
email varchar(30),
username varchar(20), 
snsid varchar(20), 
logintype varchar(20), 
datetime datetime,
userimage varchar(200),

primary key (`userid`));


;

