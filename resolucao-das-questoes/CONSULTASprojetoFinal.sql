-- ------------------------------------------------------------
-- 05.1 - Violação de CHECK simples
-- Tentativa de cadastrar funcionário com salário negativo.
-- Deve gerar erro porque salario precisa ser maior que zero.
-- ------------------------------------------------------------
INSERT INTO funcionario (nome, email, cargo, salario, status)
VALUES ('Funcionario Erro CHECK', 'erro.check@loja.com', 'Vendedor', -1500.00, 'Ativo');



-- ------------------------------------------------------------
-- 05.2 - Demonstração de DEFAULT
-- Campo status não será informado.
-- O banco deve preencher automaticamente com 'Ativo'.
-- ------------------------------------------------------------
INSERT INTO cliente (nome, email, cpf)
SELECT 'Cliente Teste DEFAULT', 'cliente.default@email.com', '123.456.789-10'
WHERE NOT EXISTS (
    SELECT 1 
    FROM cliente 
    WHERE email = 'cliente.default@email.com'
);

SELECT 
    id_cliente,
    nome,
    email,
    status
FROM cliente
WHERE email = 'cliente.default@email.com';


-- ------------------------------------------------------------
-- 05.3 - Violação de CHECK baseado em lista
-- Tentativa de cadastrar cliente com status inválido.
-- Valores permitidos: 'Ativo' ou 'Inativo'.
-- ------------------------------------------------------------
INSERT INTO cliente (nome, email, cpf, status)
VALUES ('Cliente Erro Lista', 'erro.lista@email.com', '123.123.123-12', 'Bloqueado');


-- ------------------------------------------------------------
-- 05.4 - Violação de UNIQUE
-- Tentativa de cadastrar cliente com email já existente.
-- O email joao.silva@email.com já foi usado nos inserts.
-- ------------------------------------------------------------
 INSERT INTO cliente (nome, email, cpf, status)
 VALUES ('Cliente Erro UNIQUE', 'joao.silva@email.com', '321.321.321-32', 'Ativo');




-- ============================================================
-- DADOS EXTRAS PARA DEMONSTRAÇÃO DOS RELATÓRIOS
-- ============================================================
-- Esses dados ajudam a deixar LEFT JOIN, RIGHT JOIN, FULL JOIN
-- e EXCEPT mais claros na apresentação.
-- Não tem problema ter mais de 10 registros.


-- Cliente sem venda, para aparecer no LEFT JOIN, FULL JOIN e EXCEPT.
INSERT INTO cliente (nome, email, cpf, status)
SELECT 'Cliente Sem Compra', 'cliente.semcompra@email.com', '987.654.321-00', 'Ativo'
WHERE NOT EXISTS (
    SELECT 1
    FROM cliente
    WHERE email = 'cliente.semcompra@email.com'
);


-- Produto sem venda, para aparecer no RIGHT JOIN.
INSERT INTO produto (nome, preco_venda, estoque_atual, estoque_minimo, status, id_categoria)
SELECT 'Produto Sem Venda', 99.90, 20, 5, 'Ativo', 1
WHERE NOT EXISTS (
    SELECT 1
    FROM produto
    WHERE nome = 'Produto Sem Venda'
);



-- ============================================================
-- QUESTÃO 07 - APLICAÇÃO PRÁTICA DE INNER JOIN
-- ============================================================
SELECT 
    v.id_venda,
    c.nome AS cliente,
    f.nome AS funcionario,
    l.nome AS loja,
    v.data_venda,
    v.forma_pagamento,
    v.status,
    v.valor_total
FROM venda v
INNER JOIN cliente c
    ON v.id_cliente = c.id_cliente
INNER JOIN funcionario f
    ON v.id_funcionario = f.id_funcionario
INNER JOIN loja l
    ON v.id_loja = l.id_loja
ORDER BY v.id_venda;



-- ============================================================
-- QUESTÃO 08 - APLICAÇÃO PRÁTICA DE LEFT JOIN
-- ============================================================
SELECT 
    c.id_cliente,
    c.nome AS cliente,
    c.email,
    v.id_venda,
    v.data_venda,
    v.valor_total,
    v.status AS status_venda
FROM cliente c
LEFT JOIN venda v
    ON c.id_cliente = v.id_cliente
ORDER BY c.id_cliente;



-- ============================================================
-- QUESTÃO 09 - APLICAÇÃO PRÁTICA DE RIGHT JOIN
-- ============================================================
SELECT 
    v.id_venda,
    p.id_produto,
    p.nome AS produto,
    iv.quantidade,
    iv.preco_unitario,
    iv.subtotal
FROM item_venda iv
RIGHT JOIN produto p
    ON iv.id_produto = p.id_produto
LEFT JOIN venda v
    ON iv.id_venda = v.id_venda
ORDER BY p.id_produto;



-- ============================================================
-- QUESTÃO 10 - APLICAÇÃO PRÁTICA DE FULL JOIN
-- ============================================================

SELECT 
    c.id_cliente,
    c.nome AS cliente,
    v.id_venda,
    v.data_venda,
    v.valor_total,
    v.status
FROM cliente c
FULL JOIN venda v
    ON c.id_cliente = v.id_cliente
ORDER BY c.id_cliente, v.id_venda;



-- ============================================================
-- QUESTÃO 11 - APLICAÇÃO PRÁTICA DE GROUP BY E HAVING
-- ============================================================

SELECT 
    c.id_cliente,
    c.nome AS cliente,
    COUNT(v.id_venda) AS quantidade_vendas,
    SUM(v.valor_total) AS total_gasto
FROM cliente c
INNER JOIN venda v
    ON c.id_cliente = v.id_cliente
WHERE v.status = 'Finalizada'
GROUP BY c.id_cliente, c.nome
HAVING SUM(v.valor_total) > 100
ORDER BY total_gasto DESC;



-- ============================================================
-- QUESTÃO 12 - APLICAÇÃO PRÁTICA DE UNION
-- ============================================================


SELECT 
    nome,
    'Cliente' AS tipo
FROM cliente

UNION

SELECT 
    nome,
    'Funcionário' AS tipo
FROM funcionario

ORDER BY nome;



-- ============================================================
-- QUESTÃO 13 - APLICAÇÃO PRÁTICA DE INTERSECT
-- ============================================================

SELECT 
    c.id_cliente,
    c.nome
FROM cliente c
INNER JOIN venda v
    ON c.id_cliente = v.id_cliente

INTERSECT

SELECT 
    c.id_cliente,
    c.nome
FROM cliente c
INNER JOIN endereco_cliente ec
    ON c.id_cliente = ec.id_cliente

ORDER BY id_cliente;



-- ============================================================
-- QUESTÃO 14 - APLICAÇÃO PRÁTICA DE EXCEPT
-- ============================================================

SELECT 
    c.id_cliente,
    c.nome,
    c.email
FROM cliente c

EXCEPT

SELECT 
    c.id_cliente,
    c.nome,
    c.email
FROM cliente c
INNER JOIN venda v
    ON c.id_cliente = v.id_cliente

ORDER BY id_cliente;


