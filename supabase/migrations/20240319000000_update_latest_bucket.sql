-- Update the "latest" bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'latest';

-- Add a policy to allow public access to files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'latest');