-- Якщо ще не увімкнено UUID генерацію
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO gemini_api_keys (
  id,
  api_key,
  name,
  project_name,
  project_number,
  used_today,
  usage_limit,
  is_active,
  usage_date,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    'AQ.Ab8RN6LHU0Es7DZx23LE6Q93ExNCZe8V5pD5ycZk2gPSGMmpmw',
    'Simple CV Test',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6IcvBdNZKLzo21JlOghD0dnVOwW5kTzwoTGqwBu8GC76Q',
    'Simple CV Test 2',
    'projects/706998808591',
    '706998808591',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6IC3A44fWTi0GI_5-zB8UHtKEO-Tz1EoQmbazydpgSFKg',
    'Simple CV Test',
    'projects/706998808591',
    '706998808591',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6LLlgHt4qc0yW4-zuzFNzjAUErUnDzE8u7wdmx0-5UuFQ',
    'Simple-cv-test',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6JAT63l8y2Vj-hh_x6aVFRY0wq-qOeLGiSEkAo5q6_fNg',
    'Simple cv test 9',
    'projects/706998808591',
    '706998808591',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6KDgwYxhgzzb0DPCOxy2hGwYaR8V4-ogWwJGDFJZFn3gg',
    'Simple cv 3',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6LZoXVWcmc2mSfk61rHDGsolOCeI21GZvDc8areIZlSmg',
    'Simple cv test 4',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6Ig0kLUtrNLgbVI7GJ9P0CzEqa80AO8MYlpxy7xVPuqhg',
    'Simple cv test 5',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6IXCnNxAy9SBPurXR3pWeFYyDWQd4R7rOh_Z7cCz_gV3A',
    'Simple cv test 6',
    'projects/706998808591',
    '706998808591',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'AQ.Ab8RN6KeiPHzdCPuoaKVhL-y3PVgSSP_7qFp6qco-g7rE15n_w',
    'simple cv test 7',
    'projects/1002022305801',
    '1002022305801',
    0,
    10,
    true,
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT (api_key) DO NOTHING;