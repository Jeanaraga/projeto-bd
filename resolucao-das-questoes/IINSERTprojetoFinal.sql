-- =========================
-- INSERTS - DASHBOARD VENDAS
-- =========================

-- =========================
-- TABELAS FORTES
-- =========================

INSERT INTO cliente (nome, email, cpf, status) VALUES
('João Silva', 'joao.silva@email.com', '111.111.111-11', 'Ativo'),
('Maria Souza', 'maria.souza@email.com', '222.222.222-22', 'Ativo'),
('Pedro Santos', 'pedro.santos@email.com', '333.333.333-33', 'Ativo'),
('Ana Oliveira', 'ana.oliveira@email.com', '444.444.444-44', 'Ativo'),
('Lucas Lima', 'lucas.lima@email.com', '555.555.555-55', 'Ativo'),
('Carla Mendes', 'carla.mendes@email.com', '666.666.666-66', 'Ativo'),
('Rafael Costa', 'rafael.costa@email.com', '777.777.777-77', 'Inativo'),
('Fernanda Alves', 'fernanda.alves@email.com', '888.888.888-88', 'Ativo'),
('Bruno Rocha', 'bruno.rocha@email.com', '999.999.999-99', 'Ativo'),
('Juliana Martins', 'juliana.martins@email.com', '000.000.000-00', 'Ativo');


INSERT INTO funcionario (nome, email, cargo, salario, status) VALUES
('Carlos Pereira', 'carlos.pereira@loja.com', 'Vendedor', 1800.00, 'Ativo'),
('Patrícia Gomes', 'patricia.gomes@loja.com', 'Vendedora', 1850.00, 'Ativo'),
('Marcos Almeida', 'marcos.almeida@loja.com', 'Gerente', 3500.00, 'Ativo'),
('Aline Ribeiro', 'aline.ribeiro@loja.com', 'Caixa', 1600.00, 'Ativo'),
('Gustavo Nunes', 'gustavo.nunes@loja.com', 'Estoquista', 1700.00, 'Ativo'),
('Beatriz Lopes', 'beatriz.lopes@loja.com', 'Vendedora', 1900.00, 'Ativo'),
('Ricardo Dias', 'ricardo.dias@loja.com', 'Vendedor', 1800.00, 'Inativo'),
('Camila Ferreira', 'camila.ferreira@loja.com', 'Caixa', 1650.00, 'Ativo'),
('Henrique Castro', 'henrique.castro@loja.com', 'Supervisor', 2800.00, 'Ativo'),
('Larissa Teixeira', 'larissa.teixeira@loja.com', 'Vendedora', 1950.00, 'Ativo');


INSERT INTO categoria (nome, descricao) VALUES
('Informática', 'Produtos relacionados a computadores e acessórios'),
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Celulares', 'Smartphones e acessórios'),
('Casa', 'Produtos para uso doméstico'),
('Escritório', 'Materiais e equipamentos de escritório'),
('Games', 'Produtos voltados para jogos'),
('Áudio', 'Caixas de som, fones e equipamentos de áudio'),
('Periféricos', 'Mouses, teclados e acessórios'),
('Armazenamento', 'HDs, SSDs e pendrives'),
('Rede', 'Roteadores, cabos e equipamentos de rede');


INSERT INTO fornecedor (nome, cnpj, email, status) VALUES
('Tech Distribuidora', '11.111.111/0001-11', 'contato@techdist.com', 'Ativo'),
('Mega Eletrônicos', '22.222.222/0001-22', 'vendas@megaeletronicos.com', 'Ativo'),
('Info Minas', '33.333.333/0001-33', 'comercial@infominas.com', 'Ativo'),
('Digital Center', '44.444.444/0001-44', 'contato@digitalcenter.com', 'Ativo'),
('Brasil Componentes', '55.555.555/0001-55', 'vendas@brasilcomponentes.com', 'Ativo'),
('Global Tech', '66.666.666/0001-66', 'contato@globaltech.com', 'Ativo'),
('Casa do Hardware', '77.777.777/0001-77', 'comercial@casahardware.com', 'Ativo'),
('Rede Mais', '88.888.888/0001-88', 'vendas@redemais.com', 'Inativo'),
('Mundo Digital', '99.999.999/0001-99', 'contato@mundodigital.com', 'Ativo'),
('Import Tech', '00.000.000/0001-00', 'vendas@importtech.com', 'Ativo');


