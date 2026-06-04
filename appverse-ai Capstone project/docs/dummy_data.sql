-- ============================================================
-- AppVerse AI – Complete Seed / Dummy Data
-- Run AFTER schema.sql
-- ============================================================
USE appverse_db;

-- ─────────────────────────────────────────────────────────────
-- 1. USERS
--    All passwords: Test@123
--    BCrypt hash: $2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS
-- ─────────────────────────────────────────────────────────────
INSERT INTO users (username, email, password, full_name, role, is_active) VALUES
-- Admin
('admin',    'admin@appverse.ai',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'AppVerse Admin',   'ADMIN',     true),

-- Developers
('devuser1', 'dev1@example.com',    '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Alice Dev',        'DEVELOPER', true),
('devuser2', 'dev2@example.com',    '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Bob Studios',      'DEVELOPER', true),
('devuser3', 'dev3@example.com',    '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Rohan Mehta',      'DEVELOPER', true),
('devuser4', 'dev4@example.com',    '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Priya Sharma',     'DEVELOPER', true),
('devuser5', 'dev5@example.com',    '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Karan Verma',      'DEVELOPER', false),

-- Regular Users
('user1',    'user1@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Charlie User',     'USER',      true),
('user2',    'user2@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Diana Smith',      'USER',      true),
('user3',    'user3@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Eve Johnson',      'USER',      true),
('user4',    'user4@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Arjun Patel',      'USER',      true),
('user5',    'user5@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Neha Kapoor',      'USER',      true),
('user6',    'user6@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Vikram Singh',     'USER',      true),
('user7',    'user7@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Sunita Reddy',     'USER',      true),
('user8',    'user8@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Raj Malhotra',     'USER',      true),
('user9',    'user9@example.com',   '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Ananya Bose',      'USER',      true),
('user10',   'user10@example.com',  '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Deepak Joshi',     'USER',      false),
('user11',   'user11@example.com',  '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Pooja Nair',       'USER',      true),
('user12',   'user12@example.com',  '$2a$12$WUidDbHSwSti8HHpUMUUuOV9Zs7nW2b0QupPHha1ieskiJOhR03nS', 'Siddharth Kumar',  'USER',      true);


-- ─────────────────────────────────────────────────────────────
-- 2. APPS
--    developer_id: 2=devuser1, 3=devuser2, 7=devuser3, 8=devuser4
--    category_id:  1=Productivity, 2=Entertainment, 3=Education,
--                  4=Finance, 5=Health, 6=Social, 7=Utilities,
--                  8=Travel, 9=Shopping, 10=News
-- ─────────────────────────────────────────────────────────────
INSERT INTO apps (name, slug, description, short_desc, icon_url, developer_id, category_id, price, download_count, avg_rating, review_count, trending_score, status, version, size_mb, tags) VALUES

-- ── Productivity ──────────────────────────────────────────────
('TaskFlow AI', 'taskflow-ai',
 'TaskFlow AI is a next-generation task management app that uses artificial intelligence to prioritise your work, predict deadlines, and auto-schedule meetings. Integrates with Gmail, Slack, and Jira.',
 'AI-powered task manager that predicts deadlines',
 'https://picsum.photos/seed/taskflow/80/80',
 2, 1, 0.00, 8450, 4.70, 234, 9820.50, 'APPROVED', '2.3.1', 18.5,
 '["productivity", "ai", "task-management"]'),

('FocusZone', 'focuszone',
 'Minimalist deep work timer with Pomodoro technique, ambient sounds, and analytics. Helps you stay focused and track productive hours.',
 'Deep work timer with ambient sounds & analytics',
 'https://picsum.photos/seed/focuszone/80/80',
 2, 1, 49.00, 3200, 4.50, 98, 4100.00, 'APPROVED', '1.5.0', 8.2,
 '["productivity", "focus", "timer"]'),

('NoteSync Pro', 'notesync-pro',
 'A powerful note-taking app with real-time sync across all devices, markdown support, AI-powered search, smart tagging, and offline access. Perfect for students and professionals.',
 'Smart notes with AI search and real-time sync',
 'https://picsum.photos/seed/notesync/80/80',
 7, 1, 59.00, 4700, 4.55, 178, 5900.00, 'APPROVED', '3.2.0', 20.5,
 '["notes", "productivity", "sync"]'),

('MeetingMind', 'meetingmind',
 'AI-powered meeting assistant that transcribes, summarises, and creates action items from your calls. Integrates with Zoom, Google Meet, and Microsoft Teams.',
 'AI meeting notes and action items in seconds',
 'https://picsum.photos/seed/meetingmind/80/80',
 8, 1, 199.00, 2100, 4.75, 89, 2900.00, 'APPROVED', '1.1.0', 15.0,
 '["meetings", "productivity", "ai", "transcription"]'),

('HabitForge', 'habitforge',
 'Build lasting habits with science-backed streaks, reminders, and visual progress analytics. Includes guided habit templates and a supportive community.',
 'Science-backed habit tracker with streaks',
 'https://picsum.photos/seed/habitforge/80/80',
 7, 1, 0.00, 6300, 4.30, 241, 7600.00, 'APPROVED', '2.0.3', 10.8,
 '["habits", "productivity", "wellness"]'),

('VoiceJournal', 'voicejournal',
 'Voice-to-text journal with AI sentiment tracking and mood analysis over time.',
 'Journal your thoughts by voice with AI insights',
 'https://picsum.photos/seed/voicejournal/80/80',
 2, 1, 79.00, 0, 0.00, 0, 0.00, 'PENDING', '1.0.0', 14.0,
 '["journaling", "voice", "ai"]'),

-- ── Entertainment ─────────────────────────────────────────────
('StreamVault', 'streamvault',
 'Discover and manage all your streaming subscriptions in one place. AI-powered content recommendations across Netflix, Prime, Disney+ and more.',
 'All-in-one streaming hub with AI recommendations',
 'https://picsum.photos/seed/streamvault/80/80',
 3, 2, 0.00, 12300, 4.30, 412, 15600.00, 'APPROVED', '3.1.0', 24.0,
 '["entertainment", "streaming", "ai"]'),

