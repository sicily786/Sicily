-- Guest checkout (anon role) failed because PostgREST evaluates the
-- orders SELECT policies (which reference customers) when returning
-- the inserted row. RLS still restricts actual row visibility; this
-- grant only allows the permission check itself to pass.
GRANT SELECT ON customers TO anon;
