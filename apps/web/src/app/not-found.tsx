import { MessageScreen } from '@/components/ui/message-screen';

/** Alvo do notFound() em receita/[id] e de qualquer URL que não casa com rota. */
export default function NotFound() {
  return (
    <MessageScreen
      testid="not-found-screen"
      title="Receita não encontrada"
      message="Esta página não existe ou a receita foi removida."
      action={{ label: 'Voltar para a Home', href: '/' }}
    />
  );
}