('GameVault', 'gamevault',
 'Track your gaming library, get game recommendations, and connect with friends. Supports Steam, PlayStation, Xbox, and Nintendo.',
 'Gaming library manager with cross-platform sync',
 'https://picsum.photos/seed/gamevault/80/80',
 3, 2, 0.00, 6700, 4.60, 189, 8200.00, 'APPROVED', '1.8.2', 32.0,
 '["gaming", "entertainment", "social"]'),

('PodcastNest', 'podcastnest',
 'Discover and follow podcasts across every genre. Features AI-curated playlists, offline downloads, chapter support, and a sleep timer. Over 5 million episodes available.',
 'AI podcast discovery with offline playback',
 'https://picsum.photos/seed/podcastnest/80/80',
 8, 2, 0.00, 9100, 4.45, 315, 11000.00, 'APPROVED', '4.3.1', 27.0,
 '["podcasts", "entertainment", "audio"]'),

('ComicVerse', 'comicverse',
 'Read thousands of comics and manga online and offline. Supports right-to-left reading, bookmarks, and AI-powered genre recommendations. Weekly new releases from indie creators.',
 'Comics and manga with AI recommendations',
 'https://picsum.photos/seed/comicverse/80/80',
 7, 2, 49.00, 3800, 4.20, 134, 4700.00, 'APPROVED', '2.5.0', 38.0,
 '["comics", "manga", "entertainment", "reading"]'),

('AstroGuide AI', 'astroguide-ai',
 'Daily horoscopes, birth chart analysis, and AI-powered compatibility reports. Covers Vedic and Western astrology with beautiful visualisations.',
 'AI astrology with Vedic and Western charts',
 'https://picsum.photos/seed/astroguide/80/80',
 7, 2, 0.00, 0, 0.00, 0, 0.00, 'PENDING', '1.0.0', 22.0,
 '["astrology", "entertainment", "ai"]'),

-- ── Education ─────────────────────────────────────────────────
('LearnSpark', 'learnspark',
 'AI-powered learning platform that creates personalised study plans. Covers coding, mathematics, languages, and science with interactive quizzes.',
 'Personalised AI learning for any subject',
 'https://picsum.photos/seed/learnspark/80/80',
 2, 3, 99.00, 5100, 4.80, 321, 6800.00, 'APPROVED', '4.0.1', 45.0,
 '["education", "ai", "learning"]'),

('CodeMentor AI', 'codementor-ai',
 'Learn programming with an AI mentor that reviews your code, explains concepts, and guides you through projects. Supports Python, JavaScript, Java, and more.',
 'AI coding tutor with real-time code review',
 'https://picsum.photos/seed/codementor/80/80',
 3, 3, 149.00, 2800, 4.90, 156, 3900.00, 'APPROVED', '2.2.0', 28.0,
 '["coding", "education", "ai"]'),

('LangBridge', 'langbridge',
 'Learn any of 40 languages with AI-powered conversation practice, spaced repetition flashcards, and live tutors. Adaptive difficulty ensures you are always challenged at the right level.',
 'AI language learning with live tutor sessions',
 'https://picsum.photos/seed/langbridge/80/80',
 8, 3, 129.00, 7200, 4.85, 402, 9300.00, 'APPROVED', '5.0.0', 50.0,
 '["languages", "education", "ai", "learning"]'),

-- ── Finance ───────────────────────────────────────────────────
('WealthWatch', 'wealthwatch',
 'Personal finance app with AI-powered expense tracking, investment analysis, and financial goal planning. Connects to all major Indian banks.',
 'AI financial planner that tracks every rupee',
 'https://picsum.photos/seed/wealthwatch/80/80',
 2, 4, 0.00, 9800, 4.40, 287, 11200.00, 'APPROVED', '3.5.0', 22.0,
 '["finance", "budgeting", "investments"]'),

('CryptoRadar', 'cryptoradar',
 'Real-time crypto portfolio tracker with price alerts, AI market sentiment analysis, and DeFi yield tracking. Supports 500+ coins and wallets including WazirX and CoinDCX.',
 'Crypto portfolio with AI market sentiment',
 'https://picsum.photos/seed/cryptoradar/80/80',
 8, 4, 0.00, 5500, 3.90, 307, 6600.00, 'APPROVED', '2.7.0', 18.0,
 '["crypto", "finance", "portfolio", "investing"]'),

('TaxEase India', 'taxease-india',
 'File your ITR in under 10 minutes. Auto-imports Form 16, 26AS, and AIS data. AI-powered deduction finder maximises your refund. Supports all ITR forms including ITR-2 and ITR-3.',
 'File ITR in minutes with AI deduction finder',
 'https://picsum.photos/seed/taxease/80/80',
 7, 4, 299.00, 11200, 4.50, 567, 13600.00, 'APPROVED', '3.0.0', 12.0,
 '["tax", "finance", "india", "itr"]'),

-- ── Health ────────────────────────────────────────────────────
('FitMind', 'fitmind',
 'Holistic wellness app combining fitness tracking, meditation guides, sleep analysis, and mental health check-ins. Powered by AI mood detection.',
 'All-in-one wellness app with AI mood tracking',
 'https://picsum.photos/seed/fitmind/80/80',
 3, 5, 0.00, 7600, 4.65, 445, 9400.00, 'APPROVED', '5.1.0', 55.0,
 '["health", "fitness", "meditation"]'),

('MindfulSpace', 'mindfulspace',
 'Guided meditation and mindfulness app with 500+ sessions across stress, sleep, anxiety, and focus. Features a personalised daily plan and breathing exercises powered by AI.',
 'Guided meditation with personalised daily plans',
 'https://picsum.photos/seed/mindfulspace/80/80',
 8, 5, 0.00, 8800, 4.70, 389, 10900.00, 'APPROVED', '3.4.2', 40.0,
 '["meditation", "health", "mindfulness", "sleep"]'),

