-- create function public.handle_new_user () returns trigger as $$
-- begin
--   insert into public.profiles (id,name,profile_picture)
--   values (new.id, new.raw_user_meta_data ->> 'name',new.raw_user_meta_data ->> 'picture');
--   return new;
-- end;
-- $$ language plpgsql security definer;

-- create trigger on_auth_user_created
-- after insert on auth.users for each row
-- execute procedure public.handle_new_user ();

-- -- create a bucket.

-- insert into storage.buckets
--   (id,name,public)
-- values
--   ('images','images',true);


-- CREATE POLICY "Give images access to own folder 1ufimg_0" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Give images access to own folder 1ufimg_1" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Give images access to own folder 1ufimg_2" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Give images access to own folder 1ufimg_3" ON storage.objects FOR DELETE TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);


-- -- Enable MODDATETIME extension
-- create extension if not exists moddatetime schema extensions;