INSERT INTO loja (nome, cidade, estado, endereco) VALUES
('Loja Centro', 'Divinópolis', 'MG', 'Rua Goiás, 100'),
('Loja Esplanada', 'Divinópolis', 'MG', 'Avenida Paraná, 250'),
('Loja Savassi', 'Belo Horizonte', 'MG', 'Rua Pernambuco, 320'),
('Loja Eldorado', 'Contagem', 'MG', 'Avenida João César, 500'),
('Loja Centro Pará', 'Pará de Minas', 'MG', 'Rua Benedito Valadares, 80'),
('Loja Nova Serrana', 'Nova Serrana', 'MG', 'Avenida Dom Cabral, 700'),
('Loja Itaúna', 'Itaúna', 'MG', 'Rua Silva Jardim, 55'),
('Loja Formiga', 'Formiga', 'MG', 'Rua Barão de Piumhi, 200'),
('Loja Bom Despacho', 'Bom Despacho', 'MG', 'Praça da Matriz, 45'),
('Loja Lagoa da Prata', 'Lagoa da Prata', 'MG', 'Avenida Brasil, 900');


INSERT INTO produto (nome, preco_venda, estoque_atual, estoque_minimo, status, id_categoria) VALUES
('Mouse Óptico USB', 39.90, 50, 10, 'Ativo', 8),
('Teclado Mecânico', 129.90, 30, 8, 'Ativo', 8),
('Cabo HDMI 2m', 19.90, 80, 15, 'Ativo', 2),
('Fone Bluetooth', 89.90, 25, 10, 'Ativo', 7),
('Pendrive 64GB', 59.90, 40, 10, 'Ativo', 9),
('SSD 480GB', 229.90, 15, 5, 'Ativo', 9),
('Mousepad Gamer', 12.50, 100, 20, 'Ativo', 6),
('Roteador Wi-Fi', 159.90, 12, 5, 'Ativo', 10),
('Webcam Full HD', 199.90, 8, 5, 'Ativo', 1),
('Caixa de Som USB', 74.90, 4, 5, 'Ativo', 7);


INSERT INTO venda (data_venda, valor_total, forma_pagamento, status, id_cliente, id_funcionario, id_loja) VALUES
('2026-06-01', 79.80, 'Pix', 'Finalizada', 1, 1, 1),
('2026-06-02', 129.90, 'Cartao Credito', 'Finalizada', 2, 2, 1),
('2026-06-03', 59.70, 'Dinheiro', 'Finalizada', 3, 1, 2),
('2026-06-04', 79.90, 'Cartao Debito', 'Finalizada', 4, 6, 2),
('2026-06-05', 119.80, 'Pix', 'Finalizada', 5, 3, 3),
('2026-06-06', 229.90, 'Cartao Credito', 'Finalizada', 6, 10, 4),
('2026-06-07', 50.00, 'Dinheiro', 'Finalizada', 7, 2, 5),
('2026-06-08', 159.90, 'Pix', 'Finalizada', 8, 6, 6),
('2026-06-09', 199.90, 'Cartao Credito', 'Finalizada', 9, 9, 7),
('2026-06-10', 149.80, 'Boleto', 'Pendente', 10, 10, 8);


-- =========================
-- TABELAS FRACAS
-- =========================

INSERT INTO telefone_cliente (id_cliente, telefone, tipo) VALUES
(1, '(37) 99999-0001', 'Celular'),
(2, '(37) 99999-0002', 'Celular'),
(3, '(37) 99999-0003', 'Celular'),
(4, '(37) 99999-0004', 'Celular'),
(5, '(37) 99999-0005', 'Celular'),
(6, '(37) 99999-0006', 'Celular'),
(7, '(37) 3333-0007', 'Residencial'),
(8, '(37) 99999-0008', 'Celular'),
(9, '(37) 3333-0009', 'Comercial'),
(10, '(37) 99999-0010', 'Celular');


INSERT INTO endereco_cliente (id_cliente, tipo_endereco, rua, numero, bairro, cidade, estado) VALUES
(1, 'Residencial', 'Rua Minas Gerais', '101', 'Centro', 'Divinópolis', 'MG'),
(2, 'Residencial', 'Rua Bahia', '202', 'Porto Velho', 'Divinópolis', 'MG'),
(3, 'Residencial', 'Rua São Paulo', '303', 'Esplanada', 'Divinópolis', 'MG'),
(4, 'Residencial', 'Rua Rio de Janeiro', '404', 'Centro', 'Divinópolis', 'MG'),
(5, 'Residencial', 'Rua Ceará', '505', 'Bom Pastor', 'Divinópolis', 'MG'),
(6, 'Residencial', 'Rua Pernambuco', '606', 'Savassi', 'Belo Horizonte', 'MG'),
(7, 'Residencial', 'Rua Amazonas', '707', 'Eldorado', 'Contagem', 'MG'),
(8, 'Residencial', 'Rua Pará', '808', 'Centro', 'Pará de Minas', 'MG'),
(9, 'Residencial', 'Rua Goiás', '909', 'Centro', 'Nova Serrana', 'MG'),
(10, 'Residencial', 'Rua Espírito Santo', '1000', 'Centro', 'Itaúna', 'MG');