('NutritionAI', 'nutritionai',
 'Snap a photo of any meal and get instant calorie counts, macro breakdowns, and health scores. Includes a recipe builder, meal planner, and integration with fitness trackers.',
 'Snap meals for instant calorie and macro data',
 'https://picsum.photos/seed/nutritionai/80/80',
 7, 5, 79.00, 5900, 4.40, 223, 7200.00, 'APPROVED', '2.1.0', 33.0,
 '["nutrition", "health", "fitness", "ai"]'),

-- ── Social ────────────────────────────────────────────────────
('ConnectHub', 'connecthub',
 'Professional networking app with AI-powered job matching, skill endorsements, and intelligent connection suggestions for Indian professionals.',
 'AI-powered professional networking for India',
 'https://picsum.photos/seed/connecthub/80/80',
 2, 6, 0.00, 14200, 4.20, 623, 17800.00, 'APPROVED', '2.9.0', 19.0,
 '["social", "networking", "jobs"]'),

('SkillCircle', 'skillcircle',
 'Find local skill-swap communities. Teach what you know and learn what you want. Connect with people nearby who want to exchange skills — from music to coding to cooking.',
 'Swap skills with local community members',
 'https://picsum.photos/seed/skillcircle/80/80',
 8, 6, 0.00, 3200, 4.15, 141, 3900.00, 'APPROVED', '1.3.0', 16.0,
 '["social", "community", "skills", "local"]'),

-- ── Utilities ─────────────────────────────────────────────────
('CleanMaster AI', 'cleanmaster-ai',
 'AI-powered device cleaner that intelligently removes junk files, optimises RAM, manages app permissions, and boosts battery life.',
 'Smart device optimizer powered by AI',
 'https://picsum.photos/seed/cleanmaster/80/80',
 3, 7, 0.00, 22000, 4.10, 834, 26500.00, 'APPROVED', '6.2.1', 12.0,
 '["utilities", "cleaner", "performance"]'),

('ScanVault', 'scanvault',
 'AI-powered document scanner that auto-enhances, categorises, and stores your papers. OCR in 15 languages, smart folder suggestions, and encrypted cloud backup.',
 'AI document scanner with smart categorisation',
 'https://picsum.photos/seed/scanvault/80/80',
 7, 7, 0.00, 13500, 4.35, 492, 16300.00, 'APPROVED', '4.1.0', 11.0,
 '["scanner", "utilities", "ocr", "documents"]'),

('BatteryGuard', 'batteryguard',
 'Extend your phone battery life with smart charge scheduling, power-hungry app detection, and adaptive brightness automation. Backed by 3 years of device battery research.',
 'Smart battery health and charge manager',
 'https://picsum.photos/seed/batteryguard/80/80',
 8, 7, 0.00, 18700, 4.05, 721, 22400.00, 'APPROVED', '2.8.0', 7.0,
 '["battery", "utilities", "performance"]'),

('QuickSign', 'quicksign',
 'Legally binding e-signatures for individuals and businesses. Drag-and-drop fields, audit trails, and bulk send. Free for up to 3 documents per month.',
 'E-signature app with legal audit trails',
 'https://picsum.photos/seed/quicksign/80/80',
 8, 7, 0.00, 0, 0.00, 0, 0.00, 'PENDING', '1.0.0', 9.5,
 '["esignature", "utilities", "business"]'),

-- ── Travel ────────────────────────────────────────────────────
('TripNest India', 'tripnest-india',
 'Plan complete India trips with AI-powered itinerary builder, hotel and train comparisons, offline maps, and real-time weather. Supports UPI payments and integrates with IRCTC and MakeMyTrip for seamless booking.',
 'AI travel planner with IRCTC and hotel booking',
 'https://picsum.photos/seed/tripnest/80/80',
 7, 8, 0.00, 14200, 4.45, 538, 17310.00, 'APPROVED', '3.1.0', 45.0,
 '["travel", "india", "itinerary", "booking", "irctc"]'),

('PackSmart', 'packsmart',
 'Never forget what to pack again. AI-powered packing lists based on your destination, trip duration, weather forecast, and activities. Includes family trip modes, shared lists, and a baggage weight calculator.',
 'Smart packing lists tailored to your destination',
 'https://picsum.photos/seed/packsmart/80/80',
 8, 8, 29.00, 5800, 4.25, 212, 5210.00, 'APPROVED', '2.0.1', 14.5,
 '["travel", "packing", "trip", "planner"]'),

-- ── Shopping ──────────────────────────────────────────────────
('DealRadar', 'dealradar',
 'Track prices across Flipkart, Amazon, Myntra, and Meesho in one place. Get notified the moment a product hits your target price. Includes price history graphs, cashback aggregation, and coupon stacking.',
 'Price tracker and deal alerts across Indian stores',
 'https://picsum.photos/seed/dealradar/80/80',
 8, 9, 0.00, 21500, 4.35, 892, 15610.00, 'APPROVED', '4.2.0', 22.0,
 '["shopping", "deals", "price tracker", "flipkart", "amazon"]'),

('StyleMatch AI', 'stylematch-ai',
 'Upload a photo of an outfit you love and StyleMatch finds identical or similar items from 30+ Indian fashion retailers at the best price. Includes a virtual try-on feature and personalised wardrobe recommendations.',
 'Find any outfit online with a photo snap',
 'https://picsum.photos/seed/stylematch/80/80',
 7, 9, 0.00, 9300, 4.50, 374, 7380.00, 'APPROVED', '2.3.0', 31.0,
 '["shopping", "fashion", "ai", "style", "wardrobe"]'),

-- ── News ──────────────────────────────────────────────────────
('BrieflyAI News', 'brieflyai-news',
 'Get personalised news summaries in 60 seconds. AI reads thousands of articles from Indian and global sources and delivers a crisp morning brief tailored to your interests. Supports English, Hindi, and 8 regional languages.',
 'Personalised AI news briefs in your language',
 'https://picsum.photos/seed/brieflyai/80/80',
 7, 10, 0.00, 17800, 4.55, 641, 14490.00, 'APPROVED', '3.0.2', 24.0,
 '["news", "ai", "regional languages", "personalised"]'),

