-- 1. Create notifications table
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text default 'info', -- 'info' or 'success'
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table public.notifications enable row level security;

-- 3. Set up RLS Policy for Users
create policy "Users can view and update own notifications"
  on public.notifications
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: Create a database trigger to insert a notification when an order is created
create or replace function public.log_new_order()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notifications (user_id, title, message, type)
  values (
    new.user_id, 
    'Order Received', 
    'Your order for "' || new.title || '" has been successfully submitted.',
    'success'
  );
  return new;
end;
$$;

create trigger on_order_created
  after insert on public.orders
  for each row execute procedure public.log_new_order();
