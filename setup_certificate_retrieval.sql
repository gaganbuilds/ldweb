-- 1. Add recipient_email to certificates if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'certificates' AND column_name = 'recipient_email') THEN
        ALTER TABLE public.certificates ADD COLUMN recipient_email TEXT;
    END IF;
END $$;

-- 2. Create RPC function for secure certificate lookup
-- This function allows retrieving the certificate ID without exposing the entire table or using public SELECT permissions that might be too broad.
CREATE OR REPLACE FUNCTION public.get_certificate_id_by_details(p_name TEXT, p_email TEXT)
RETURNS TABLE (certificate_number TEXT, certificate_title TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT c.certificate_number, c.certificate_title
    FROM public.certificates c
    WHERE trim(lower(c.recipient_name)) = trim(lower(p_name))
      AND trim(lower(c.recipient_email)) = trim(lower(p_email));
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_certificate_id_by_details(TEXT, TEXT) TO authenticated, anon;
