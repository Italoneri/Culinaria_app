'use client';

import { useEffect } from 'react';
import { MessageScreen } from '@/components/ui/message-screen';

/**
 * Fronteira de erro das rotas. Antes disto, um throw em fetchRecipes virava
 * tela branca.
 *
 * A causa já foi registrada pelo logger no servidor — o Next não entrega a
 * mensagem original ao browser de propósito, só o `digest`, que é a chave para
 * achar aquela linha de log.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[saveur] erro de renderização', { digest: error.digest });
  }, [error]);

  return (
    <MessageScreen
      testid="error-screen"
      title="Algo deu errado"
      message="Não conseguimos carregar esta tela. Tente de novo em alguns instantes."
      action={{ label: 'Tentar de novo', onClick: reset }}
      reference={error.digest && `Referência: ${error.digest}`}
    />
  );
}
