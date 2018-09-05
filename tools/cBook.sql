CREATE TABLE `cbook` ( 
    `id` int(11) NOT NULL AUTO_INCREMENT, 
    `isbn` varchar(20) NOT NULL, 
    `openid` varchar(50) NOT NULL, 
    `title` varchar(100) NOT NULL, 
    `image` varchar(100) DEFAULT NULL, 
    `alt` varchar(100) NOT NULL, 
    `publisher` varchar(100) NOT NULL, 
    `summary` varchar(1000) NOT NULL, 
    `price` varchar(100) DEFAULT NULL, 
    `rate` float DEFAULT NULL, 
    `tags` varchar(100) DEFAULT NULL, 
    `author` varchar(100) DEFAULT NULL, 
    `count` int(11) DEFAULT '0', 
    PRIMARY KEY (`id`) 
) 
ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8

CREATE table cComment(
    id int not null auto_increment PRIMARY KEY,
    openid varchar(100) not null,
    bookid varchar(10) not null,
    comment varchar(200) not null,
    phone varchar(50),
    location VARCHAR(50)
)