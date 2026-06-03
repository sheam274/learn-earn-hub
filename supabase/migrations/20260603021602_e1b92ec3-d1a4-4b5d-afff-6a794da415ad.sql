
-- Add resources column for learning modules (docs, pdfs, links from w3schools etc.)
ALTER TABLE public.learning_modules
  ADD COLUMN IF NOT EXISTS resources JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Replace placeholder videos with real, topic-relevant YouTube videos
-- and seed documentation_body + W3Schools / MDN resources.

-- CSE: Web Development
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/G3e-cpL7ofc',
  documentation_body = E'HTML, CSS, and JavaScript are the three pillars of the modern web.\n- HTML structures the page (semantic tags, forms, accessibility).\n- CSS styles it (the box model, flexbox, grid, responsive design).\n- JavaScript adds behavior (DOM, events, fetch, async/await).\nLearn by building: a portfolio, a todo app, and a small REST-backed dashboard.',
  resources = '[
    {"label":"W3Schools — HTML Tutorial","type":"docs","url":"https://www.w3schools.com/html/"},
    {"label":"W3Schools — CSS Tutorial","type":"docs","url":"https://www.w3schools.com/css/"},
    {"label":"W3Schools — JavaScript Tutorial","type":"docs","url":"https://www.w3schools.com/js/"},
    {"label":"HTML Cheatsheet (PDF)","type":"pdf","url":"https://www.w3schools.com/html/html_quick.asp"},
    {"label":"MDN — Learn Web Development","type":"docs","url":"https://developer.mozilla.org/en-US/docs/Learn"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='web-development';

-- CSE: Networking
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/IPvYjXCsTg8',
  documentation_body = E'Computer networking fundamentals: OSI/TCP-IP model, IP addressing, subnetting, routing & switching, DNS, HTTP, TLS.\nHands-on: ping, traceroute, Wireshark, building a tiny TCP echo server.',
  resources = '[
    {"label":"Cisco — Networking Basics","type":"docs","url":"https://www.netacad.com/courses/networking/networking-basics"},
    {"label":"W3Schools — TCP/IP Reference","type":"docs","url":"https://www.w3schools.in/tcp-ip-protocol-suite-tutorial"},
    {"label":"Cloudflare Learning Center","type":"docs","url":"https://www.cloudflare.com/learning/"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='networking';

-- CSE: Data Science
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/ua-CiDNNj30',
  documentation_body = E'Data science with Python: NumPy, Pandas, Matplotlib, scikit-learn. Statistics, EDA, feature engineering, model evaluation.',
  resources = '[
    {"label":"W3Schools — Python Tutorial","type":"docs","url":"https://www.w3schools.com/python/"},
    {"label":"W3Schools — Pandas Tutorial","type":"docs","url":"https://www.w3schools.com/python/pandas/default.asp"},
    {"label":"W3Schools — Data Science","type":"docs","url":"https://www.w3schools.com/datascience/"},
    {"label":"scikit-learn User Guide","type":"docs","url":"https://scikit-learn.org/stable/user_guide.html"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='data-science';

-- CSE: Mobile App
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/0-S5a0eXPoc',
  documentation_body = E'Cross-platform mobile development with React Native and Flutter. Native iOS (Swift) and Android (Kotlin) basics, navigation, state, native APIs.',
  resources = '[
    {"label":"React Native Docs","type":"docs","url":"https://reactnative.dev/docs/getting-started"},
    {"label":"Flutter Docs","type":"docs","url":"https://docs.flutter.dev/"},
    {"label":"W3Schools — React Tutorial","type":"docs","url":"https://www.w3schools.com/react/"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='mobile-app';

-- CSE: 3D Animation
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/nIoXOplUvAw',
  documentation_body = E'3D modeling and animation in Blender. Mesh modeling, materials, lighting, rigging, keyframe animation, and Eevee/Cycles rendering.',
  resources = '[
    {"label":"Blender Manual","type":"docs","url":"https://docs.blender.org/manual/en/latest/"},
    {"label":"Blender Tutorials Hub","type":"docs","url":"https://www.blender.org/support/tutorials/"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='3d-animation';

-- CSE: Digital Marketing
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/bixR-KIJKYM',
  documentation_body = E'Digital marketing for technical founders: SEO, content, paid ads (Meta + Google), email, analytics. Funnels, CAC, LTV, attribution.',
  resources = '[
    {"label":"Google Digital Garage","type":"docs","url":"https://learndigital.withgoogle.com/digitalgarage"},
    {"label":"HubSpot Academy","type":"docs","url":"https://academy.hubspot.com/"},
    {"label":"W3Schools — SEO Tutorial","type":"docs","url":"https://www.w3schools.com/whatis/whatis_seo.asp"}
  ]'::jsonb
WHERE discipline='cse' AND section_slug='digital-marketing';

-- EEE: Power Systems
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/0xrnK6shVAk',
  documentation_body = E'Power systems: generation, transmission, distribution. Three-phase circuits, transformers, load flow, fault analysis, protection, renewables integration.',
  resources = '[
    {"label":"All About Circuits — Power","type":"docs","url":"https://www.allaboutcircuits.com/textbook/"},
    {"label":"MIT OCW — Electric Power","type":"docs","url":"https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/"}
  ]'::jsonb
WHERE discipline='eee' AND section_slug='power-systems';

-- EEE: VLSI
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/wjLDxk_Rd-w',
  documentation_body = E'VLSI design flow: RTL with Verilog/SystemVerilog, synthesis, timing analysis, place & route. CMOS basics, logic families, low-power techniques.',
  resources = '[
    {"label":"Verilog HDL Reference","type":"docs","url":"https://www.chipverify.com/verilog/verilog-tutorial"},
    {"label":"Nandland — Verilog","type":"docs","url":"https://nandland.com/"}
  ]'::jsonb
WHERE discipline='eee' AND section_slug='vlsi';

-- EEE: Industrial Automation
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/RH6BIxPe2Bg',
  documentation_body = E'Industrial automation: PLC programming (Ladder, ST), SCADA, HMI, sensors and actuators, Modbus, OPC-UA, safety systems.',
  resources = '[
    {"label":"PLCdev — PLC Tutorial","type":"docs","url":"https://www.plcdev.com/book/export/html/3"},
    {"label":"Siemens TIA Portal Docs","type":"docs","url":"https://support.industry.siemens.com/"}
  ]'::jsonb
WHERE discipline='eee' AND section_slug='automation';

-- Civil: Structural
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/zpgyEgdnGsM',
  documentation_body = E'Structural engineering: statics, mechanics of materials, concrete & steel design, seismic considerations, load paths, code basics (ACI, AISC).',
  resources = '[
    {"label":"The Efficient Engineer (YouTube)","type":"docs","url":"https://www.youtube.com/@TheEfficientEngineer"},
    {"label":"AISC Steel Resources","type":"docs","url":"https://www.aisc.org/education/"}
  ]'::jsonb
