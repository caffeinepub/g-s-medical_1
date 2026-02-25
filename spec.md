# Specification

## Summary
**Goal:** Build a full-stack G&S MEDICAL store website with a public-facing homepage, admin dashboard, seller management, and a rule-based AI assistant chatbot.

**Planned changes:**

**Backend:**
- Data models: Medicines (id, name, category, description, price, stock, imageUrl, isAvailable), Sellers (id, name, email, phone, whatsapp, address, licenseNumber, status, joinedAt), SiteContent (key/value store), ChatMessages (id, customerQuery, botResponse, timestamp)
- Hardcoded admin login (gauravsaswade2009@gmail.com / p1love2g) returning a session token
- CRUD endpoints for Medicines, Sellers, SiteContent, and ChatMessages

**Frontend – Public Site:**
- Homepage with sections: Hero banner (logo, store name, tagline, CTA), About Us, Founder/Co-Founder profile cards (CEO Gaurav Sasvade, Co-Founder Shushant Waghmare with bios, phone, and WhatsApp links), Medicines/Products (from backend), Active Sellers directory, Contact & Customer Care (all specified numbers and store email)
- Footer with store name, tagline, and key links
- Individual seller detail pages at `/sellers/:id` (active sellers only shown publicly)
- Scroll-triggered fade-up and slide-in entrance animations throughout
- Fully responsive (mobile, tablet, desktop)
- Emerald green, white, and gold color palette; medical cross motifs; card layouts with shadows and hover transitions

**Admin Dashboard (`/admin`):**
- Login screen with hardcoded credential check; error on incorrect login
- Medicine Manager: add, edit, delete medicines with all fields including availability toggle
- Seller Manager: add, edit, remove sellers; toggle status (active/inactive/pending); view all sellers including inactive/pending
- Website Content Editor: edit hero headline, about text, and announcements stored in SiteContent
- Dashboard overview: counts of total medicines, active sellers, pending sellers
- Logout clears session and redirects to login

**AI Assistant Chatbot:**
- Floating chat bubble widget on all public pages (bottom-right)
- Rule-based responses for FAQs: ordering, store contact, available medicines, seller registration
- Unanswered queries escalate to +91 9766343454
- Session-persistent chat history

**User-visible outcome:** Visitors can browse medicines, view active seller profiles, learn about the store and its founders, and get answers via the AI chatbot. The admin can log in from any device to manage medicines, sellers, and website content.
