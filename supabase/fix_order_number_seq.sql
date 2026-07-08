-- The order_number auto-generation trigger runs as the calling role
-- (anon/authenticated for public checkout), but only the sequence
-- owner had USAGE rights — every order insert was silently failing.
GRANT USAGE, SELECT ON SEQUENCE orders_order_number_seq TO anon, authenticated;

-- Belt-and-suspenders: make the trigger function run with the
-- privileges of its owner so this class of grant issue can't recur.
ALTER FUNCTION set_order_number() SECURITY DEFINER;
