--import.sql
insert into tb_category (name) values ('Sandálias');
insert into tb_category (name) values ('Botas');
insert into tb_category (name) values ('Sapatilhas');
insert into tb_category (name) values ('Tênis');

insert into tb_product (name, description, price, category_id) values ('Bota Cano Curto', 'Bota feminina de cano curto, ideal para o inverno, em couro sintético.', 299.99, 2);
insert into tb_product (name, description, price, category_id) values ('Sandália Salto Alto', 'Sandália feminina de salto alto, confortável e elegante, disponível em várias cores.', 149.99, 1);
insert into tb_product (name, description, price, category_id) values ('Tênis Casual Feminino', 'Tênis casual feminino, modelo sport, ideal para o dia a dia, muito confortável.', 129.99, 4);
insert into tb_product (name, description, price, category_id) values ('Sapatilha Casual Feminina', 'Sapatilha feminina, confortável e ideal para o trabalho, disponível em cores neutras.', 89.99, 3);
insert into tb_product (name, description, price, category_id) values ('Bota Over the Knee', 'Bota feminina over the knee, tendência outono/inverno, em camurça sintética.', 499.99, 2);
insert into tb_product (name, description, price, category_id) values ('Sandália Plataforma', 'Sandália feminina com plataforma, moderna e confortável, ideal para festas.', 169.99, 1);
insert into tb_product (name, description, price, category_id) values ('Tênis Esportivo Feminino', 'Tênis esportivo feminino para corrida e academia, modelo leve e respirável.', 219.90, 4);

--INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
--INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');