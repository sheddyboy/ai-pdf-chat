-- Custom SQL migration file, put you code below! --
create function public.handle_new_user () returns trigger as $$
begin
  insert into public.profiles (id,name,profile_picture)
  values (new.id, new.raw_user_meta_data ->> 'name',new.raw_user_meta_data ->> 'picture');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();

-- create a bucket.

insert into storage.buckets
  (id,name,public)
values
  ('images','images',true);


CREATE POLICY "Give images access to own folder 1ufimg_0" ON storage.objects FOR SELECT TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Give images access to own folder 1ufimg_1" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Give images access to own folder 1ufimg_2" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Give images access to own folder 1ufimg_3" ON storage.objects FOR DELETE TO public USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);


CREATE
OR REPLACE FUNCTION updated_at_func () RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER profiles_updated_at_trigger BEFORE
UPDATE ON profiles FOR EACH ROW
EXECUTE PROCEDURE updated_at_func ();

CREATE TRIGGER chats_updated_at_trigger BEFORE
UPDATE ON chats FOR EACH ROW
EXECUTE PROCEDURE updated_at_func ();

CREATE TRIGGER messages_updated_at_trigger BEFORE
UPDATE ON messages FOR EACH ROW
EXECUTE PROCEDURE updated_at_func ();