('FactCheck India', 'factcheck-india',
 'Combat misinformation with real-time fact checks on viral news and WhatsApp forwards. AI cross-references claims against 500+ verified sources and rates credibility. Includes a community reporting feature.',
 'Fact-check viral news and WhatsApp forwards instantly',
 'https://picsum.photos/seed/factcheck/80/80',
 8, 10, 0.00, 8400, 4.40, 296, 6800.00, 'APPROVED', '2.1.0', 16.5,
 '["news", "fact check", "misinformation", "india"]'),

('DeepDive Weekly', 'deepdive-weekly',
 'Long-form journalism and investigative reports curated by editors from leading Indian publications. Ad-free reading, offline access, audio narration, and exclusive subscriber-only stories every week.',
 'Ad-free long-form journalism and investigative reads',
 'https://picsum.photos/seed/deepdive/80/80',
 7, 10, 149.00, 3200, 4.70, 118, 3800.00, 'APPROVED', '1.4.0', 11.0,
 '["news", "journalism", "long-form", "ad-free"]');


-- ─────────────────────────────────────────────────────────────
-- 3. REVIEWS
--    Grouped by app for readability.
--    is_flagged = true marks reviews requiring moderation.
-- ─────────────────────────────────────────────────────────────
INSERT INTO reviews (app_id, user_id, rating, title, content, sentiment, sentiment_score, is_flagged, is_fake) VALUES

-- ── TaskFlow AI (app 1) ───────────────────────────────────────
(1, 4, 5, 'Game changer for productivity!',
 'TaskFlow AI has completely transformed how I manage my work. The AI scheduling is incredibly smart and the deadline predictions are spot on. Cannot recommend enough!',
 'POSITIVE', 0.9200, false, false),

(1, 5, 4, 'Great app, minor bugs',
 'Really love this app and use it daily. The AI features are impressive. Just a few small bugs with the calendar sync but overall excellent.',
 'POSITIVE', 0.7600, false, false),

(1, 6, 3, 'Good but expensive premium',
 'The free tier is decent but to unlock all AI features you need premium. Features are good but the price point feels a bit steep.',
 'NEUTRAL', 0.5200, false, false),

(1, 7, 5, 'Best task app I have ever used',
 'Switched from Notion and Todoist and never looked back. The AI deadline prediction is scary good. It told me my report would take 4 hours and it took 4.5. Absolutely brilliant.',
 'POSITIVE', 0.9400, false, false),

(1, 8, 4, 'Love it but needs a widget',
 'The app is fantastic and the AI scheduling genuinely helps. Only thing missing is a home screen widget so I can see today tasks without opening the app.',
 'POSITIVE', 0.7100, false, false),

(1, 9, 5, 'Great for team use too',
 'We use this for our 6-person startup. Assigning tasks, tracking progress, the Jira sync works flawlessly. Worth every rupee of the premium subscription.',
 'POSITIVE', 0.8800, false, false),

-- ── FocusZone (app 2) ─────────────────────────────────────────
(2, 4, 5, 'Simple and beautiful',
 'Everything a Pomodoro app should be. The rain sounds are incredible and the weekly analytics keep me accountable. Have completed 200+ sessions since installing.',
 'POSITIVE', 0.9100, false, false),

(2, 10, 3, 'Good but no free tier worth using',
 'The app is polished but the free version only gives you 5 sessions a day. That is barely enough. The premium is a bit pricey for what is essentially a timer.',
 'NEUTRAL', 0.4800, false, false),

(2, 11, 4, 'Helped me study for UPSC',
 'Used this religiously for 8 months while preparing for UPSC prelims. The streak feature kept me disciplined. Cleared prelims this year! Small contribution but still.',
 'POSITIVE', 0.8300, false, false),

-- ── StreamVault (app 3) ───────────────────────────────────────
(3, 4, 5, 'Best streaming app out there',
 'StreamVault is amazing! It finds shows I actually want to watch instead of the same recommendations I always get. Worth every minute.',
 'POSITIVE', 0.8800, false, false),

(3, 5, 2, 'Too many ads on free tier',
 'The app is okay but the free tier has way too many ads. The recommendations are good but crashes sometimes on older phones.',
 'NEGATIVE', 0.3100, false, false),

(3, 7, 4, 'Finally organises all my subscriptions',
 'I had 5 streaming services and kept forgetting what was where. StreamVault solves this perfectly. Recommendations are solid and save me a lot of browsing time.',
 'POSITIVE', 0.7800, false, false),

(3, 8, 3, 'Good concept, slow on older devices',
 'The idea is great but the app is sluggish on my 2021 phone. Recommendations take too long to load. Hopefully they optimise it.',
 'NEUTRAL', 0.4500, false, false),

-- ── GameVault (app 4) ─────────────────────────────────────────
(4, 5, 5, 'Perfect for multi-platform gamers',
 'I own games on Steam, PS5, and Switch. GameVault ties them all together beautifully. The friend activity feed is a nice touch and the backlog tracker is super useful.',
 'POSITIVE', 0.9200, false, false),

(4, 9, 4, 'Great app, Xbox sync needs work',
 'Most things work great. Xbox integration is a bit hit-or-miss with achievements not syncing properly. Steam and PlayStation work perfectly though.',
 'POSITIVE', 0.6900, false, false),

(4, 11, 5, 'The recommendations are on point',
 'It suggested Hollow Knight based on my Dark Souls playtime and it became my favourite game. The AI clearly understands gaming taste. Very impressed.',
 'POSITIVE', 0.9300, false, false),

-- ── LearnSpark (app 5) ────────────────────────────────────────
(5, 6, 5, 'Changed my learning journey',
 'LearnSpark helped me pass my JEE exam! The personalised study plan was exactly what I needed. The AI tutor explains concepts so clearly.',
 'POSITIVE', 0.9500, false, false),

(5, 7, 5, 'Worth every rupee for students',
 'My daughter uses this for Class 10 boards prep. Her marks in Maths went from 65 to 88 in one term. The personalised practice questions are way better than any coaching.',
 'POSITIVE', 0.9600, false, false),

(5, 8, 4, 'Excellent for coding interviews too',
 'Used the DSA module to prepare for campus placements. Got placed at a top MNC. The timed quizzes simulate the actual pressure of an interview really well.',
 'POSITIVE', 0.8400, false, false),

