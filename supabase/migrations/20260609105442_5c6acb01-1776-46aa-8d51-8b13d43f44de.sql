
CREATE POLICY "interview_media_select_own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'interview-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "interview_media_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'interview-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "interview_media_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'interview-media' AND auth.uid()::text = (storage.foldername(name))[1]);