WHERE discipline='civil' AND section_slug='structural';

-- Civil: CAD & BIM
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/UxyVZB4dhcs',
  documentation_body = E'CAD with AutoCAD and BIM with Revit. 2D drafting, 3D modeling, families, schedules, coordination, clash detection (Navisworks).',
  resources = '[
    {"label":"Autodesk Learn — AutoCAD","type":"docs","url":"https://www.autodesk.com/learn/ondemand/learning-path/autocad"},
    {"label":"Autodesk Learn — Revit","type":"docs","url":"https://www.autodesk.com/learn/ondemand/learning-path/revit"}
  ]'::jsonb
WHERE discipline='civil' AND section_slug='cad';

-- Civil: Project Management
UPDATE public.learning_modules SET
  video_url = 'https://www.youtube.com/embed/CmCQTN_kdcU',
  documentation_body = E'Construction project management: scope, schedule (CPM/Gantt), cost, quality, safety, contracts, procurement, stakeholder management.',
  resources = '[
    {"label":"PMI — Construction","type":"docs","url":"https://www.pmi.org/"},
    {"label":"Primavera P6 Tutorials","type":"docs","url":"https://docs.oracle.com/cd/F25600_01/English/index.htm"}
  ]'::jsonb
WHERE discipline='civil' AND section_slug='project-management';