(5, 12, 2, 'Content is sometimes outdated',
 'Some topics in the science module still reference old NCERT chapters that were updated. The AI is helpful but the content team needs to stay current.',
 'NEGATIVE', 0.3200, false, false),

-- ── CodeMentor AI (app 6) ─────────────────────────────────────
(6, 4, 5, 'Better than a bootcamp',
 'Spent 3 months with CodeMentor AI learning full-stack JavaScript. The code review feature catches mistakes I would never have caught myself. Landed my first dev job.',
 'POSITIVE', 0.9700, false, false),

(6, 9, 5, 'The Python module is outstanding',
 'The way it explains data structures with interactive examples is unlike anything I have seen. Even complex concepts like dynamic programming become intuitive.',
 'POSITIVE', 0.9400, false, false),

(6, 12, 4, 'Wish it covered more languages',
 'The supported languages are great but I really want Go and Rust. The team has mentioned it on their blog so hopefully coming soon. Currently 4 stars.',
 'POSITIVE', 0.6600, false, false),

-- ── WealthWatch (app 7) ───────────────────────────────────────
(7, 4, 4, 'Solid finance app',
 'WealthWatch has good expense tracking and the bank integration works great. The investment analysis could be better but overall very useful.',
 'POSITIVE', 0.7200, false, false),

(7, 8, 5, 'Tracking every rupee effortlessly',
 'Connected to SBI, HDFC, and Zerodha in under 5 minutes. The expense categorisation is surprisingly accurate and the monthly reports help me budget better.',
 'POSITIVE', 0.9000, false, false),

(7, 9, 3, 'Investment analysis is too basic',
 'The bank sync and expense tracking are excellent. But the mutual fund analysis section is very superficial. I still use a separate app for investment decisions.',
 'NEUTRAL', 0.5000, false, false),

(7, 11, 4, 'Helped me save 15% more each month',
 'After 3 months of using the spending insights, I identified subscriptions I had forgotten about and cut unnecessary food delivery spending. Real money saved.',
 'POSITIVE', 0.8100, false, false),

-- ── FitMind (app 8) ───────────────────────────────────────────
(8, 4, 4, 'Best free fitness app available',
 'Tracks steps, workouts, sleep, and mood all in one place. The AI mood detection sounds gimmicky but is actually useful for spotting burnout patterns. Highly recommended.',
 'POSITIVE', 0.8200, false, false),

(8, 5, 4, 'Best free fitness app available',
 'After 3 months of using the spending insights, I identified subscriptions I had forgotten about and cut unnecessary food delivery spending. Real money saved.',
 'POSITIVE', 0.8100, false, false),

(8, 10, 5, 'Sleep tracking changed my life',
 'I was chronically sleep-deprived without realising it. FitMind flagged my sleep quality as poor for 2 weeks and suggested small routine changes. My energy levels are transformed.',
 'POSITIVE', 0.9500, false, false),

(8, 12, 3, 'GPS is battery hungry',
 'Love the app overall but enabling GPS for outdoor runs drains battery fast. They should offer a lower accuracy mode for long runs.',
 'NEUTRAL', 0.4700, false, false),

-- ── ConnectHub (app 9) ────────────────────────────────────────
(9, 5, 4, 'Better than LinkedIn for Indian jobs',
 'The job matching is surprisingly relevant for Indian markets, especially tech and finance roles. Has connected me with recruiters from firms I genuinely wanted to work at.',
 'POSITIVE', 0.7800, false, false),

(9, 7, 3, 'Too many connection requests from recruiters',
 'The app works fine but the notification spam from recruiters is overwhelming. They need a smarter filter or a do-not-disturb mode.',
 'NEUTRAL', 0.4300, false, false),

-- ── CleanMaster AI (app 10) ───────────────────────────────────
(10, 5, 1, 'App keeps crashing',
 'This app is terrible and crashes every time I try to open it on my phone. Support is non-existent. Would not recommend.',
 'NEGATIVE', 0.1200, true, false),

(10, 6, 4, 'Freed up 3 GB on first scan',
 'Sceptical at first but it found 3 GB of cached junk I did not know about. The RAM optimiser is real and my phone does feel snappier after using it for a week.',
 'POSITIVE', 0.7600, false, false),

(10, 7, 2, 'Shows too many false positives',
 'Flags some system files as junk that clearly should not be deleted. Had to restore two apps after following its recommendations. Be careful with the one-tap clean.',
 'NEGATIVE', 0.2500, true, false),

-- ── NoteSync Pro (app 12) ─────────────────────────────────────
(12, 4, 5, 'Replaced Notion for me completely',
 'The markdown support is excellent and search is instant even with thousands of notes. The AI tagging saves so much manual organisation. Syncs perfectly between my phone and laptop.',
 'POSITIVE', 0.9100, false, false),

(12, 6, 4, 'Very polished, minor requests',
 'Clean, fast, and reliable. I would love a web clipper browser extension and a table of contents feature for long notes. Otherwise pretty much perfect.',
 'POSITIVE', 0.7400, false, false),

(12, 9, 5, 'Great for research and studying',
 'I use NoteSync to build a personal knowledge base for my PhD. The linked notes feature and the AI search make finding information from 2 years ago effortless.',
 'POSITIVE', 0.9200, false, false),

-- ── MeetingMind (app 13) ──────────────────────────────────────
(13, 5, 5, 'Saves me hours every week',
 'I was spending 2 hours writing meeting notes every day. MeetingMind handles it in seconds and the action item extraction is remarkably accurate. Worth the premium 100 times over.',
 'POSITIVE', 0.9600, false, false),

(13, 8, 4, 'Works great, slight privacy concern',
 'The transcription quality is impressive. I docked one star because it stores recordings on their servers for 30 days by default. Wish there was a local-only option.',
 'POSITIVE', 0.6800, false, false),

-- ── HabitForge (app 14) ───────────────────────────────────────
(14, 6, 5, 'Finally sticking to habits',
 'I have tried a dozen habit apps and always quit after a week. HabitForge is different. The science-backed reminders and the flexible streak recovery feel humane rather than punishing.',
 'POSITIVE', 0.9000, false, false),

