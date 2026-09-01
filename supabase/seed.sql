-- LexNova placeholder catalog
-- Realistic sample lecturers, programs, sessions, and published news.
-- Does not create Auth users, profiles, or registrations.

-- ---------------------------------------------------------------------------
-- Lecturers
-- ---------------------------------------------------------------------------
insert into public.lecturers (id, full_name, photo_url, bio, title)
values
  (
    'a1e1c8d0-4b21-4c3a-9f10-111111111111',
    'Elena Voss',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    'Elena Voss advises law firms and in-house teams on legal technology, data protection, and process design. She previously led legal operations at a regional firm and now teaches practitioners how to evaluate tools without losing professional judgment. She holds an LL.M. in Law and Technology and is admitted to practice in New York.',
    'Attorney, LL.M. (Law and Technology)'
  ),
  (
    'a1e1c8d0-4b21-4c3a-9f10-222222222222',
    'Samuel Okoye',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
    'Samuel Okoye is a public lawyer and former senior counsel at a national human-rights commission. His teaching focuses on administrative procedure, civic legal literacy, and how ordinary people encounter the state. He has designed continuing-education programs for advocates, journalists, and civil-society staff across East Africa and Europe.',
    'Counsel, LL.M. (Public Law)'
  );

-- ---------------------------------------------------------------------------
-- Programs
-- Mix of course/training and a spread of statuses as of September 2026.
-- ---------------------------------------------------------------------------
insert into public.programs (
  id,
  type,
  title,
  slug,
  short_description,
  full_description,
  target_audience,
  objectives,
  learning_outcomes,
  duration_text,
  start_date,
  end_date,
  registration_deadline,
  format,
  location,
  lecturer_id,
  max_participants,
  status,
  price
)
values
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    'course',
    'Legal Technology Fundamentals',
    'legal-technology-fundamentals',
    'A practical introduction to the tools, risks, and professional duties that shape legal work in a digital practice.',
    $desc$Most lawyers now work inside a stack of case-management systems, e-discovery platforms, and client portals — often without a shared language for what those tools actually do. This course walks through the core categories of legal technology, from document automation to knowledge management, and asks a harder question: when does a tool support professional judgment, and when does it quietly replace it?

Each week pairs a short lecture with a worked example drawn from small-firm and in-house practice. Participants leave with a framework for evaluating vendors, a clearer sense of confidentiality and competence duties, and a short implementation plan they can take back to their teams.$desc$,
    'Junior lawyers, legal operations staff, and practice managers who want a grounded overview rather than a product demo.',
    'Give participants a shared map of legal technology categories, the professional rules that apply to them, and a method for assessing tools before they are adopted.',
    'By the end of the course, participants will be able to classify common legal-tech products, identify confidentiality and competence issues in a proposed workflow, and prepare a short written recommendation for their organization.',
    '6 weeks, one evening session per week',
    '2026-10-07',
    '2026-11-18',
    '2026-09-28',
    'hybrid',
    'LexNova Civic Classroom and live online',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111',
    28,
    'registration_open',
    450.00
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-222222222222',
    'training',
    'AI and Law Training',
    'ai-and-law-training',
    'A two-day intensive on generative AI in legal work: what it can do, where it fails, and how to use it without breaching professional duties.',
    $desc$Generative AI is already in inboxes, research memos, and first drafts. This training is for lawyers and legal staff who need a clear, skeptical introduction — not a sales pitch. We cover how large language models produce text, typical failure modes (hallucinated authorities, confidential prompts, biased outputs), and a working policy for responsible use inside a practice.

Day one is conceptual and regulatory. Day two is practical: participants work through supervised exercises on research assistance, contract review, and client communication, then draft a short internal-use note for their own workplace.$desc$,
    'Practicing lawyers, paralegals, and compliance officers who are beginning to use (or are being asked to use) generative AI at work.',
    'Equip participants to use generative AI as a supervised assistant, to spot legally significant errors, and to explain the limits of these tools to colleagues and clients.',
    'Participants will be able to describe how a large language model generates an answer, apply a simple review checklist to AI-assisted work product, and outline an internal policy covering confidentiality, supervision, and disclosure.',
    'Two consecutive days, 9:30–16:30',
    '2027-01-15',
    '2027-01-16',
    '2026-12-18',
    'online',
    'Live online',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111',
    40,
    'coming_soon',
    320.00
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-333333333333',
    'course',
    'Administrative Law for Civic Advocates',
    'administrative-law-for-civic-advocates',
    'How public decisions are made, challenged, and explained — a course for people who work with government, not only against it.',
    $desc$This course is already underway. It is designed for journalists, community organizers, and nonprofit staff who regularly encounter licensing bodies, benefits agencies, and local councils. We read the structure of administrative action: notice, comment, discretion, reasons, and review. The emphasis is on reading a decision letter, locating the right forum, and knowing when to seek counsel.

