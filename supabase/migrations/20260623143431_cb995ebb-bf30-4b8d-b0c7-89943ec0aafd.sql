
INSERT INTO public.learning_modules (discipline, section_slug, title, description, documentation_body) VALUES
('cse','web-development','Web Development Fundamentals','HTML, CSS, JavaScript and modern React patterns for building production web apps.','# Web Development\n\nLearn how the web works, then build with HTML, CSS, JavaScript and React. Covers components, state, routing, and deployment.'),
('cse','networking','Computer Networking','OSI/TCP-IP, routing, switching, and practical network troubleshooting.','# Networking\n\nUnderstand the OSI and TCP/IP models, IP addressing, routing, switching and how packets travel across the internet.'),
('cse','data-science','Data Science & Analytics','Python, pandas, statistics, and visualization for real-world data work.','# Data Science\n\nUse Python, pandas and matplotlib to clean, analyze and visualize data. Covers descriptive statistics and basic ML.'),
('cse','mobile-apps','Mobile App Development','Build cross-platform mobile apps with React Native and modern tooling.','# Mobile Apps\n\nShip iOS and Android apps from a single codebase using React Native. Covers navigation, state, native modules and store publishing.'),
('cse','3d-animation','3D Animation & Motion','Blender fundamentals, rigging, and animation principles for digital media.','# 3D Animation\n\nLearn Blender from scratch: modeling, rigging, lighting and animation principles used across film and games.'),
('cse','digital-marketing','Digital Marketing','SEO, paid ads, content marketing and analytics that drive growth.','# Digital Marketing\n\nMaster SEO, Google Ads, Meta Ads, content marketing and analytics. Build campaigns that convert.'),

('eee','power-systems','Power Systems','Generation, transmission, distribution and modern grid concepts.','# Power Systems\n\nCovers generation, transmission lines, transformers, distribution networks, and the basics of smart grids.'),
('eee','vlsi','VLSI Design','Digital design, Verilog, and the chip design flow from RTL to GDS.','# VLSI\n\nLearn digital design, Verilog HDL, synthesis, and the modern ASIC/FPGA flow from RTL to layout.'),
('eee','industrial-automation','Industrial Automation','PLCs, SCADA, sensors and control loops for the modern factory floor.','# Industrial Automation\n\nProgram PLCs, build SCADA dashboards, and design control loops with sensors and actuators.'),

('civil','structural','Structural Engineering','Loads, analysis, RCC and steel design principles for safe structures.','# Structural Engineering\n\nLoad analysis, reinforced concrete, steel design, and seismic considerations for buildings and infrastructure.'),
('civil','cad-bim','CAD & BIM','AutoCAD and Revit workflows for modern building information modeling.','# CAD & BIM\n\nAutoCAD drafting fundamentals and Revit-based BIM workflows for architecture and MEP coordination.'),
('civil','project-management','Construction Project Management','Scheduling, cost control, safety and stakeholder management on site.','# Project Management\n\nPlan, schedule and control construction projects. Covers Primavera/MS Project, cost control, safety and quality.')
ON CONFLICT DO NOTHING;
