
# Projeto Final de Banco de Dados

## Tema do Projeto

Este projeto consiste na construção de um banco de dados para um **Dashboard de Vendas e Estoque**.

O objetivo é atender aos requisitos propostos na atividade final de Banco de Dados, contemplando modelagem MER, DER, criação das tabelas, restrições, inserção de dados e consultas SQL práticas.

Além disso, foi desenvolvida uma aplicação simples em JavaScript para demonstrar o uso prático do banco de dados em um dashboard de vendas.

---

## Estrutura das Pastas

```txt
projeto-final-banco-de-dados/
│
├── aplicacao-pratica/
│
└── resolucao-das-questoes/
````

---

## Pasta `aplicacao-pratica`

A pasta `aplicacao-pratica` contém uma aplicação simples que utiliza o banco de dados construído no projeto.

A aplicação representa um **Dashboard de Vendas**, desenvolvido de forma rápida e objetiva, com o intuito de demonstrar uma possível utilização prática do banco.

Nessa aplicação é possível visualizar informações como:

* resumo de vendas;
* produtos cadastrados;
* controle de vendas;
* relatórios;
* dados para gráficos e consultas.

A aplicação foi desenvolvida utilizando:

* JavaScript;
* Node.js;
* Express;
* PostgreSQL;
* HTML;
* CSS.

---

## Pasta `resolucao-das-questoes`

A pasta `resolucao-das-questoes` contém os arquivos SQL e os modelos referentes à resolução das questões propostas no trabalho.

Nessa pasta estão os arquivos relacionados à construção do banco de dados de acordo com os requisitos da atividade.

---

## Arquivos da Resolução

### `MER`

O arquivo do **MER** apresenta o Modelo Entidade-Relacionamento do banco de dados.

Ele contempla:

* entidades fortes;
* entidades fracas;
* relacionamentos;
* cardinalidades;
* relacionamentos muitos-para-muitos;
* relacionamento com atributos.

Esse arquivo corresponde à resolução da **Questão 01**.

---

### `DER`

O arquivo do **DER** apresenta o Modelo Relacional do banco de dados.

Nele são mostradas:

* tabelas;
* atributos;
* tipos dos atributos;
* chaves primárias;
* chaves estrangeiras;
* relacionamentos entre as tabelas.

Esse arquivo corresponde à resolução da **Questão 02**.

---

### `DDLprojetoFinal.sql`

O arquivo `DDLprojetoFinal.sql` contém os comandos SQL responsáveis pela criação do banco de dados.

Nele estão presentes:

* criação das tabelas;
* definição das chaves primárias;
* definição das chaves estrangeiras;
* restrições `CHECK`;
* restrições `DEFAULT`;
* restrições `UNIQUE`;
* restrições com lista de valores permitidos.

Esse arquivo corresponde principalmente à resolução das **Questões 03 e 04**.

---

### `consultas.sql`

O arquivo `consultas.sql` contém as consultas SQL utilizadas para resolver as demais questões do trabalho.

Nele estão presentes exemplos práticos de:

* violação de restrições;
* `INNER JOIN`;
* `LEFT JOIN`;
* `RIGHT JOIN`;
* `FULL JOIN`;
* `GROUP BY`;
* `HAVING`;
* `UNION`;
* `INTERSECT`;
* `EXCEPT`.

Esse arquivo corresponde à resolução das **Questões 05 até 14**.

---

## Observação sobre a Normalização

O banco de dados foi estruturado de forma normalizada, evitando repetição desnecessária de dados e separando corretamente as informações em tabelas próprias.

Foram criadas tabelas específicas para clientes, funcionários, produtos, categorias, fornecedores, lojas, vendas, itens de venda, telefones, endereços, movimentações de estoque e parcelas de pagamento.

Essa organização contribui para evitar inconsistências e atende ao requisito de normalização da **Questão 15**.

---

## Objetivo da Aplicação Prática

A aplicação prática não tem como objetivo ser um sistema comercial completo.

Ela foi criada apenas para demonstrar, de forma simples, como o banco de dados pode ser utilizado em uma aplicação real.

O foco principal do projeto está na construção e utilização correta do banco de dados.

```

Só atenção: no seu texto, você falou que `DDLprojetoFinal.sql` resolve a questão 1 e 4, mas o correto é:

- **Questão 1:** MER;
- **Questão 2:** DER;
- **Questão 3:** DDL;
- **Questão 4:** restrições no DDL;
- **Questões 5 a 14:** consultas SQL;
- **Questão 15:** normalização.

Então eu já deixei isso corrigido no README.
```
