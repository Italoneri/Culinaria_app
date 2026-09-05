'use client';

import { MessageScreen } from '@/components/ui/message-screen';

/**
 * Rede de segurança para quando o próprio root layout quebra. Substitui o
 * `<html>` inteiro, então precisa trazer as próprias tags — e não herda nem as
 * fontes nem o globals.css.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: '#0D0D0D' }}>
        <MessageScreen
          testid="global-error-screen"
          title="Algo deu errado"
          message="O app não conseguiu iniciar. Recarregue a página."
          action={{ label: 'Recarregar', onClick: reset }}
          reference={error.digest && `Referência: ${error.digest}`}
        />
      </body>
    </html>
  );
}
