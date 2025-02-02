-- Create admin user profile
INSERT INTO profiles (id, role, created_at)
SELECT 
  id,
  'admin'::user_role,
  NOW()
FROM auth.users 
WHERE email = 'admin@adminvsa.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';