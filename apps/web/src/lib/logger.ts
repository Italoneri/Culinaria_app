/**
 * Log estruturado em JSON no stdout — uma linha por evento, para o coletor da
 * hospedagem parsear sem regex.
 *
 * Só roda no servidor: as server actions e o db.ts são os chamadores. Chamar do
 * browser escreveria no console do usuário e não em lugar nenhum útil.
 *
 * Os campos são fechados de propósito. Sem `[key: string]: unknown` ninguém
 * anexa email, token ou o corpo da receita a um log por descuido.
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

/** ERROR acorda alguém · WARN investigar depois · INFO evento de negócio · DEBUG contexto de dev */
const LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const DEFAULT_LEVEL: LogLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

function resolveThreshold(): LogLevel {
  const configured = process.env.LOG_LEVEL;
  if (configured && configured in LEVEL_PRIORITY) return configured as LogLevel;
  return DEFAULT_LEVEL;
}

export type LogFields = {
  /** Id do usuário. Nunca o email — é PII e não ajuda a debugar. */
  userId?: string;
  /** Duração da operação, para achar o que está lento sem instrumentar de novo. */
  durationMs?: number;
  /** SQLSTATE do Postgres (`23505`, `23514`…) ou código equivalente do SDK. */
  code?: string;
  /** Mensagem crua do provedor. Fica no log do servidor, nunca vai para o cliente. */
  message?: string;
};

function emit(level: LogLevel, operation: string, fields: LogFields = {}): void {
  if (LEVEL_PRIORITY[level] > LEVEL_PRIORITY[resolveThreshold()]) return;

  const entry = {
    level,
    operation,
    time: new Date().toISOString(),
    ...fields,
  };

  // console.error para error/warn mantém a separação stdout/stderr que o
  // coletor da hospedagem espera.
  const sink = level === 'error' || level === 'warn' ? console.error : console.log;
  sink(JSON.stringify(entry));
}

export const logger = {
  error: (operation: string, fields?: LogFields) => emit('error', operation, fields),
  warn: (operation: string, fields?: LogFields) => emit('warn', operation, fields),
  info: (operation: string, fields?: LogFields) => emit('info', operation, fields),
  debug: (operation: string, fields?: LogFields) => emit('debug', operation, fields),
};
