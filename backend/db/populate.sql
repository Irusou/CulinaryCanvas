-- POPULATE TABLE `Tipo`
insert into Tipo(description) values("Bebida");
insert into Tipo(description) values("Entrada");
insert into Tipo(description) values("Prato Principal");
insert into Tipo(description) values("Sobremesa");

-- POPULATE TABLE `Mesa`
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);
insert into Mesa(isOpen) values(true);

-- POPULATE TABLE `Produto`
insert into Produto(description, price, tipo) values("Arroz de Marisco",15,3);
insert into Produto(description, price, tipo) values("Choco Frito",10,3);
insert into Produto(description, price, tipo) values("Arroz Doce",2.5,4);
insert into Produto(description, price, tipo) values("Pão",0.8,2);
insert into Produto(description, price, tipo) values("Água",1.2,1);