import { Router } from 'express';
import * as dbInstituicao from '../repository/instituicaoRepository.js';
import { autenticar, permitirTipo } from '../middleware/autenticar.js';

const endpoints = Router();

const CAMPOS_OBRIGATORIOS = {
    nome: 'nome da instituição',
    tipoInstituicao: 'tipo de instituição',
    descricao: 'descrição',
    responsavel: 'responsável',
    telefone: 'telefone',
    cep: 'CEP',
    estado: 'estado',
    rua: 'rua',
    numero: 'número',
    bairro: 'bairro',
    cidade: 'cidade',
    pessoasAtendidas: 'pessoas atendidas',
    frequenciaDoacao: 'frequência de doação',
    alimentosNecessarios: 'alimentos necessários'
};

function camposFaltando(dados) {
    return Object.entries(CAMPOS_OBRIGATORIOS)
        .filter(([campo]) => {
            const valor = dados[campo];
            return valor === undefined || valor === null || String(valor).trim() === '';
        })
        .map(([, nome]) => nome);
}

endpoints.get('/api/instituicoes', async (req, res) => {
    try {
        const instituicoes = await dbInstituicao.listarInstituicoes(
            req.query.busca || ''
        );
        res.status(200).json(instituicoes);
    } catch (erro) {
        console.error('Erro ao listar instituições:', erro.message);
        res.status(500).json({
            erro: 'Não foi possível listar as instituições.'
        });
    }
});

endpoints.get(
    '/api/minha-instituicao',
    autenticar,
    permitirTipo('ONG'),
    async (req, res) => {
        try {
            const instituicao = await dbInstituicao.buscarInstituicaoPorId(
                req.usuario.perfilId
            );

            if (!instituicao) {
                return res.status(404).json({
                    erro: 'Instituição não encontrada.'
                });
            }

            res.status(200).json(instituicao);
        } catch (erro) {
            console.error('Erro ao carregar instituição:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível carregar a instituição.'
            });
        }
    }
);

endpoints.put(
    '/api/minha-instituicao',
    autenticar,
    permitirTipo('ONG'),
    async (req, res) => {
        const faltando = camposFaltando(req.body);

        if (faltando.length) {
            return res.status(400).json({
                erro: `Preencha os campos: ${faltando.join(', ')}.`
            });
        }

        try {
            const qtd = await dbInstituicao.atualizarInstituicao(
                req.usuario.perfilId,
                req.body
            );

            if (!qtd) {
                return res.status(404).json({
                    erro: 'Instituição não encontrada.'
                });
            }

            res.json({ mensagem: 'Dados da instituição atualizados!' });
        } catch (erro) {
            console.error('Erro ao atualizar instituição:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível atualizar a instituição.'
            });
        }
    }
);

export default endpoints;
