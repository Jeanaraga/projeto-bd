-- ============================================================
-- 04_APLICACOES_PRATICAS.SQL
-- Projeto: Dashboard Web de Vendas e Estoque
-- Banco: dashboardWebVendas
-- ============================================================


-- ============================================================
-- QUESTÃO 04 - RESTRIÇÕES USADAS NO BANCO
-- ============================================================
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





-- ------------------------------------------------------------
-- 05.1 - Violação de CHECK simples
-- Tentativa de cadastrar funcionário com salário negativo.
-- Deve gerar erro porque salario precisa ser maior que zero.
-- ------------------------------------------------------------

DO $$
BEGIN
    INSERT INTO funcionario (nome, email, cargo, salario, status)
    VALUES ('Funcionario Erro CHECK', 'erro.check@loja.com', 'Vendedor', -1500.00, 'Ativo');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro esperado - CHECK salario > 0: %', SQLERRM;
END $$;


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

DO $$
BEGIN
    INSERT INTO cliente (nome, email, cpf, status)
    VALUES ('Cliente Erro Lista', 'erro.lista@email.com', '123.123.123-12', 'Bloqueado');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro esperado - CHECK lista status: %', SQLERRM;
END $$;


-- ------------------------------------------------------------
-- 05.4 - Violação de UNIQUE
-- Tentativa de cadastrar cliente com email já existente.
-- O email joao.silva@email.com já foi usado nos inserts.
-- ------------------------------------------------------------

DO $$
BEGIN
    INSERT INTO cliente (nome, email, cpf, status)
    VALUES ('Cliente Erro UNIQUE', 'joao.silva@email.com', '321.321.321-32', 'Ativo');

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro esperado - UNIQUE email: %', SQLERRM;
END $$;



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
-- Objetivo:
-- Listar vendas com o nome do cliente, funcionário e loja.
-- O INNER JOIN mostra apenas registros que possuem correspondência
-- nas tabelas relacionadas.

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
-- Objetivo:
-- Listar todos os clientes, inclusive os que nunca fizeram compra.
-- A tabela da esquerda é cliente.
-- Então todos os clientes aparecem.

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
-- Objetivo:
-- Listar todos os produtos, inclusive os que nunca foram vendidos.
-- A tabela da direita é produto.
-- Então todos os produtos aparecem.

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
-- Objetivo:
-- Listar clientes e vendas, mostrando correspondências e também
-- registros sem correspondência.
--
-- Observação:
-- Como o banco possui chave estrangeira, não existe venda sem cliente.
-- Mas pode existir cliente sem venda.

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
-- Objetivo:
-- Agrupar vendas por cliente e mostrar apenas clientes que gastaram
-- mais de R$ 100,00.
--
-- GROUP BY agrupa.
-- HAVING filtra depois do agrupamento.

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
-- Objetivo:
-- Unir em uma única lista os nomes dos clientes e funcionários.
--
-- UNION remove duplicados.
-- As duas consultas precisam ter a mesma quantidade de colunas.

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
-- Objetivo:
-- Mostrar clientes que possuem venda e também endereço cadastrado.
--
-- INTERSECT retorna apenas registros que aparecem nas duas consultas.

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
-- Objetivo:
-- Mostrar clientes cadastrados que nunca fizeram compra.
--
-- EXCEPT retorna os registros da primeira consulta que não aparecem
-- na segunda consulta.

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



-- ============================================================
-- RELATÓRIO EXTRA 01 - PRODUTOS COM ESTOQUE BAIXO
-- ============================================================
-- Esse relatório é útil para o dashboard.
-- Mostra produtos em que estoque_atual <= estoque_minimo.

SELECT 
    p.id_produto,
    p.nome AS produto,
    c.nome AS categoria,
    p.estoque_atual,
    p.estoque_minimo,
    CASE
        WHEN p.estoque_atual <= p.estoque_minimo THEN 'Estoque Baixo'
        ELSE 'Estoque Normal'
    END AS situacao
