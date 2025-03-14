-- Create roles enum
create type user_role as enum ('user', 'admin', 'elite');

-- Create profiles table that syncs with Clerk
create table public.profiles (
    id text primary key, -- Clerk user ID
    name text,
    phone text,
    role user_role not null default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create complaints table
create table public.complaints (
    id uuid default gen_random_uuid() primary key,
    user_id text not null references public.profiles(id) on delete cascade,
    category text not null check (category in ('potholes', 'streetlights', 'drainage', 'garbage')),
    description text not null,
    location text not null,
    photo_url text,
    status text not null default 'pending' check (status in ('pending', 'in_progress', 'resolved', 'rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create responses table for admin replies
create table public.responses (
    id uuid default gen_random_uuid() primary key,
    complaint_id uuid not null references public.complaints(id) on delete cascade,
    admin_id text not null references public.profiles(id) on delete cascade,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create storage bucket for complaint photos
insert into storage.buckets (id, name, public) values ('complaint-photos', 'complaint-photos', true);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.responses enable row level security;

-- Profiles policies
create policy "Anyone can view profiles"
    on profiles for select
    using (true);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid()::text = id);

create policy "Elite users can update any profile"
    on profiles for update
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()::text
            and role = 'elite'
        )
    );

-- Complaints policies
create policy "Anyone can view complaints"
    on complaints for select
    using (true);

create policy "Users can create complaints"
    on complaints for insert
    with check (
        exists (
            select 1 from profiles
            where id = auth.uid()::text
        )
    );

create policy "Users can update their own complaints"
    on complaints for update
    using (auth.uid()::text = user_id);

create policy "Admins and Elite can update any complaint"
    on complaints for update
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()::text
            and role in ('admin', 'elite')
        )
    );

-- Add delete policy for complaints
create policy "Admins can delete any complaint"
    on complaints for delete
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()::text
            and role in ('admin', 'elite')
        )
    );

-- Responses policies
create policy "Anyone can view responses"
    on responses for select
    using (true);

create policy "Only admins and elite can create responses"
    on responses for insert
    with check (
        exists (
            select 1 from profiles
            where id = auth.uid()::text
            and role in ('admin', 'elite')
        )
    );

-- Storage policies
create policy "Anyone can view complaint photos"
    on storage.objects for select
    using ( bucket_id = 'complaint-photos' );

create policy "Users can upload complaint photos"
    on storage.objects for insert
    with check (
        bucket_id = 'complaint-photos' and
        exists (
            select 1 from profiles
            where id = auth.uid()::text
        )
    );

-- Create indexes
create index complaints_user_id_idx on public.complaints(user_id);
create index complaints_status_idx on public.complaints(status);
create index responses_complaint_id_idx on public.responses(complaint_id);
create index profiles_role_idx on public.profiles(role);

-- Function to promote user to admin (only elite can use this)
create or replace function promote_to_admin(target_user_id text)
returns void
language plpgsql
security definer
as $$
begin
    -- Check if the executing user is elite
    if not exists (
        select 1 from profiles
        where id = auth.uid()::text
        and role = 'elite'
    ) then
        raise exception 'Only elite users can promote others to admin';
    end if;

    -- Update the target user's role to admin
    update profiles
    set role = 'admin'
    where id = target_user_id;
end;
$$;