INSERT INTO telefone_fornecedor (id_fornecedor, telefone, tipo) VALUES
(1, '(31) 4000-0001', 'Comercial'),
(2, '(31) 4000-0002', 'Comercial'),
(3, '(37) 4000-0003', 'Comercial'),
(4, '(31) 4000-0004', 'Comercial'),
(5, '(11) 4000-0005', 'Fixo'),
(6, '(11) 4000-0006', 'Comercial'),
(7, '(37) 4000-0007', 'Comercial'),
(8, '(31) 4000-0008', 'Comercial'),
(9, '(21) 4000-0009', 'Fixo'),
(10, '(11) 4000-0010', 'Comercial');


INSERT INTO movimentacao_estoque (id_produto, data_movimentacao, tipo_movimentacao, quantidade, motivo) VALUES
(1, '2026-06-01', 'Entrada', 50, 'Compra inicial'),
(2, '2026-06-01', 'Entrada', 30, 'Compra inicial'),
(3, '2026-06-02', 'Entrada', 80, 'Compra inicial'),
(4, '2026-06-02', 'Entrada', 25, 'Compra inicial'),
(5, '2026-06-03', 'Entrada', 40, 'Compra inicial'),
(6, '2026-06-03', 'Entrada', 15, 'Compra inicial'),
(7, '2026-06-04', 'Entrada', 100, 'Compra inicial'),
(8, '2026-06-04', 'Entrada', 12, 'Compra inicial'),
(9, '2026-06-05', 'Entrada', 8, 'Compra inicial'),
(10, '2026-06-05', 'Entrada', 4, 'Compra inicial');


INSERT INTO parcela_pagamento (id_venda, numero_parcela, valor, data_vencimento, status) VALUES
(1, 1, 79.80, '2026-06-01', 'Paga'),
(2, 1, 129.90, '2026-07-02', 'Pendente'),
(3, 1, 59.70, '2026-06-03', 'Paga'),
(4, 1, 79.90, '2026-06-04', 'Paga'),
(5, 1, 119.80, '2026-06-05', 'Paga'),
(6, 1, 229.90, '2026-07-06', 'Pendente'),
(7, 1, 50.00, '2026-06-07', 'Paga'),
(8, 1, 159.90, '2026-06-08', 'Paga'),
(9, 1, 199.90, '2026-07-09', 'Pendente'),
(10, 1, 149.80, '2026-07-10', 'Pendente');


-- =========================
-- TABELAS ASSOCIATIVAS
-- =========================

INSERT INTO item_venda (id_venda, id_produto, quantidade, preco_unitario, desconto, subtotal) VALUES
(1, 1, 2, 39.90, 0.00, 79.80),
(2, 2, 1, 129.90, 0.00, 129.90),
(3, 3, 3, 19.90, 0.00, 59.70),
(4, 4, 1, 89.90, 10.00, 79.90),
(5, 5, 2, 59.90, 0.00, 119.80),
(6, 6, 1, 229.90, 0.00, 229.90),
(7, 7, 4, 12.50, 0.00, 50.00),
(8, 8, 1, 159.90, 0.00, 159.90),
(9, 9, 1, 199.90, 0.00, 199.90),
(10, 10, 2, 74.90, 0.00, 149.80);


INSERT INTO produto_fornecedor (id_produto, id_fornecedor, preco_compra, prazo_entrega_dias) VALUES
(1, 1, 20.00, 5),
(2, 1, 80.00, 7),
(3, 2, 8.00, 3),
(4, 2, 50.00, 6),
(5, 3, 35.00, 4),
(6, 4, 160.00, 8),
(7, 5, 5.00, 5),
(8, 8, 100.00, 10),
(9, 9, 130.00, 7),
(10, 10, 45.00, 6);


INSERT INTO funcionario_loja (id_funcionario, id_loja, data_inicio, turno) VALUES
(1, 1, '2026-01-10', 'Manha'),
(2, 1, '2026-01-15', 'Tarde'),
(3, 3, '2026-02-01', 'Manha'),
(4, 2, '2026-02-10', 'Tarde'),
(5, 2, '2026-03-01', 'Manha'),
(6, 6, '2026-03-05', 'Noite'),
(7, 5, '2026-04-01', 'Tarde'),
(8, 4, '2026-04-10', 'Manha'),
(9, 7, '2026-05-01', 'Tarde'),
(10, 8, '2026-05-15', 'Noite');

SELECT COUNT(*) FROM cliente;
SELECT COUNT(*) FROM funcionario;
SELECT COUNT(*) FROM categoria;
SELECT COUNT(*) FROM fornecedor;
SELECT COUNT(*) FROM loja;
SELECT COUNT(*) FROM produto;
SELECT COUNT(*) FROM venda;
SELECT COUNT(*) FROM telefone_cliente;
SELECT COUNT(*) FROM endereco_cliente;
SELECT COUNT(*) FROM telefone_fornecedor;
SELECT COUNT(*) FROM movimentacao_estoque;
SELECT COUNT(*) FROM parcela_pagamento;
SELECT COUNT(*) FROM item_venda;
SELECT COUNT(*) FROM produto_fornecedor;
SELECT COUNT(*) FROM funcionario_loja;