-- Bucket para fotos de receitas e avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('saveur-images', 'saveur-images', true)
ON CONFLICT (id) DO NOTHING;

-- Leitura pública: as imagens são servidas direto pelo CDN
CREATE POLICY "saveur images readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'saveur-images');

-- Escrita restrita a usuários autenticados e às duas pastas conhecidas
CREATE POLICY "saveur images insertable" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'saveur-images'
    AND (storage.foldername(name))[1] IN ('recipes', 'avatars')
  );

CREATE POLICY "saveur images updatable by owner" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'saveur-images' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'saveur-images');

CREATE POLICY "saveur images deletable by owner" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'saveur-images' AND owner = auth.uid());