Sessions mix doctrine with document workshops. Participants bring (or are given) redacted agency correspondence and practice turning it into a clear chronology and a set of next questions.$desc$,
    'Civic advocates, journalists, and nonprofit program staff who interact with public bodies and want a firmer legal map.',
    'Help non-lawyers recognize the legal shape of an administrative decision and prepare a disciplined record before they escalate a case.',
    'Participants will be able to identify the decision-maker and the legal basis in a typical agency letter, list the usual routes of internal and external review, and prepare a short briefing note for a supervising lawyer.',
    '8 weeks, Tuesday evenings',
    '2026-08-12',
    '2026-10-07',
    '2026-08-01',
    'in_person',
    '100 Civic Place, Suite 400',
    'a1e1c8d0-4b21-4c3a-9f10-222222222222',
    22,
    'in_progress',
    280.00
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-444444444444',
    'training',
    'Workplace Investigations Workshop',
    'workplace-investigations-workshop',
    'A completed three-day workshop on planning, interviewing, and writing up an internal investigation with procedural fairness in mind.',
    $desc$This intensive ran in May 2026 for HR leads, in-house counsel, and external investigators. It covered scoping an investigation, trauma-informed interviewing, note-taking, privilege, and the difference between findings of fact and recommendations. Participants worked from a single extended case file across three days, producing a short investigation report on the final afternoon.

The workshop is now closed. A revised edition is expected in 2027; join the LexNova mailing list or watch the programs page for dates.$desc$,
    'HR directors, in-house counsel, and investigators responsible for internal complaints.',
    'Give investigators a repeatable method that is fair to complainants and respondents and defensible if later reviewed.',
    'Participants were able to draft terms of reference, conduct a structured interview plan, and write findings that separate evidence from inference.',
    'Three days',
    '2026-05-12',
    '2026-05-14',
    '2026-04-25',
    'hybrid',
    'LexNova Civic Classroom and live online',
    'a1e1c8d0-4b21-4c3a-9f10-222222222222',
    18,
    'completed',
    690.00
  );

