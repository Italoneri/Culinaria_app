-- Recria handle_new_user com search_path fixo.
--
-- Uma função SECURITY DEFINER sem `SET search_path` resolve os nomes que usa
-- pelo search_path de quem chama. Quem chama aqui é o insert em auth.users, e
-- um schema plantado na frente de `public` faria o INSERT cair numa tabela
-- `profiles` de outra pessoa — rodando com os privilégios do dono da função.
-- O corpo é o mesmo da 20260524000001; só a cláusula é nova.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;

-- Exclusão da própria conta (US-05.2).
--
-- Apagar de auth.users exige privilégio que a anon key não tem, e o app não
-- guarda service role key — o browser falaria direto com a admin API se
-- guardasse. Daí a RPC: o privilégio fica no banco e o alcance é uma linha só,
-- a do próprio chamador. O resto do dado cai pelo ON DELETE CASCADE que já
-- existe em profiles -> recipes -> ingredients/steps/favorites/collections.
--
-- O que NÃO cai por cascade são os objetos do Storage: o client apaga a pasta
-- <uid>/ em best-effort antes de chamar isto aqui, e imagem órfã é o pior caso.
CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'delete_own_account: sem sessão';
  END IF;

  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
