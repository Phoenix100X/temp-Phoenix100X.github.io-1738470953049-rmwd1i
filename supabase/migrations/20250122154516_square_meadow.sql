/*
  # Create Demo Accounts

  1. Creates demo accounts using Supabase auth functions
  2. Sets up profiles with appropriate roles
  3. Uses proper error handling
*/

-- Function to create demo accounts
DO $$
DECLARE
    parent_id uuid;
    staff_id uuid;
    admin_id uuid;
BEGIN
    -- Create parent account
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'parent.demo@adminvsa.com',
        crypt('Password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO parent_id;

    -- Create staff account
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'staff.demo@adminvsa.com',
        crypt('Password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO staff_id;

    -- Create admin account
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'admin.demo@adminvsa.com',
        crypt('Password123', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}',
        '{}',
        now(),
        now(),
        '',
        '',
        '',
        ''
    )
    RETURNING id INTO admin_id;

    -- Create profiles for the demo accounts
    IF parent_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, role)
        VALUES (parent_id, 'parent')
        ON CONFLICT (id) DO UPDATE SET role = 'parent';
    END IF;

    IF staff_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, role)
        VALUES (staff_id, 'staff')
        ON CONFLICT (id) DO UPDATE SET role = 'staff';
    END IF;

    IF admin_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, role)
        VALUES (admin_id, 'admin')
        ON CONFLICT (id) DO UPDATE SET role = 'admin';
    END IF;
END $$;