FROM produto p
INNER JOIN categoria c
    ON p.id_categoria = c.id_categoria
ORDER BY p.estoque_atual ASC;



-- ============================================================
-- RELATÓRIO EXTRA 02 - PRODUTOS MAIS VENDIDOS
-- ============================================================
-- Esse relatório usa INNER JOIN + GROUP BY.
-- Serve para gráfico do dashboard.

SELECT 
    p.id_produto,
    p.nome AS produto,
    SUM(iv.quantidade) AS quantidade_vendida,
    SUM(iv.subtotal) AS total_faturado
FROM item_venda iv
INNER JOIN produto p
    ON iv.id_produto = p.id_produto
INNER JOIN venda v
    ON iv.id_venda = v.id_venda
WHERE v.status = 'Finalizada'
GROUP BY p.id_produto, p.nome
ORDER BY quantidade_vendida DESC;



-- ============================================================
-- RELATÓRIO EXTRA 03 - VENDAS POR CATEGORIA
-- ============================================================
-- Esse relatório mostra qual categoria faturou mais.

SELECT 
    c.nome AS categoria,
    SUM(iv.quantidade) AS quantidade_vendida,
    SUM(iv.subtotal) AS total_vendido
FROM item_venda iv
INNER JOIN produto p
    ON iv.id_produto = p.id_produto
INNER JOIN categoria c
    ON p.id_categoria = c.id_categoria
INNER JOIN venda v
    ON iv.id_venda = v.id_venda
WHERE v.status = 'Finalizada'
GROUP BY c.nome
ORDER BY total_vendido DESC;



-- ============================================================
-- RELATÓRIO EXTRA 04 - DESEMPENHO DOS FUNCIONÁRIOS
-- ============================================================
-- Mostra quanto cada funcionário vendeu.
-- O LEFT JOIN permite aparecer funcionário sem venda.

SELECT 
    f.id_funcionario,
    f.nome AS funcionario,
    f.cargo,
    COUNT(v.id_venda) AS quantidade_vendas,
    COALESCE(SUM(v.valor_total), 0) AS total_vendido
FROM funcionario f
LEFT JOIN venda v
    ON f.id_funcionario = v.id_funcionario
    AND v.status = 'Finalizada'
GROUP BY f.id_funcionario, f.nome, f.cargo
ORDER BY total_vendido DESC;



-- ============================================================
-- RELATÓRIO EXTRA 05 - VENDAS POR FORMA DE PAGAMENTO
-- ============================================================
-- Útil para o dashboard e para análise comercial.

SELECT 
    forma_pagamento,
    COUNT(*) AS quantidade_vendas,
    SUM(valor_total) AS total_vendido
FROM venda
WHERE status = 'Finalizada'
GROUP BY forma_pagamento
ORDER BY total_vendido DESC;



-- ============================================================
-- RELATÓRIO EXTRA 06 - VENDAS POR LOJA
-- ============================================================
-- Mostra o desempenho de cada loja.
-- O LEFT JOIN permite aparecer loja sem venda.

SELECT 
    l.id_loja,
    l.nome AS loja,
    l.cidade,
    COUNT(v.id_venda) AS quantidade_vendas,
    COALESCE(SUM(v.valor_total), 0) AS total_vendido
FROM loja l
LEFT JOIN venda v
    ON l.id_loja = v.id_loja
    AND v.status = 'Finalizada'
GROUP BY l.id_loja, l.nome, l.cidade
ORDER BY total_vendido DESC;



-- ============================================================
-- RELATÓRIO EXTRA 07 - ÚLTIMAS VENDAS
-- ============================================================
-- Mostra as vendas recentes com cliente, funcionário e loja.

SELECT 
    v.id_venda,
    v.data_venda,
    c.nome AS cliente,
    f.nome AS funcionario,
    l.nome AS loja,
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
ORDER BY v.data_venda DESC, v.id_venda DESC
LIMIT 10;