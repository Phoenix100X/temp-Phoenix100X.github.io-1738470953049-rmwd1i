-- Check if profile exists
SELECT p.id, p.role, p.created_at, a.email
FROM auth.users a
LEFT JOIN public.profiles p ON a.id = p.id
WHERE a.email = 'vonzel@adminvsa.com';