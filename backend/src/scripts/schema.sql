-- ============================================================
-- Conecta-Alimento / Alimento que Conecta
-- Estrutura do banco de dados (MySQL 8+)
--
-- Uso:
--   mysql -u root -p < backend/src/scripts/schema.sql
-- ou:
--   npm run banco --prefix backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS TCC13
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE TCC13;

-- ------------------------------------------------------------
-- Contas de acesso (comum aos dois tipos de perfil)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo       ENUM('ONG', 'ESTABELECIMENTO') NOT NULL,
    criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_usuarios_email (email)
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Perfil: ONG / Instituição
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instituicoes13 (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id            INT NOT NULL,
    nome                  VARCHAR(150) NOT NULL,
    tipo_instituicao      VARCHAR(60)  NOT NULL,
    outro_tipo            VARCHAR(120) NULL,
    cnpj                  VARCHAR(20)  NULL,
    descricao             TEXT         NULL,
    responsavel           VARCHAR(150) NOT NULL,
    telefone              VARCHAR(30)  NOT NULL,
    cep                   VARCHAR(15)  NOT NULL,
    estado                VARCHAR(60)  NOT NULL,
    rua                   VARCHAR(150) NOT NULL,
    numero                VARCHAR(20)  NOT NULL,
    complemento           VARCHAR(120) NULL,
    bairro                VARCHAR(120) NOT NULL,
    cidade                VARCHAR(120) NOT NULL,
    pessoas_atendidas     INT          NOT NULL DEFAULT 0,
    frequencia_doacao     VARCHAR(60)  NOT NULL,
    alimentos_necessarios TEXT         NOT NULL,
    observacoes           TEXT         NULL,
    criado_em             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_instituicoes_usuario (usuario_id),
    CONSTRAINT fk_instituicoes_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Perfil: Estabelecimento doador
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estabelecimentos13 (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id           INT NOT NULL,
    nome                 VARCHAR(150) NOT NULL,
    tipo_estabelecimento VARCHAR(60)  NOT NULL,
    outro_tipo           VARCHAR(120) NULL,
    cnpj                 VARCHAR(20)  NULL,
    telefone             VARCHAR(30)  NOT NULL,
    cep                  VARCHAR(15)  NOT NULL,
    rua                  VARCHAR(150) NOT NULL,
    numero               VARCHAR(20)  NOT NULL,
    complemento          VARCHAR(120) NULL,
    bairro               VARCHAR(120) NOT NULL,
    cidade               VARCHAR(120) NOT NULL,
    estado               VARCHAR(60)  NOT NULL,
    responsavel          VARCHAR(150) NOT NULL,
    cpf_responsavel      VARCHAR(20)  NOT NULL,
    cargo_responsavel    VARCHAR(80)  NOT NULL,
    criado_em            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_estabelecimentos_usuario (usuario_id),
    CONSTRAINT fk_estabelecimentos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Doações de alimentos publicadas pelos estabelecimentos
-- status: DISPONIVEL | RESERVADA | CONCLUIDA | CANCELADA
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doacoes13 (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    estabelecimento_id INT NOT NULL,
    nome_alimento      VARCHAR(150) NOT NULL,
    categoria          VARCHAR(80)  NULL,
    quantidade         DECIMAL(10, 2) NOT NULL,
    unidade            VARCHAR(30)  NOT NULL,
    validade           DATE         NULL,
    retirada_ate       DATETIME     NULL,
    endereco_retirada  VARCHAR(300) NOT NULL,
    observacoes        TEXT         NULL,
    status             ENUM('DISPONIVEL', 'RESERVADA', 'CONCLUIDA', 'CANCELADA')
                       NOT NULL DEFAULT 'DISPONIVEL',
    criado_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_doacoes_estabelecimento (estabelecimento_id),
    KEY idx_doacoes_status (status),
    CONSTRAINT fk_doacoes_estabelecimento
        FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos13 (id)
        ON DELETE CASCADE
) ENGINE = InnoDB;

-- ------------------------------------------------------------
-- Solicitações feitas pelas instituições
-- status: PENDENTE | ACEITA | RECUSADA | CONCLUIDA
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitacoes13 (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    doacao_id      INT NOT NULL,
    instituicao_id INT NOT NULL,
    mensagem       VARCHAR(500) NULL,
    status         ENUM('PENDENTE', 'ACEITA', 'RECUSADA', 'CONCLUIDA')
                   NOT NULL DEFAULT 'PENDENTE',
    criado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_solicitacoes_doacao (doacao_id),
    KEY idx_solicitacoes_instituicao (instituicao_id),
    KEY idx_solicitacoes_status (status),
    CONSTRAINT fk_solicitacoes_doacao
        FOREIGN KEY (doacao_id) REFERENCES doacoes13 (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_solicitacoes_instituicao
        FOREIGN KEY (instituicao_id) REFERENCES instituicoes13 (id)
        ON DELETE CASCADE
) ENGINE = InnoDB;