(14, 10, 4, 'Love the community features',
 'The group accountability feature is genuinely motivating. My reading group has 12 members and seeing everyone check in daily keeps me honest. Wish there were more habit templates.',
 'POSITIVE', 0.7700, false, false),

(14, 11, 2, 'Notifications are aggressive',
 'The default notification settings are overwhelming. It reminds you every 15 minutes if a habit is overdue. I had to turn them off entirely which defeats the purpose.',
 'NEGATIVE', 0.2700, false, false),

-- ── PodcastNest (app 15) ──────────────────────────────────────
(15, 4, 5, 'Best podcast app on Android',
 'Tried Spotify, Google Podcasts, and Pocket Casts. PodcastNest has the best discovery algorithm by far. Variable playback speed and chapter support are buttery smooth.',
 'POSITIVE', 0.9200, false, false),

(15, 7, 4, 'Great but no video podcast support',
 'The audio podcast experience is excellent. Losing one star because it does not support video podcasts like some popular YouTube channels that publish audio too.',
 'POSITIVE', 0.6500, false, false),

(15, 12, 3, 'Download management could be better',
 'The app itself is good but downloaded episodes are hard to manage. No bulk delete, no storage limit warnings. Had it consume 8 GB before I noticed.',
 'NEUTRAL', 0.4400, false, false),

-- ── LangBridge (app 17) ───────────────────────────────────────
(17, 5, 5, 'Best language app for Indian users',
 'LangBridge understands Indian English accent perfectly unlike a certain popular green owl app. The Tamil and Telugu courses are genuinely well-made. Cleared B1 German in 6 months.',
 'POSITIVE', 0.9500, false, false),

(17, 9, 5, 'AI conversation practice is incredible',
 'The AI conversation partner does not let you get lazy. It corrects pronunciation, suggests better phrasing, and adapts to your level in real time. Nothing else comes close.',
 'POSITIVE', 0.9600, false, false),

(17, 10, 4, 'Excellent for Japanese',
 'The Kanji recognition exercises and mnemonics are well thought out. JLPT N4 practice tests closely match the real thing. Would give 5 stars if they added pitch accent training.',
 'POSITIVE', 0.7800, false, false),

-- ── TaxEase India (app 20) ────────────────────────────────────
(20, 6, 5, 'Filed ITR in 8 minutes',
 'Imported my Form 16 from Infosys, it auto-filled 90% of the form, found a HRA deduction I had missed, and I was done in 8 minutes. E-verification worked instantly.',
 'POSITIVE', 0.9700, false, false),

(20, 7, 4, 'Great for salaried employees',
 'Very smooth for standard salaried ITR-1 filing. Slightly more manual for my rental income in ITR-2 but still much faster than CA portal. Good value at 299.',
 'POSITIVE', 0.7400, false, false),

(20, 8, 1, 'Lost data mid-session',
 'Was halfway through ITR-3 for my freelance income when the app crashed and wiped all my entries. No autosave, no recovery. Had to start from scratch. Very frustrating.',
 'NEGATIVE', 0.0900, true, false),

-- ── MindfulSpace (app 21) ─────────────────────────────────────
(21, 4, 4, 'Good but some sessions feel repetitive',
 'The meditation library is huge but the free daily sessions cycle through the same 20-30 meditations too quickly. Premium variety is worth it if you meditate daily.',
 'POSITIVE', 0.6900, false, false),

(21, 11, 5, 'Transformed my sleep',
 'Was waking up 3-4 times a night. After 3 weeks of the sleep hygiene programme the app built for me, I am sleeping through the night. Nothing short of life-changing.',
 'POSITIVE', 0.9600, false, false),

(21, 12, 5, 'Best free mental health resource available',
 'As a college student I cannot afford therapy. MindfulSpace is not a replacement but the breathing exercises and CBT-lite modules have genuinely helped my anxiety. Grateful it is free.',
 'POSITIVE', 0.9400, false, false),

-- ── NutritionAI (app 22) ──────────────────────────────────────
(22, 5, 4, 'Photo recognition is impressive',
 'Scanned a plate of biryani and it correctly identified rice, chicken, and raita with reasonable calorie estimates for Indian portion sizes. Far better than US-centric competitors.',
 'POSITIVE', 0.8100, false, false),

(22, 9, 3, 'Accuracy drops for street food',
 'Works well for packaged foods and common dishes. Struggles with regional street food and home-cooked meals. Had to manually enter entries for about 30% of my meals.',
 'NEUTRAL', 0.4900, false, false),

-- ── ScanVault (app 24) ────────────────────────────────────────
(24, 6, 5, 'Replaced my flatbed scanner entirely',
 'The edge detection and perspective correction are excellent. Scanned 200 pages of old family documents in an afternoon. OCR quality on Hindi text is better than I expected.',
 'POSITIVE', 0.9000, false, false),

(24, 7, 4, 'Great but cloud storage limit',
 'The app is superb but 5 GB of free storage fills up fast for document-heavy users. Either increase the free tier or offer competitive pricing for more storage.',
 'POSITIVE', 0.7100, false, false),

(24, 8, 5, 'Essential for professionals',
 'Use this daily to scan contracts, receipts, and invoices. The smart categorisation saves hours of manual filing. The encrypted backup gives me peace of mind.',
 'POSITIVE', 0.9200, false, false),

-- ── BatteryGuard (app 25) ─────────────────────────────────────
(25, 9, 4, 'Extends battery by about 20%',
 'With charge scheduling set to 80% limit and adaptive brightness on, my battery lasts noticeably longer. The power-hungry app list exposed Chrome and Instagram as the culprits.',
 'POSITIVE', 0.7900, false, false),

(25, 10, 3, 'Good idea but too many ads',
 'The core features work but the free version shows ads every time you run a battery check. Gets annoying fast. Would pay a small amount for an ad-free version.',
 'NEUTRAL', 0.4600, false, false),

(25, 11, 2, 'Made my battery worse somehow',
 'After installing BatteryGuard my phone runs hotter and the battery drains faster. I think the background monitoring itself is the problem. Uninstalled after a week.',
 'NEGATIVE', 0.2100, true, false),

