
-- Backfill job categories from discipline so filters work properly
UPDATE public.job_marketplace SET category = 'IT/Software'
  WHERE discipline = 'cse' OR job_title ILIKE ANY (ARRAY['%engineer%frontend%','%backend%','%data%','%network%','%software%','%developer%','%vlsi%']);
UPDATE public.job_marketplace SET category = 'Engineering'
  WHERE discipline IN ('eee','civil') AND category = 'General';
UPDATE public.job_marketplace SET category = 'IT/Software' WHERE category = 'General' AND discipline = 'cse';

-- Enrich existing companies with real public links / richer descriptions
UPDATE public.companies SET
  website = 'https://brainstation-23.com',
  logo_url = 'https://logo.clearbit.com/brainstation-23.com',
  description = 'Brain Station 23 is one of the largest software & IT services companies in Bangladesh, delivering enterprise web, mobile, cloud, and AI solutions to clients in 30+ countries. Founded in 2006, headquartered in Dhaka, with 1,300+ engineers.',
  industry = 'Software & IT Services'
WHERE slug = 'brain-station-23';

UPDATE public.companies SET
  website = 'https://www.grameenphone.com',
  logo_url = 'https://logo.clearbit.com/grameenphone.com',
  description = 'Grameenphone is the largest mobile network operator in Bangladesh, serving 80M+ subscribers. A subsidiary of Telenor Group, it pioneers 4G/5G rollout and digital services across the country.',
  industry = 'Telecommunications'
WHERE slug = 'grameenphone';

UPDATE public.companies SET
  website = 'https://tigerit.com',
  logo_url = 'https://logo.clearbit.com/tigerit.com',
  description = 'Tiger IT Bangladesh builds nationwide biometric, identity, and election systems for governments and enterprises across 20+ countries, including the Bangladesh National ID program.',
  industry = 'GovTech & Enterprise Software'
WHERE slug = 'tiger-it';

UPDATE public.companies SET
  website = 'https://www.bkash.com',
  logo_url = 'https://logo.clearbit.com/bkash.com',
  description = 'bKash is the leading mobile financial service in Bangladesh, with 70M+ users. Backed by BRAC Bank, IFC, Alipay, and SoftBank, processing billions in payments, remittances, and savings every month.',
  industry = 'Fintech & Mobile Money'
WHERE slug = 'bkash';

UPDATE public.companies SET
  website = 'https://remote.com',
  logo_url = 'https://logo.clearbit.com/remote.com',
  description = 'Remote Global hires distributed engineering and design talent worldwide, with a strong pipeline for Bangladesh-based professionals. Fully async culture, USD compensation, global benefits.',
  industry = 'Distributed Workforce'
WHERE slug = 'remote-global';

-- Add a few more notable companies so the list feels alive
INSERT INTO public.companies (name, slug, website, logo_url, industry, location, description) VALUES
('Pathao', 'pathao', 'https://pathao.com', 'https://logo.clearbit.com/pathao.com', 'Ride-hailing & Logistics', 'Dhaka, Bangladesh', 'Pathao is South Asia''s leading on-demand digital platform — ride-hailing, food delivery, parcel logistics, and fintech across Bangladesh and Nepal. Backed by Go-Jek and Openspace Ventures.'),
('Chaldal', 'chaldal', 'https://chaldal.com', 'https://logo.clearbit.com/chaldal.com', 'E-commerce & Quick Commerce', 'Dhaka, Bangladesh', 'Chaldal is Bangladesh''s largest online grocery, delivering 7,000+ products in under an hour from micro-warehouses across Dhaka, Chittagong, and Jashore.'),
('Shopify', 'shopify', 'https://shopify.com', 'https://logo.clearbit.com/shopify.com', 'E-commerce SaaS', 'Remote (Global)', 'Shopify powers millions of merchants worldwide and hires fully remote engineers, designers, and PMs — including from Bangladesh — across commerce, payments, and AI.'),
('GitLab', 'gitlab', 'https://gitlab.com', 'https://logo.clearbit.com/gitlab.com', 'DevOps SaaS', 'Remote (Global)', 'GitLab is the world''s largest all-remote company, building the leading DevSecOps platform. 2,000+ team members across 65+ countries.'),
('Vercel', 'vercel', 'https://vercel.com', 'https://logo.clearbit.com/vercel.com', 'Frontend Cloud', 'Remote (Global)', 'Vercel makes Next.js and the frontend cloud powering Nike, Notion, OpenAI, and millions of developers. Remote-first hiring globally.')
ON CONFLICT (slug) DO NOTHING;
