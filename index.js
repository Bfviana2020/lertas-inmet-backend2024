const express = require("express");
const Parser = require("rss-parser");
const cors = require("cors");

const app = express();
const parser = new Parser();

// Habilitar CORS para evitar problemas de acesso entre origens
app.use(cors({
    origin: '*', // Permitir todas as origens
    methods: ['GET', 'POST'], // Permitir métodos GET e POST
}));

// Rota para buscar dados do RSS
app.get("/rss", async (req, res) => {
    try {
        const rssFeedUrl = "https://apiprevmet3.inmet.gov.br/avisos/rss"; // URL do RSS
        const feed = await parser.parseURL(rssFeedUrl);

        // Lista de cidades a serem filtradas
        const targetCities = [
            "Bom Jesus do Galho",
            "Inhapim",
            "Ipaba",
            "Manhuaçu",
            "Ipatinga",
            "Timóteo",
            "Matipó",
            "Coronel Fabriciano",
            "Santana do Paraíso",
            "Caratinga",
            "Ubaporanga",
            "Manhumirim"
        ];

        // Filtrar alertas para as cidades de interesse
        const relevantAlerts = feed.items.filter(item => 
            targetCities.some(city => item.title.includes(city) || item.content.includes(city))
        );

        // Retornar os alertas encontrados ou uma mensagem padrão
        if (relevantAlerts.length > 0) {
            res.json({
                status: "success",
                alerts: relevantAlerts,
            });
        } else {
            res.json({
                status: "success",
                alerts: [],
                message: "Não existe alertas de perigo emitidas pelo INMET para Caratinga e região!"
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
