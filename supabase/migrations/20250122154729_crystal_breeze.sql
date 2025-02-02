/*
  # Create Demo Accounts

  1. Creates demo accounts using Supabase auth admin functions
  2. Sets up profiles with appropriate roles
  3. Ensures accounts are properly activated
*/

-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create demo accounts using auth.users table
DO $$
DECLARE
    parent_id uuid;
    staff_id uuid;
    admin_id uuid;
BEGIN
    -- Create parent demo account
    SELECT id INTO parent_id FROM auth.users WHERE email = 'parent.demo@adminvsa.com';
    IF parent_id IS NULL THEN
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            raw_app_meta_data,
            aud,
            role,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_sent_at,
            is_super_admin,
            phone,
            phone_confirmed_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        ) VALUES (
            'parent.demo@adminvsa.com',
            '{"name": "Parent Demo"}',
            '{"provider": "email"}',
            'authenticated',
            'authenticated',
            crypt('Password123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            false,
            null,
            null,
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            ''
        ) RETURNING id INTO parent_id;
    END IF;

    -- Create staff demo account
    SELECT id INTO staff_id FROM auth.users WHERE email = 'staff.demo@adminvsa.com';
    IF staff_id IS NULL THEN
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            raw_app_meta_data,
            aud,
            role,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_sent_at,
            is_super_admin,
            phone,
            phone_confirmed_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        ) VALUES (
            'staff.demo@adminvsa.com',
            '{"name": "Staff Demo"}',
            '{"provider": "email"}',
            'authenticated',
            'authenticated',
            crypt('Password123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            false,
            null,
            null,
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            ''
        ) RETURNING id INTO staff_id;
    END IF;

    -- Create admin demo account
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin.demo@adminvsa.com';
    IF admin_id IS NULL THEN
        INSERT INTO auth.users (
            email,
            raw_user_meta_data,
            raw_app_meta_data,
            aud,
            role,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_sent_at,
            is_super_admin,
            phone,
            phone_confirmed_at,
            confirmation_token,
            recovery_token,
            email_change_token_new,
            email_change
        ) VALUES (
            'admin.demo@adminvsa.com',
            '{"name": "Admin Demo"}',
            '{"provider": "email"}',
            'authenticated',
            'authenticated',
            crypt('Password123', gen_salt('bf')),
            now(),
            now(),
            now(),
            now(),
            true,
            null,
            null,
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            encode(gen_random_bytes(32), 'hex'),
            ''
        ) RETURNING id INTO admin_id;
    END IF;

    -- Create or update profiles
    INSERT INTO public.profiles (id, role, created_at)
    VALUES 
        (parent_id, 'parent', now()),
        (staff_id, 'staff', now()),
        (admin_id, 'admin', now())
    ON CONFLICT (id) 
    DO UPDATE SET 
        role = EXCLUDED.role,
        created_at = EXCLUDED.created_at;

END $$;