-- ---------------------------------------------------------------------------
-- Sessions for programs that are still upcoming or in progress.
-- ---------------------------------------------------------------------------
insert into public.program_sessions (
  program_id,
  session_date,
  start_time,
  end_time,
  location,
  format,
  lecturer_id
)
values
  -- Legal Technology Fundamentals (hybrid course)
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-10-07',
    '18:00',
    '20:00',
    'LexNova Civic Classroom and live online',
    'hybrid',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-10-14',
    '18:00',
    '20:00',
    'LexNova Civic Classroom and live online',
    'hybrid',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-10-21',
    '18:00',
    '20:00',
    'Live online',
    'online',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-10-28',
    '18:00',
    '20:00',
    'LexNova Civic Classroom and live online',
    'hybrid',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-11-04',
    '18:00',
    '20:00',
    'LexNova Civic Classroom and live online',
    'hybrid',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    '2026-11-18',
    '18:00',
    '20:30',
    'LexNova Civic Classroom and live online',
    'hybrid',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  -- AI and Law Training (two-day intensive)
  (
    'b2e2c8d0-4b21-4c3a-9f10-222222222222',
    '2027-01-15',
    '09:30',
    '16:30',
    'Live online',
    'online',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-222222222222',
    '2027-01-16',
    '09:30',
    '16:30',
    'Live online',
    'online',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  -- Administrative Law for Civic Advocates (remaining sessions)
  (
    'b2e2c8d0-4b21-4c3a-9f10-333333333333',
    '2026-09-09',
    '18:30',
    '20:30',
    '100 Civic Place, Suite 400',
    'in_person',
    'a1e1c8d0-4b21-4c3a-9f10-222222222222'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-333333333333',
    '2026-09-16',
    '18:30',
    '20:30',
    '100 Civic Place, Suite 400',
    'in_person',
    'a1e1c8d0-4b21-4c3a-9f10-222222222222'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-333333333333',
    '2026-09-23',
    '18:30',
    '20:30',
    '100 Civic Place, Suite 400',
    'in_person',
    'a1e1c8d0-4b21-4c3a-9f10-111111111111'
  ),
  (
    'b2e2c8d0-4b21-4c3a-9f10-333333333333',
    '2026-10-07',
    '18:30',
    '20:30',
    '100 Civic Place, Suite 400',
    'in_person',
    'a1e1c8d0-4b21-4c3a-9f10-222222222222'
  );

-- ---------------------------------------------------------------------------
-- Published news
-- ---------------------------------------------------------------------------
insert into public.news_articles (
  id,
  title,
  slug,
  cover_image_url,
  short_description,
  content,
  author,
  related_program_id,
  published,
  published_at
)
values
  (
    'c3e3c8d0-4b21-4c3a-9f10-111111111111',
    'Registration opens for Legal Technology Fundamentals',
    'registration-opens-legal-technology-fundamentals',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80',
    'Our autumn course with Elena Voss is now open. Six Tuesday evenings, hybrid attendance, and a focus on judgment rather than software catalogs.',
    $article$LexNova is now accepting registrations for Legal Technology Fundamentals, a six-week hybrid course beginning 7 October 2026.

The course is taught by Elena Voss, whose practice sits at the intersection of legal operations and professional ethics. It is intended for lawyers and legal staff who are already using digital tools — or are about to be asked to — and who want a clearer way to talk about risk, confidentiality, and competence.

Places are limited to 28 participants. The registration deadline is 28 September. Details, session dates, and the fee are on the program page.

If you are unsure whether the course or the shorter AI and Law Training is the better fit, write to us at hello@lexnova.org with a line about your role. We will point you to the right offering.$article$,
    'LexNova',
    'b2e2c8d0-4b21-4c3a-9f10-111111111111',
    true,
    '2026-08-26 09:00:00+00'
  ),
  (
    'c3e3c8d0-4b21-4c3a-9f10-222222222222',
    'New in 2027: AI and Law Training',
    'new-in-2027-ai-and-law-training',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    'A two-day online intensive on generative AI in legal practice will open for registration later this autumn.',
    $article$In January 2027 LexNova will run a two-day online training on generative artificial intelligence and the practice of law, taught by Elena Voss.

The program is deliberately small on spectacle. Day one covers how these systems produce text, where they fail, and which professional duties are already in play. Day two is supervised practice: research assistance, contract review, and client communication, followed by a short internal-policy exercise.

Registration is not yet open. We expect to publish the form in late October, with a deadline of 18 December 2026. If your organization may send a cohort, contact hello@lexnova.org and we can note your interest.

This offering sits alongside, rather than instead of, Legal Technology Fundamentals. The autumn course is the broader map; the January training is the closer look at AI.$article$,
    'Elena Voss',
    'b2e2c8d0-4b21-4c3a-9f10-222222222222',
    true,
    '2026-08-18 10:30:00+00'
  ),
  (
    'c3e3c8d0-4b21-4c3a-9f10-333333333333',
    'Workplace Investigations Workshop concludes',
    'workplace-investigations-workshop-concludes',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80',
    'Eighteen investigators spent three days in May on scoping, interviewing, and writing findings. A 2027 edition is planned.',
    $article$In mid-May, LexNova closed a three-day Workplace Investigations Workshop led by Samuel Okoye. The group — in-house counsel, HR leads, and external investigators — worked from a single extended case file, from terms of reference through a short final report.

The emphasis throughout was procedural fairness: how to hear a complainant and a respondent without collapsing the two roles, how to keep notes that would survive later scrutiny, and how to write findings that do not smuggle in recommendations.

Several participants asked for a follow-up on investigations involving remote work and digital evidence. We are considering that as a half-day add-on to the 2027 edition rather than a separate program. Dates will be announced on this page.

If you attended and would like a certificate of completion reissued, email hello@lexnova.org with the name used at registration.$article$,
    'Samuel Okoye',
    'b2e2c8d0-4b21-4c3a-9f10-444444444444',
    true,
    '2026-05-20 14:00:00+00'
  );
