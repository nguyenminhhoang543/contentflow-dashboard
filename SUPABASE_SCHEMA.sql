-- 1. Create profiles table linked to Supabase Auth
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  company_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create orders table for the client writing requests
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content_type text not null,
  word_count integer not null,
  status text default 'Pending',
  target_audience text,
  instructions text,
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Set up Row Level Security (RLS) policies
alter table profiles enable row level security;
alter table orders enable row level security;

-- Profiles: Users can read and update their own profile
create policy "Users can view own profile" 
  on profiles for select 
  using ( auth.uid() = id );

create policy "Users can update own profile" 
  on profiles for update 
  using ( auth.uid() = id );

-- Orders: Users can CRUD their own orders
create policy "Users can view own orders" 
  on orders for select 
  using ( auth.uid() = user_id );

create policy "Users can insert own orders" 
  on orders for insert 
  with check ( auth.uid() = user_id );

create policy "Users can update own orders" 
  on orders for update 
  using ( auth.uid() = user_id );

create policy "Users can delete own orders" 
  on orders for delete 
  using ( auth.uid() = user_id );

--- 4. Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
