-- TABELAS FORTES
-- QUESTÃO 3

-- ============================================================
-- QUESTÃO 04 - RESTRIÇÕES USADAS NO BANCO

-- CHECK simples:
-- Exemplo no DDL:
-- salario NUMERIC(10,2) NOT NULL CHECK (salario > 0)

-- DEFAULT:
-- Exemplo no DDL:
-- status VARCHAR(20) DEFAULT 'Ativo'

-- CHECK baseado em lista:
-- Exemplo no DDL:
-- CHECK (status IN ('Ativo', 'Inativo'))

-- UNIQUE:
-- Exemplo no DDL:
-- email VARCHAR(100) UNIQUE NOT NULL

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_cadastro DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Ativo',
    CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario NUMERIC(10,2) NOT NULL CHECK (salario > 0),
    status VARCHAR(20) DEFAULT 'Ativo',
    CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(80) UNIQUE NOT NULL,
    descricao TEXT
);

CREATE TABLE fornecedor (
    id_fornecedor SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'Ativo',
    CHECK (status IN ('Ativo', 'Inativo'))
);

CREATE TABLE loja (
    id_loja SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado CHAR(2) DEFAULT 'MG',
    endereco VARCHAR(150) NOT NULL
);

CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_venda NUMERIC(10,2) NOT NULL CHECK (preco_venda > 0),
    estoque_atual INT DEFAULT 0 CHECK (estoque_atual >= 0),
    estoque_minimo INT DEFAULT 5 CHECK (estoque_minimo >= 0),
    status VARCHAR(20) DEFAULT 'Ativo',
    id_categoria INT NOT NULL,
    CHECK (status IN ('Ativo', 'Inativo')),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE venda (
    id_venda SERIAL PRIMARY KEY,
    data_venda DATE DEFAULT CURRENT_DATE,
    valor_total NUMERIC(10,2) DEFAULT 0 CHECK (valor_total >= 0),
    forma_pagamento VARCHAR(30) NOT NULL,
    status VARCHAR(20) DEFAULT 'Finalizada',
    id_cliente INT NOT NULL,
    id_funcionario INT NOT NULL,
    id_loja INT NOT NULL,
    CHECK (forma_pagamento IN ('Dinheiro', 'Pix', 'Cartao Credito', 'Cartao Debito', 'Boleto')),
    CHECK (status IN ('Finalizada', 'Cancelada', 'Pendente')),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario),
    FOREIGN KEY (id_loja) REFERENCES loja(id_loja)
);

-- =========================
-- TABELAS FRACAS
-- =========================

CREATE TABLE telefone_cliente (
    id_cliente INT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'Celular',
    CHECK (tipo IN ('Celular', 'Residencial', 'Comercial')),
    PRIMARY KEY (id_cliente, telefone),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE endereco_cliente (
    id_cliente INT NOT NULL,
    tipo_endereco VARCHAR(20) NOT NULL,
    rua VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    estado CHAR(2) DEFAULT 'MG',
    PRIMARY KEY (id_cliente, tipo_endereco),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE telefone_fornecedor (
    id_fornecedor INT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'Comercial',
    CHECK (tipo IN ('Celular', 'Comercial', 'Fixo')),
    PRIMARY KEY (id_fornecedor, telefone),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE
);

CREATE TABLE movimentacao_estoque (
    id_produto INT NOT NULL,
    id_movimentacao SERIAL,
    data_movimentacao DATE DEFAULT CURRENT_DATE,
    tipo_movimentacao VARCHAR(20) NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    motivo VARCHAR(100),
    PRIMARY KEY (id_produto, id_movimentacao),
    CHECK (tipo_movimentacao IN ('Entrada', 'Saida')),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE
);

CREATE TABLE parcela_pagamento (
    id_venda INT NOT NULL,
    numero_parcela INT NOT NULL,
    valor NUMERIC(10,2) NOT NULL CHECK (valor > 0),
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendente',
    CHECK (status IN ('Pendente', 'Paga', 'Atrasada')),
    PRIMARY KEY (id_venda, numero_parcela),
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda) ON DELETE CASCADE
);

-- =========================
-- TABELAS ASSOCIATIVAS
-- =========================

CREATE TABLE item_venda (
    id_venda INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL CHECK (preco_unitario > 0),
    desconto NUMERIC(10,2) DEFAULT 0 CHECK (desconto >= 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    PRIMARY KEY (id_venda, id_produto),
    FOREIGN KEY (id_venda) REFERENCES venda(id_venda) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto)
);

CREATE TABLE produto_fornecedor (
    id_produto INT NOT NULL,
    id_fornecedor INT NOT NULL,
    preco_compra NUMERIC(10,2) NOT NULL CHECK (preco_compra > 0),
    prazo_entrega_dias INT DEFAULT 7 CHECK (prazo_entrega_dias > 0),
    PRIMARY KEY (id_produto, id_fornecedor),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id_fornecedor)
);

CREATE TABLE funcionario_loja (
    id_funcionario INT NOT NULL,
    id_loja INT NOT NULL,
    data_inicio DATE DEFAULT CURRENT_DATE,
    turno VARCHAR(20) NOT NULL,
    CHECK (turno IN ('Manha', 'Tarde', 'Noite')),
    PRIMARY KEY (id_funcionario, id_loja),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario),
    FOREIGN KEY (id_loja) REFERENCES loja(id_loja)
);