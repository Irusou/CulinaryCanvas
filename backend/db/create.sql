create database CulinaryCanvas;
use CulinaryCanvas;
create table if not exists Mesa(
	id int primary key auto_increment,
  isOpen boolean default true 
);

create table if not exists Produto(
	id int primary key auto_increment,
  description varchar(50) not null,
  price float not null,
  tipo int not null,
  foreign key (tipo) references Tipo(id)
);

create table if not exists Tipo(
	id int primary key auto_increment,
  description varchar(50) not null
);

create table if not exists ProdutoMesa(
	mesa int not null,
  produto int not null,
  quantity int not null default 0,
  primary key(mesa, produto),
  foreign key (mesa) references Mesa(id),
  foreign key (produto) references Produto(id)
);