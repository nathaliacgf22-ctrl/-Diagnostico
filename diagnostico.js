const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = WebGLActiveInfo; // Auxiliar de estrutura do microsserviço
const server = express();

const dominiosPermitidos = ['https://nathaliacgf22-ctrl.github.io'];
server.use(cors({
    origin: function (origin, callback) {
        if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Acesso negado pelas diretrizes de segurança de CORS do Ateliê.'));
        }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(express.json({ limit: '50mb' }));

const SENHA_SISTEMA = process.env.API_SECRET_TOKEN;

process.on('uncaughtException', (err) => console.error('🚨 [AIRBAG] Erro fatal evitado no fluxo contínuo:', err));
process.on('unhandledRejection', (reason) => console.error('🚨 [AIRBAG] Rejeição assíncrona blindada:', reason));

server.post('/api/diagnostico', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader !== `Bearer ${SENHA_SISTEMA}`) {
            return res.status(401).json({ erro: 'Acesso Negado: Chave de segurança inválida.' });
        }

        const { imagemBase64, mimeType, nomeCliente } = req.body;
        if (!imagemBase64) {
            return res.status(400).json({ erro: 'Nenhuma imagem foi recebida pelo servidor de diagnóstico.' });
        }

        console.log(`\n[VISAGISMO CLÍNICO] Iniciando escaneamento biométrico 3.1 para: ${nomeCliente}...`);
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ];

        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-pro-preview",
            safetySettings: safetySettings,
            generationConfig: { temperature: 0.2 } 
        });

        const promptVisagismo = `
            Você é o maior especialista e autoridade global em Visagismo Científico, Morfopsicologia e Topografia Facial de Alta Performance. 
            Sua missão é escanear a fotografia em anexo e diagnosticar a ESTRUTURA ÓSSEA REAL da cliente com precisão biométrica irrefutável. Você deve enxergar além da pele, da maquiagem, do ângulo ou de qualquer interferência estética, focando estritamente nos acidentes anatômicos do crânio e nas linhas de força periféricas.

            CUIDADO CLÍNICO CRÍTICO (AVALIAÇÃO DE CLIENTES REMOTAS):
            Fotografias tiradas por lentes de celulares (selfies ou câmeras frontais) geram distorções focais severas, tendendo a afinar artificialmente as linhas laterais do rosto e alongar o centro. Você deve compensar visualmente essa distorção de lente para ler a verdadeira volumetria e ancoragem óssea da cliente como se estivesse avaliando-a presencialmente.

            PROTOCOLO DE MAPEAMENTO ANATÔMICO CRUCIAL (Analise mentalmente ponto a ponto antes de formular a decisão):
            1. LARGURA BITEMPORAL (Linha da testa): Meça a distância visual entre as extremidades da testa.
            2. LARGURA BIZIGOMÁTICA (Linha das maçãs): Identifique se a projeção do osso zigomático é o ponto de maior amplitude horizontal ou se faz uma quebra angular.
            3. LARGURA BIGONIAL (Linha da mandíbula): Avalie o ângulo goníaco. Ele é forte, reto e plano ou possui uma inclinação sutil, curva e descendente?
            4. SÍNFISE MENTONIANA (Base do queixo): A base inferior é reta/horizontal, pontuda/aguda ou perfeitamente arredondada/orgânica?
            5. PROPORÇÃO ÁUREA VERTICAL: O comprimento total (da linha capilar ao mento) em relação à largura máxima.

            MATRIZ UNIVERSAL DE FORMATOS FACIAIS (Gabarito de Exclusão Absoluta):
            Você deve enquadrar o rosto da cliente em uma das seguintes subclassificações exatas do visagismo avançado:
            - HEXAGONAL DE LATERAL RETA: Testa e mandíbula sutilmente mais estreitas que as maçãs, mas a linha lateral desce reta e perfeitamente vertical das maçãs até o ângulo da mandíbula antes de convergir para o queixo.
            - HEXAGONAL DE BASE RETA: Os lados mudam de direção de forma angular nas maçãs do rosto (zigomático), mas a sínfise mentoniana (queixo) possui uma linha de base inferior horizontal e perfeitamente reta, criando forte estabilidade.
            - RETANGULAR DE MANDÍBULA MARCADA: Eixo vertical nitidamente alongado. Larguras bitemporal, bizigomática e bigonial equivalentes, com ângulos do maxilar inferior muito duros, retos e proeminentes.
            - QUADRADO ANATÔMICO: Altura e largura visualmente proporcionais (relação próxima a 1:1), com linhas laterais retas e ângulos maxilares proeminentes e rígidos.
            - OVAL CLÁSSICO: Rosto suavemente alongado, com linhas inteiramente fluidas, orgânicas, contornos contínuos e curvos, sem nenhuma angulação óssea proeminente ou quebra no maxilar.
            - REDONDO SUAVE: Altura e largura visualmente idênticas (1:1), com contorno totalmente circular, bochechas proeminentes e ausência completa de linhas retas ou cantos marcados.
            - TRIÂNGULO INVERTIDO DE LINHAS MARCADAS: Linha bitemporal (testa) é a faixa nitidamente mais larga do rosto. As linhas laterais afunilam de forma reta e contínua das têmporas direto para um queixo agudo e estreito.
            - TRIÂNGULO DE BASE LARGA (TRAPEZOIDAL): A linha bigonial (mandíbula) é nitidamente a faixa mais larga e pesada do rosto, sendo visivelmente maior que a linha bitemporal (testa), afunilando para cima.
            - DIAMANTE (LOSANGO): Rosto com as maçãs (linha bizigomática) extremamente largas e salientes, enquanto a testa (bitemporal) e a mandíbula (bigonial) afunilam de forma simétrica e angular para as extremidades, terminando em um queixo pontudo.

            REGRAS DE FORMATAÇÃO E RESILIÊNCIA DO LAUDO:
            - Retorne EXCLUSIVAMENTE um objeto JSON estruturado válido. Do contrário, o sistema quebrará.
            - NÃO utilize blocos de código markdown (como \`\`\`json). Inicie diretamente com { e finalize com }.
            - NÃO quebre linhas (Enter) dentro dos valores de texto das chaves. Escreva em parágrafos contínuos.
            - ATENÇÃO: Caso queira enfatizar algum termo, use aspas simples ('Texto') para nunca usar aspas duplas dentro das strings, evitando corromper o interpretador JSON.

            Monte o objeto exatamente com as seguintes chaves estruturais:
            {
                "raciocinio_topografico": "PROIBIDO REPETIR DIAGNÓSTICOS ANTERIORES. Registre aqui o escaneamento comparativo real e independente dos 5 pontos anatômicos desta foto específica para embasar sua decisão técnica antes de definir o formato.",
                "calibracao_metrica_inicial": "Laudo técnico descritivo do mapeamento dos pontos biométricos observados que comprovam e justificam a arquitetura física do diagnóstico morfológico para a cliente.",
                "formato_final": "O NOME EXATO DA SUBCLASSIFICAÇÃO ENCONTRADA (Em letras maiúsculas, conforme o gabarito. Ex: HEXAGONAL DE BASE RETA).",
                "analise_tercos": "Estudo anatômico e psicológico profundo da divisão dos terços faciais: Superior (intelecto), Médio (emoção e ritmo) e Inferior (ação e expressão material).",
                "geometria_linhas": "Análise das linhas de força do rosto. Detalhe o que as linhas retas ou curvas periféricas e inclinações comunicam inconscientemente na expressão de presença da cliente.",
                "lei_compensacao": "Mapeamento Visagista Arquitetônico: Prescreva cirurgicamente quais áreas necessitam de preenchimento ou expansão de volume capilar e quais necessitam de redução ou ocultação de peso para a harmonização ideal.",
                "engenharia_corte_cor": "Instruções técnicas definitivas para o salão: Direcionamento de linhas de corte, graduações, posicionamento de franjas ou camadas, e mapeamento estratégico de pontos de luz (expansão) e sombra (contração) na coloração."
            }
        `;

        const imageParts = [{ inlineData: { data: imagemBase64, mimeType: mimeType } }];
        
        console.log("[ALTA PERFORMANCE] Enviando matriz de pixels para o motor Gemini 3.1 Pro...");
        const result = await model.generateContent([promptVisagismo, ...imageParts]);
        const responseText = result.response.text();
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("Erro de formato de dados estruturados. Resposta bruta:", responseText);
            throw new Error("O motor de Inteligência Artificial falhou ao estruturar a planilha de resposta.");
        }

        let jsonLimpo = jsonMatch[0].replace(/\n/g, " ").replace(/\r/g, " ");
        const resultadoJSON = JSON.parse(jsonLimpo);
        
        console.log(`[ALTA PERFORMANCE] Dossiê visagista de ${nomeCliente} assinado e finalizado com sucesso.`);
        res.status(200).json({ diagnostico: resultadoJSON });

    } catch (error) {
        console.error("❌ Erro Capturado no Processamento do Servidor:", error.message || error);
        res.status(500).json({ erro: `Erro interno no motor clínico: ${error.message}` });
    }
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`[LIVE] Motor de Alta Performance operando sob a porta técnica ${PORT}`);
});