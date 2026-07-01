-- Idempotent baseline seed for external Supabase.
-- Repopulates reference tables so the app boots with content.
-- Safe to re-run: all inserts use ON CONFLICT DO NOTHING.

BEGIN;

-- ---------- Companies (logos auto-filled by default_company_logo) ----------
INSERT INTO public.companies (name, slug, website, location, logo_url)
VALUES
  ('Google',       'google',        'https://careers.google.com',   'Global',        'https://logo.clearbit.com/google.com'),
  ('Microsoft',    'microsoft',     'https://careers.microsoft.com','Global',        'https://logo.clearbit.com/microsoft.com'),
  ('Meta',         'meta',          'https://www.metacareers.com',  'Global',        'https://logo.clearbit.com/meta.com'),
  ('Amazon',       'amazon',        'https://www.amazon.jobs',      'Global',        'https://logo.clearbit.com/amazon.com'),
  ('Bkash',        'bkash',         'https://www.bkash.com',        'Dhaka, BD',     'https://logo.clearbit.com/bkash.com'),
  ('Brain Station 23','brain-station-23','https://brainstation-23.com','Dhaka, BD',  'https://logo.clearbit.com/brainstation-23.com'),
  ('Grameenphone', 'grameenphone',  'https://www.grameenphone.com', 'Dhaka, BD',     'https://logo.clearbit.com/grameenphone.com'),
  ('Pathao',       'pathao',        'https://pathao.com',           'Dhaka, BD',     'https://logo.clearbit.com/pathao.com')
ON CONFLICT (slug) DO NOTHING;

-- ---------- Sample marketplace jobs ----------
INSERT INTO public.job_marketplace (title, company, location, employment_type, description, apply_url, source, is_remote)
VALUES
  ('Software Engineer, New Grad', 'Google',    'Remote / Global', 'full_time',
   'Build products used by billions. CS fundamentals, DSA, one systems language.',
   'https://careers.google.com/jobs/results/?target_level=EARLY', 'seed', true),
  ('SDE I',                       'Amazon',    'Seattle / Remote','full_time',
   'Design, develop and maintain scalable services on AWS.',
   'https://www.amazon.jobs/en/teams/university-recruiting', 'seed', true),
  ('Junior Software Engineer',    'Bkash',     'Dhaka, BD',       'full_time',
   'Join Bangladesh''s largest fintech. Node.js / Java / SQL.',
   'https://www.bkash.com/en/career', 'seed', false),
  ('Trainee Software Engineer',   'Brain Station 23','Dhaka, BD', 'full_time',
   '6-month training + placement. Fresh CSE grads welcome.',
   'https://brainstation-23.com/career/', 'seed', false)
ON CONFLICT DO NOTHING;

-- ---------- Learning modules (subset — full CSE catalog) ----------
INSERT INTO public.learning_modules (title, discipline, difficulty, description, video_url, documentation_url)
VALUES
  ('Data Structures & Algorithms','cse','beginner',
   'Arrays, linked lists, trees, graphs, sorting, searching, complexity.',
   'https://www.youtube.com/watch?v=8hly31xKli0','https://www.geeksforgeeks.org/data-structures/'),
  ('Databases & SQL','cse','beginner',
   'Relational modeling, normalization, indexes, transactions, joins.',
   'https://www.youtube.com/watch?v=HXV3zeQKqGY','https://www.postgresql.org/docs/current/tutorial.html'),
  ('Networking','cse','beginner',
   'OSI/TCP-IP, HTTP, DNS, TLS, sockets, routing, subnetting.',
   'https://www.youtube.com/watch?v=qiQR5rTSshw','https://beej.us/guide/bgnet/'),
  ('Operating Systems','cse','intermediate',
   'Processes, threads, scheduling, memory, file systems, concurrency.',
   'https://www.youtube.com/watch?v=vBURTt97EkA','https://pages.cs.wisc.edu/~remzi/OSTEP/'),
  ('System Design','cse','intermediate',
   'Scalability, caching, load balancing, sharding, queues, CAP.',
   'https://www.youtube.com/watch?v=MbjObHmDbZo','https://github.com/donnemartin/system-design-primer'),
  ('Machine Learning','cse','intermediate',
   'Supervised/unsupervised learning, regression, classification, evaluation.',
   'https://www.youtube.com/watch?v=NWONeJKn6kc','https://scikit-learn.org/stable/user_guide.html'),
  ('Cybersecurity','cse','intermediate',
   'Threats, cryptography, web security, OWASP Top 10.',
   'https://www.youtube.com/watch?v=U_P23SqJaDc','https://owasp.org/www-project-top-ten/'),
  ('Cloud & DevOps','cse','intermediate',
   'CI/CD, Docker, Kubernetes, AWS/GCP basics, IaC.',
   'https://www.youtube.com/watch?v=j5Zsa_eOXeY','https://roadmap.sh/devops'),
  ('Git & GitHub','cse','beginner',
   'Version control, branching, PRs, collaboration workflows.',
   'https://www.youtube.com/watch?v=RGOj5yH7evk','https://git-scm.com/book/en/v2'),
  ('Object-Oriented Programming','cse','beginner',
   'Classes, inheritance, polymorphism, SOLID principles.',
   'https://www.youtube.com/watch?v=pTB0EiLXUC8','https://refactoring.guru/design-patterns'),
  ('Competitive Programming','cse','advanced',
   'Problem solving, greedy, DP, graphs, contests.',
   'https://www.youtube.com/watch?v=xAeiXy8-9Y8','https://cp-algorithms.com/')
ON CONFLICT DO NOTHING;

-- ---------- Storage bucket ----------
INSERT INTO storage.buckets (id, name, public)
VALUES ('interview-media', 'interview-media', false)
ON CONFLICT (id) DO NOTHING;

COMMIT;