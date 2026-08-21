-- Bucket para fotos de receitas e avatares.
-- O upload vem direto do browser, então os limites de tipo e tamanho precisam
-- ser do bucket — não há camada de aplicação no caminho para checar isso.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'saveur-images',
  'saveur-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Leitura pública: as imagens são servidas direto pelo CDN
CREATE POLICY "saveur images readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'saveur-images');

-- Cada usuário escreve apenas dentro da própria pasta (<uid>/...), o que impede
-- sobrescrever ou pré-ocupar o path de outra pessoa.
CREATE POLICY "saveur images insertable in own folder" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'saveur-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "saveur images updatable in own folder" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'saveur-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'saveur-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "saveur images deletable in own folder" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'saveur-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
