--import.sql
insert into tb_category (name) values ('Sandálias');
insert into tb_category (name) values ('Botas');
insert into tb_category (name) values ('Sapatilhas');
insert into tb_category (name) values ('Tênis');

insert into tb_product (name, description, price, image, category_id) values ('Bota Cano Curto', 'Bota feminina de cano curto, ideal para o inverno, em couro sintético.', 299.99, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hb4/had/h00/h00/10894083325982/HEADLESS-1072300440001U-01-BASEIMAGE-Hires-Headless.jpg', 2);
insert into tb_product (name, description, price, image, category_id) values ('Sandália Salto Alto', 'Sandália feminina de salto alto, confortável e elegante, disponível em várias cores.', 149.99, 'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/h14/h47/h00/h00/12324598808606/HEADLESS-1246300620001U-01-BASEIMAGE-Hires-Headless.jpg', 1);
insert into tb_product (name, description, price, image, category_id) values ('Tênis Casual Feminino', 'Tênis casual feminino, modelo sport, ideal para o dia a dia, muito confortável.', 129.99,'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/h3f/h0e/h00/h00/12237882490910/HEADLESS-1280400470001U-01-BASEIMAGE-Hires-Headless.jpg', 4);
insert into tb_product (name, description, price, image, category_id) values ('Sapatilha Casual Feminina', 'Sapatilha feminina, confortável e ideal para o trabalho, disponível em cores neutras.', 89.99,'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/h4e/hb5/h00/h00/12295040958494/HEADLESS-1365000010013U-01-BASEIMAGE-Hires-Headless.jpg', 3);
insert into tb_product (name, description, price, image, category_id) values ('Bota Over the Knee', 'Bota feminina over the knee, tendência outono/inverno, em camurça sintética.', 499.99,'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hab/h49/h00/h00/12258788179998/HEADLESS-1374600040002U-03-BASEIMAGE-Hires-Headless.jpg', 2);
insert into tb_product (name, description, price, image, category_id) values ('Sandália Plataforma', 'Sandália feminina com plataforma, moderna e confortável, ideal para festas.', 169.99,'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hbb/h9a/h00/h00/12060594012190/HEADLESS-1343800080004U-03-BASEIMAGE-Hires-Headless.jpg', 1);
insert into tb_product (name, description, price, image, category_id) values ('Tênis Esportivo Feminino', 'Tênis esportivo feminino para corrida e academia, modelo leve e respirável.', 219.90,'https://secure-static.arezzo.com.br/medias/sys_master/arezzo/arezzo/hd1/h36/h00/h00/12245574582302/HEADLESS-1366700010001U-03-BASEIMAGE-Hires-Headless.jpg', 4);

--INSERT INTO tb_user(display_name, username, password) VALUES ('Administrador', 'admin','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');
--INSERT INTO tb_user(display_name, username, password) VALUES ('Teste', 'test','$2a$10$.PVIfB07x.SfMYTcToxL0.yxcLWU0GbS2NUO1W1QAvqMm/TsFhVem');