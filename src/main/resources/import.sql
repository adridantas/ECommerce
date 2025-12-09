--import.sql
insert into tb_category (name) values ('Sandálias');
insert into tb_category (name) values ('Mules');
insert into tb_category (name) values ('Bolsas');
insert into tb_category (name) values ('Rasteiras');
insert into tb_category (name) values ('Eletrônico');

insert into tb_product (name, description, price, category_id, image) values ('Sandália Dourada Couro Salto Alto Taça Pedrarias','Sandália dourada de couro. O sapato tem salto alto metalizado em formato de taça e formato quadrado na ponta. ', 599.0, 1, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hdb/h54/h00/h00/12654228602910/Hires-Headless-A1359800050002-03.jpg');
insert into tb_product (name, description, price, category_id, image) values ('Mule Preta Couro Salto Baixo Taça','Mule preta de couro. O sapato tem salto baixo em formato taça e formato quadrado na ponta.',359.0,2, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hfb/h28/h00/h00/12654150713374/Hires-Headless-A1361400050001-01.jpg');
insert into tb_product (name, description, price, category_id, image) values ('Bolsa Shoulder Dourada Couro Grande Básica','Bolsa feminina shoulder grande em couro dourado. O acessório tem formato estruturado e alongado. ',999.99,3, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/h9a/hc2/h00/h00/12727681875998/Hires-Headless-A5002110340003-03.jpg');
insert into tb_product (name, description, price, category_id, image) values ('Rasteira Preta Couro Fivelas Cristais','Sandália feminina preta de couro. ',199.0,4, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hee/h53/h00/h00/12654482915358/Hires-Headless-A1306501740001-03.jpg');
insert into tb_product (name, description, price, category_id, image) values ('Sandália Prata Couro Salto Baixo Taça Tira',' Sandália prata de couro. O sapato tem salto baixo metalizado em formato taça e formato quadrado na ponta.',439.0,1, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hf4/h4c/h00/h00/12654427471902/Hires-Headless-A1361400060001-03.jpg');

INSERT INTO tb_user (display_name, username, password, role, active, email) VALUES ('admin', 'admin', '$2a$12$G16vrMJ3DYZQuKtgAYY76u5LvjNgGtsITP/o8UhGVEhkkj5AfU32q', 'ADMIN', true, 'admin@admin.com');
