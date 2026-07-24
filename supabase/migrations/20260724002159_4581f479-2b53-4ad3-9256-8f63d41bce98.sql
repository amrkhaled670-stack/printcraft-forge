
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS governorate TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS receipt_url TEXT,
  ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC;

-- Storage policies: users manage their own receipts under {user_id}/...
CREATE POLICY "Users upload own receipts"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users read own receipts"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-receipts' AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin'::app_role)
    )
  );

CREATE POLICY "Users delete own receipts"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
