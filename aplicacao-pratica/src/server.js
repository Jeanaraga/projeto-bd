const express = require('express');
const path = require('path');
require('dotenv').config();

const dashboardRoutes = require('./routes/dashboardRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const vendasRoutes = require('./routes/vendasRoutes');
const relatoriosRoutes = require('./routes/relatorioRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/produtos', produtosRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/relatorios', relatoriosRoutes);

// Teste simples
app.get('/api', (req, res) => {
    res.json({ mensagem: 'API funcionando!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});