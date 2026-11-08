-- Run after schema.sql. Seeds the current local portfolio content so the
-- dashboard starts with editable records instead of an empty list.

insert into public.portfolio_content
  (section, slug, title, payload, sort_order, published)
values
  ('projects', 'orbit-ai', 'Orbit AI',
   $json${"name":"Orbit AI","category":"AI WORKSPACE","description":"A calmer way to collect ideas, ask better questions, and make progress with AI.","year":"2025","tags":["Product design","Next.js","AI"],"theme":"lime","visual":"orbit"}$json$::jsonb, 0, true),
  ('projects', 'flowboard', 'Flowboard',
   $json${"name":"Flowboard","category":"TEAM PRODUCTIVITY","description":"A lightweight project space that helps small teams stay focused and in sync.","year":"2024","tags":["UX/UI","React","SaaS"],"theme":"blue","visual":"flow"}$json$::jsonb, 1, true),
  ('projects', 'pulse', 'Pulse',
   $json${"name":"Pulse","category":"FINANCE APP","description":"Friendly money insights that make everyday spending easier to understand.","year":"2024","tags":["Visual design","Mobile","Fintech"],"theme":"coral","visual":"pulse"}$json$::jsonb, 2, true),
  ('experience', 'bawdicsoft', 'BawdicSoft',
   $json${"company":"BawdicSoft","logo":"/experience/bawdicsoft.png","logoAlt":"BawdicSoft logo","role":"Junior Full Stack Developer","period":"Present","location":"Full-time","summary":"Building and improving product features across the frontend and backend, working with the team to turn requirements into reliable user experiences.","highlights":["Develop and maintain responsive user-facing features and reusable UI components.","Contribute to backend APIs, data integrations, and ongoing product improvements."],"color":"blue"}$json$::jsonb, 0, true),
  ('experience', 'teyzix-core', 'Teyzix Core',
   $json${"company":"Teyzix Core","logo":"/experience/teyzix-core.webp","logoAlt":"Teyzix Core logo","role":"Backend Developer Intern","period":"Internship","location":"Backend development","summary":"Gained hands-on backend experience by contributing to server-side features and learning how APIs and application data work together.","highlights":["Assist with building and testing backend endpoints and application logic.","Work with databases, validate requests, and troubleshoot issues with the team."],"color":"lime"}$json$::jsonb, 1, true),
  ('experience', 'coderatory', 'Coderatory',
   $json${"company":"Coderatory","logo":"/experience/coderatory.jpg","logoAlt":"Coderatory logo","role":"MERN Stack Developer","period":"MERN stack development","location":"Full-stack development","summary":"Worked across MongoDB, Express, React, and Node.js to build full-stack features and connect polished interfaces with backend services.","highlights":["Build responsive React interfaces and integrate them with REST APIs.","Contribute to Node.js and Express services backed by MongoDB."],"color":"peach"}$json$::jsonb, 2, true),
  ('skills', 'frontend', 'Frontend',
   $json${"title":"Frontend","description":"Accessible interfaces, thoughtful details, and fast experiences.","color":"blue"}$json$::jsonb, 0, true),
  ('skills', 'backend', 'Backend',
   $json${"title":"Backend","description":"Reliable APIs and practical foundations that scale with a product.","color":"lime"}$json$::jsonb, 1, true),
  ('skills', 'product', 'Product',
   $json${"title":"Product","description":"From the first rough idea to a clear, useful experience.","color":"peach"}$json$::jsonb, 2, true),
  ('skills', 'collaboration', 'Collaboration',
   $json${"title":"Collaboration","description":"Good questions, clear communication, and steady progress.","color":"dark"}$json$::jsonb, 3, true),
  ('services', 'full-stack-development', 'Full Stack Development',
   $json${"number":"01","title":"Full Stack Development","description":"Responsive, production-ready web applications with thoughtful interfaces, reliable APIs, and databases working together.","tools":["Next.js","React","Node.js"],"color":"blue"}$json$::jsonb, 0, true),
  ('services', 'backend-api-development', 'Backend & API Development',
   $json${"number":"02","title":"Backend & API Development","description":"Well-structured server-side features, REST APIs, database integrations, and secure, dependable application logic.","tools":["Node.js","Express","MongoDB"],"color":"lime"}$json$::jsonb, 1, true),
  ('services', 'frontend-ui-development', 'Frontend & UI Development',
   $json${"number":"03","title":"Frontend & UI Development","description":"Accessible, mobile-friendly interfaces with reusable components, smooth interactions, and careful attention to detail.","tools":["TypeScript","React","CSS"],"color":"peach"}$json$::jsonb, 2, true),
  ('contact', 'primary', 'Contact details',
   $json${"email":"mughalahmedali692@gmail.com","phone":"+923712561852","linkedin":"https://www.linkedin.com/in/ahmed-ali-mughal20/","github":"https://github.com/ahmedalimughal3"}$json$::jsonb, 0, true),
  ('site', 'primary', 'Home and about',
   $json${"heroKicker":"DESIGN ENGINEER / DIGITAL CRAFT","heroTitle":"Small stack.","heroAccent":"Big ideas.","heroDescription":"I bring thoughtful ideas to life with design, code, and a little curiosity. Building digital things that feel as good as they work.","aboutTitle":"Curious by nature.","aboutAccent":"Intentional by design.","aboutParagraph":"I'm Ahmed — a designer-minded developer who enjoys turning complex ideas into simple, useful experiences. I care about how things work, how they feel, and all the small details in between.","aboutSecondParagraph":"My process is collaborative and hands-on: ask good questions, make a thoughtful first version, then keep refining until it clicks.","availability":"Open to opportunities"}$json$::jsonb, 0, true)
on conflict (section, slug) do nothing;
