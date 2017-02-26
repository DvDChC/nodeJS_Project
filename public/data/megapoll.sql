CREATE TABLE Question (
id int PRIMARY KEY AUTO_INCREMENT,
text varchar(255)
);

CREATE TABLE Reponse (
id int PRIMARY KEY AUTO_INCREMENT,
text varchar(255)
);

CREATE TABLE Question_reponse (
id int PRIMARY KEY AUTO_INCREMENT,
id_question int,
id_reponse int,
FOREIGN KEY (id_reponse) REFERENCES Reponse(id_reponse),
FOREIGN KEY (id_question) REFERENCES Question(id_question)
);

INSERT INTO Question(text) values("Question1");
INSERT INTO Question(text) values("Question2");
INSERT INTO Question(text) values("Question3");

INSERT INTO Reponse(text) values("Oui");
INSERT INTO Reponse(text) values("Oui");
INSERT INTO Reponse(text) values("Oui");

INSERT INTO Question_reponse(id_question, id_reponse) values(1,1);
INSERT INTO Question_reponse(id_question, id_reponse) values(2,2);
INSERT INTO Question_reponse(id_question, id_reponse) values(3,3);
