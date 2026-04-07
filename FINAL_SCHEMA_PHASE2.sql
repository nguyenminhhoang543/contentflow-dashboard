-- 1. Create content_catalog table
create table if not exists public.content_catalog (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text not null,
    price_per_word numeric(5,3) not null, -- format 0.000
    turnaround_time text not null,
    icon text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: In a real system, you'd insert these from an admin panel. For now, seed initial data:
insert into public.content_catalog (name, description, price_per_word, turnaround_time, icon)
values 
  ('Blog Post', 'Long-form informational articles', 0.08, '2-3 days', '📝'),
  ('Website Copy', 'Conversion-focused landing pages', 0.12, '3-5 days', '💻'),
  ('Email Sequence', 'Engaging drip campaigns', 0.10, '2 days', '✉️'),
  ('Product Description', 'For e-commerce catalogs', 0.06, '24 hours', '🛒')
on conflict do nothing;

-- 2. Create team_members table
create table if not exists public.team_members (
    id uuid default gen_random_uuid() primary key,
    admin_id uuid references public.profiles(id) on delete cascade not null,
    email text not null,
    role text not null default 'Viewer', -- Admin, Editor, Viewer
    status text not null default 'Invited', -- Invited, Active
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create invoices table
create table if not exists public.invoices (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    amount numeric(10,2) not null,
    status text not null default 'Paid', -- Paid, Pending, Failed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create support_tickets table
create table if not exists public.support_tickets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    subject text not null,
    priority text not null default 'Normal',
    message text not null,
    status text not null default 'Open', -- Open, In Progress, Resolved
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create faqs table
create table if not exists public.faqs (
    id uuid default gen_random_uuid() primary key,
    question text not null,
    answer text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed initial FAQs
insert into public.faqs (question, answer)
values 
  ('How long does it take to receive my content?', 'Standard delivery is 2-3 business days. Rush orders are delivered within 24 hours for an additional fee.'),
  ('How do I request a revision?', 'Open your order and click the Request Revision button. You can include detailed feedback. Revisions are unlimited and free within 14 days of delivery.'),
  ('Can I choose specific writers?', 'On our Pro and Enterprise plans, you can build a pool of preferred writers and request them for new orders.')
on conflict do nothing;


-- 6. Enable RLS
alter table public.content_catalog enable row level security;
alter table public.team_members enable row level security;
alter table public.invoices enable row level security;
alter table public.support_tickets enable row level security;
alter table public.faqs enable row level security;

-- 7. Add Policies
-- Content Catalog and FAQs are readable by anyone authenticated
create policy "Anyone can read catalog" on public.content_catalog for select using (auth.role() = 'authenticated');
create policy "Anyone can read faqs" on public.faqs for select using (auth.role() = 'authenticated');

-- Team members manageable by admin
create policy "Users can manage their invited team" on public.team_members for all using (auth.uid() = admin_id);

-- Invoices viewable by user
create policy "Users can view own invoices" on public.invoices for select using (auth.uid() = user_id);
-- Simulate system creates invoice, allow insert for mock purposes:
create policy "Users can simulate invoices" on public.invoices for insert with check (auth.uid() = user_id);

-- Tickets manageable by user
create policy "Users can manage own tickets" on public.support_tickets for all using (auth.uid() = user_id);
