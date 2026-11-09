import { Router } from 'express';
import * as dbEstabelecimento from '../repository/estabelecimentoRepository.js';
import { autenticar, permitirTipo } from '../middleware/autenticar.js';

const endpoints = Router();

const CAMPOS_OBRIGATORIOS = {
    nome: 'nome do estabelecimento',
    tipoEstabelecimento: 'tipo de estabelecimento',
    telefone: 'telefone',
    cep: 'CEP',
    rua: 'rua',
    numero: 'número',
    bairro: 'bairro',
    cidade: 'cidade',
    estado: 'estado',
    responsavel: 'responsável',
    cpfResponsavel: 'CPF do responsável',
    cargoResponsavel: 'cargo do responsável'
};

function camposFaltando(dados) {
    return Object.entries(CAMPOS_OBRIGATORIOS)
        .filter(([campo]) => {
            const valor = dados[campo];
            return valor === undefined || valor === null || String(valor).trim() === '';
        })
        .map(([, nome]) => nome);
}

endpoints.get(
    '/api/meu-estabelecimento',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        try {
            const estabelecimento =
                await dbEstabelecimento.buscarEstabelecimentoPorId(
                    req.usuario.perfilId
                );

            if (!estabelecimento) {
                return res.status(404).json({
                    erro: 'Estabelecimento não encontrado.'
                });
            }

            res.status(200).json(estabelecimento);
        } catch (erro) {
            console.error('Erro ao carregar estabelecimento:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível carregar o estabelecimento.'
            });
        }
    }
);

endpoints.put(
    '/api/meu-estabelecimento',
    autenticar,
    permitirTipo('ESTABELECIMENTO'),
    async (req, res) => {
        const faltando = camposFaltando(req.body);

        if (faltando.length) {
            return res.status(400).json({
                erro: `Preencha os campos: ${faltando.join(', ')}.`
            });
        }

        try {
            const qtd = await dbEstabelecimento.atualizarEstabelecimento(
                req.usuario.perfilId,
                req.body
            );

            if (!qtd) {
                return res.status(404).json({
                    erro: 'Estabelecimento não encontrado.'
                });
            }

            res.json({ mensagem: 'Dados do estabelecimento atualizados!' });
        } catch (erro) {
            console.error('Erro ao atualizar estabelecimento:', erro.message);
            res.status(500).json({
                erro: 'Não foi possível atualizar o estabelecimento.'
            });
        }
    }
);

export default endpoints;