-- ── TripNest India (app 42) ───────────────────────────────────
(42, 4, 5, 'Planned my entire Rajasthan trip in 20 mins',
 'The AI itinerary builder suggested a 7-day Rajasthan route, booked trains via IRCTC, and found the best-priced havelis all in one session. Worked flawlessly on actual travel days too.',
 'POSITIVE', 0.9500, false, false),

(42, 9, 4, 'Great app but offline maps are limited',
 'IRCTC integration and hotel comparisons are brilliant. The offline maps only cover major cities. Smaller towns like Hampi and Spiti Valley had gaps. Would love full offline support.',
 'POSITIVE', 0.6800, false, false),

(42, 11, 5, 'Price alert saved me 4000 rupees',
 'Set a fare alert for Mumbai to Leh. Got notified when IndiGo dropped prices and booked instantly. Best feature of the app by far.',
 'POSITIVE', 0.9300, false, false),

-- ── PackSmart (app 43) ────────────────────────────────────────
(43, 6, 5, 'Genius for family trips',
 'Travelling with two kids and in-laws is chaotic. PackSmart generated separate packing lists for each family member based on destination weather and activities. Saved us from a very cold Manali night.',
 'POSITIVE', 0.9100, false, false),

(43, 10, 3, 'Good but suggestions are too generic',
 'The list is a solid starting point but it suggested sunscreen for a December Shimla trip and missed hand warmers. The AI needs more contextual awareness.',
 'NEUTRAL', 0.4700, false, false),

-- ── DealRadar (app 44) ────────────────────────────────────────
(44, 7, 5, 'Saved over 12000 rupees in 3 months',
 'Set price targets on a laptop and a mixer grinder. Both hit my targets within 6 weeks. The price history graph shows whether a sale is genuine or a fake discount.',
 'POSITIVE', 0.9400, false, false),

(44, 4, 4, 'Excellent but Meesho tracking is unreliable',
 'Amazon and Flipkart tracking are rock solid. Meesho prices update with a 24-hour lag sometimes which makes alerts a bit late.',
 'POSITIVE', 0.7100, false, false),

(44, 8, 2, 'Cashback section is misleading',
 'The cashback offers shown are often expired or require hidden minimum cart sizes. Wasted 30 minutes trying to apply one that had already ended.',
 'NEGATIVE', 0.2900, false, false),

-- ── StyleMatch AI (app 45) ────────────────────────────────────
(45, 11, 5, 'Found the exact kurta I saw on Instagram',
 'Screenshotted a kurta from a Reel, uploaded it, and StyleMatch found the same design on Myntra for 40 percent less than the influencer link.',
 'POSITIVE', 0.9600, false, false),

(45, 5, 4, 'Virtual try-on is impressive for a free app',
 'The try-on accuracy is not perfect for all body types but genuinely useful for colours and silhouettes. Saved me two returns last month.',
 'POSITIVE', 0.7800, false, false),

-- ── BrieflyAI News (app 46) ───────────────────────────────────
(46, 4, 5, 'My morning routine changed completely',
 'I used to spend 45 minutes scrolling news before work. BrieflyAI gives me a sharp 5-minute brief covering everything I care about.',
 'POSITIVE', 0.9300, false, false),

(46, 7, 5, 'Best use of AI in a news app',
 'It clusters related stories so you see the full picture. When the budget was announced I got a clean multi-angle summary in under 2 minutes.',
 'POSITIVE', 0.9100, false, false),

(46, 12, 4, 'Great but political coverage feels filtered',
 'Tech and business briefs are superb. Political news occasionally feels sanitised with strong opinions smoothed out.',
 'POSITIVE', 0.6700, false, false),

-- ── FactCheck India (app 47) ──────────────────────────────────
(47, 8, 5, 'Every WhatsApp group needs this',
 'My family forwards fake news constantly. I paste the text here and get a verdict in seconds.',
 'POSITIVE', 0.9600, false, false),

(47, 10, 4, 'Solid but slower on regional language forwards',
 'English and Hindi fact checks are near instant. Marathi and Bengali forwards take noticeably longer and are occasionally less confident.',
 'POSITIVE', 0.7400, false, false);


-- ─────────────────────────────────────────────────────────────
-- 4. DOWNLOADS
-- ─────────────────────────────────────────────────────────────
INSERT INTO downloads (app_id, user_id, platform, downloaded_at) VALUES

-- ── Original apps – initial batch ────────────────────────────
(1,  4,  'Android', NOW() - INTERVAL 5  DAY),
(1,  5,  'Android', NOW() - INTERVAL 3  DAY),
(1,  6,  'iOS',     NOW() - INTERVAL 1  DAY),
(3,  4,  'Android', NOW() - INTERVAL 7  DAY),
(3,  6,  'iOS',     NOW() - INTERVAL 2  DAY),
(5,  5,  'Android', NOW() - INTERVAL 4  DAY),
(7,  4,  'iOS',     NOW() - INTERVAL 6  DAY),
(8,  5,  'Android', NOW() - INTERVAL 1  DAY),
(9,  6,  'Android', NOW() - INTERVAL 2  DAY),
(10, 4,  'Android', NOW() - INTERVAL 3  DAY),

-- ── Existing apps – additional users ─────────────────────────
(1,  7,  'Android', NOW() - INTERVAL 2  DAY),
(1,  8,  'iOS',     NOW() - INTERVAL 1  DAY),
(1,  9,  'Android', NOW() - INTERVAL 4  DAY),
(2,  7,  'iOS',     NOW() - INTERVAL 6  DAY),
(2,  9,  'Android', NOW() - INTERVAL 3  DAY),
(2,  11, 'Android', NOW() - INTERVAL 10 DAY),
(3,  7,  'iOS',     NOW() - INTERVAL 5  DAY),
(3,  8,  'Android', NOW() - INTERVAL 3  DAY),
(4,  5,  'Android', NOW() - INTERVAL 2  DAY),
(4,  9,  'iOS',     NOW() - INTERVAL 8  DAY),
(4,  11, 'Android', NOW() - INTERVAL 4  DAY),
(5,  7,  'Android', NOW() - INTERVAL 3  DAY),
(5,  8,  'iOS',     NOW() - INTERVAL 1  DAY),
(5,  12, 'Android', NOW() - INTERVAL 6  DAY),
(6,  4,  'iOS',     NOW() - INTERVAL 5  DAY),
(6,  9,  'Android', NOW() - INTERVAL 2  DAY),
(6,  12, 'iOS',     NOW() - INTERVAL 7  DAY),
(7,  8,  'Android', NOW() - INTERVAL 2  DAY),
(7,  9,  'iOS',     NOW() - INTERVAL 4  DAY),
(7,  11, 'Android', NOW() - INTERVAL 9  DAY),
(8,  4,  'Android', NOW() - INTERVAL 3  DAY),
(8,  10, 'iOS',     NOW() - INTERVAL 1  DAY),
(8,  12, 'Android', NOW() - INTERVAL 5  DAY),
(9,  5,  'iOS',     NOW() - INTERVAL 4  DAY),
(9,  7,  'Android', NOW() - INTERVAL 6  DAY),
(10, 6,  'Android', NOW() - INTERVAL 3  DAY),
(10, 7,  'iOS',     NOW() - INTERVAL 5  DAY),

-- ── New apps (NoteSync Pro through BatteryGuard) ──────────────
(12, 4,  'Android', NOW() - INTERVAL 1  DAY),
(12, 6,  'iOS',     NOW() - INTERVAL 2  DAY),
(12, 9,  'Android', NOW() - INTERVAL 4  DAY),
(12, 11, 'iOS',     NOW() - INTERVAL 7  DAY),
(13, 5,  'iOS',     NOW() - INTERVAL 2  DAY),
(13, 8,  'Android', NOW() - INTERVAL 3  DAY),
(14, 6,  'Android', NOW() - INTERVAL 1  DAY),
(14, 10, 'iOS',     NOW() - INTERVAL 3  DAY),
(14, 11, 'Android', NOW() - INTERVAL 5  DAY),
(15, 4,  'Android', NOW() - INTERVAL 2  DAY),
(15, 7,  'iOS',     NOW() - INTERVAL 4  DAY),
(15, 12, 'Android', NOW() - INTERVAL 6  DAY),
(16, 5,  'Android', NOW() - INTERVAL 3  DAY),
(16, 9,  'iOS',     NOW() - INTERVAL 5  DAY),
(17, 5,  'iOS',     NOW() - INTERVAL 1  DAY),
(17, 9,  'Android', NOW() - INTERVAL 2  DAY),
(17, 10, 'iOS',     NOW() - INTERVAL 4  DAY),
(18, 6,  'Android', NOW() - INTERVAL 3  DAY),
(18, 11, 'iOS',     NOW() - INTERVAL 6  DAY),
(19, 4,  'Android', NOW() - INTERVAL 2  DAY),
(19, 8,  'iOS',     NOW() - INTERVAL 4  DAY),
(20, 6,  'Android', NOW() - INTERVAL 1  DAY),
(20, 7,  'iOS',     NOW() - INTERVAL 2  DAY),
(20, 8,  'Android', NOW() - INTERVAL 3  DAY),
(21, 4,  'iOS',     NOW() - INTERVAL 1  DAY),
(21, 11, 'Android', NOW() - INTERVAL 2  DAY),
(21, 12, 'iOS',     NOW() - INTERVAL 3  DAY),
(22, 5,  'Android', NOW() - INTERVAL 2  DAY),
(22, 9,  'iOS',     NOW() - INTERVAL 4  DAY),
(23, 7,  'Android', NOW() - INTERVAL 5  DAY),
(23, 10, 'iOS',     NOW() - INTERVAL 3  DAY),
(24, 6,  'iOS',     NOW() - INTERVAL 1  DAY),
(24, 7,  'Android', NOW() - INTERVAL 2  DAY),
(24, 8,  'iOS',     NOW() - INTERVAL 4  DAY),
(25, 9,  'Android', NOW() - INTERVAL 2  DAY),
(25, 10, 'iOS',     NOW() - INTERVAL 3  DAY),
(25, 11, 'Android', NOW() - INTERVAL 5  DAY),

-- ── Travel, Shopping & News apps ─────────────────────────────
(42, 4,  'Android', NOW() - INTERVAL 3  DAY),
(42, 9,  'iOS',     NOW() - INTERVAL 5  DAY),
(42, 11, 'Android', NOW() - INTERVAL 2  DAY),
(42, 6,  'iOS',     NOW() - INTERVAL 8  DAY),
(43, 6,  'Android', NOW() - INTERVAL 4  DAY),
(43, 10, 'iOS',     NOW() - INTERVAL 6  DAY),
(44, 7,  'Android', NOW() - INTERVAL 1  DAY),
(44, 4,  'iOS',     NOW() - INTERVAL 3  DAY),
(44, 8,  'Android', NOW() - INTERVAL 2  DAY),
(44, 11, 'iOS',     NOW() - INTERVAL 4  DAY),
(45, 11, 'Android', NOW() - INTERVAL 2  DAY),
(45, 5,  'iOS',     NOW() - INTERVAL 3  DAY),
(45, 9,  'Android', NOW() - INTERVAL 6  DAY),
(46, 4,  'iOS',     NOW() - INTERVAL 1  DAY),
(46, 12, 'Android', NOW() - INTERVAL 2  DAY),
(46, 7,  'iOS',     NOW() - INTERVAL 3  DAY),
(46, 8,  'Android', NOW() - INTERVAL 5  DAY),
(47, 8,  'Android', NOW() - INTERVAL 2  DAY),
(47, 10, 'iOS',     NOW() - INTERVAL 4  DAY),
(47, 5,  'Android', NOW() - INTERVAL 6  DAY);


-- ─────────────────────────────────────────────────────────────
-- 5. RECALCULATE TRENDING SCORES
--    Formula: (download_count × 0.6) + (avg_rating × 0.4 × 100)
-- ─────────────────────────────────────────────────────────────
UPDATE apps
SET trending_score = (download_count * 0.6) + (avg_rating * 0.4 * 100)
WHERE status = 'APPROVED';