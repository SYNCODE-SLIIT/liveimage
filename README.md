# LIVE IMAGE (PVT) LTD — liveimage.lk

Full-stack Next.js (App Router) Public Website and Custom Admin CMS ("Damith's Control Panel") for **LIVE IMAGE (PVT) LTD**, founded by **B Damith Sadaruwan** (Dehiwala / Colombo, Sri Lanka).

## Brand & Design System
- **Night Black (`#0B0B0E`)** — Primary dark broadcast canvas
- **Stage Grey (`#1A1A21`)** — Secondary card surface with `border-white/10`
- **REC Red (`#E8332B`)** — Primary brand accent, CTAs, and pulsing camera recording dot (`●`)
- **Spotlight Gold (`#F2B544`)** — 5-star client ratings and featured badges
- **Paper White (`#F4F2EE`)** & **Muted (`#9CA3AF`)**
- **Typography:** `Poppins` (headings) and `Inter` (body) via `next/font/google`

## Public Website Routes
1. **`/` (Home Page)** — Multi-Cam Hero with interactive `CAM 1 / CAM 2 / CAM 3` live PIP switcher, 4K Showreel modal, editable Trust Numbers bar, 4 Service cards, dynamic Bento Grid (`featuredOnHome === true`), 4-step workflow, Client Logos strip, 5-star Testimonials, and Quote CTA banner.
2. **`/services` (Services & Packages)** — Alternating service sections with feature chips, pre-filled `"Get a quote"` links (`/contact?service=...`), and 3 camera tiers (`2 Cameras`, `4 Cameras`, `6–12 Cameras`) with dynamic Admin toggle (`showPackagePrices`).
3. **`/portfolio` (Our Work)** — 1-tap category filters (`All`, `Concerts`, `Weddings`, `Corporate`, `Sports`, `Videos only`), 4K Video Player Modal, and swipeable Photo Lightbox Gallery.
4. **`/about` (About Live Image LK)** — Company story, 6-screen ATEM multi-view control room visual, 4 Equipment spec cards, and 4 Crew profile cards.
5. **`/contact` (Book Your Event)** — Tap-friendly pill selectors for Event Type, Camera Count, and Live Streaming, direct booking persistence to `/admin/bookings`, 1-tap WhatsApp summary sender, and dark Colombo map.

## Admin CMS Routes (`/admin/*`)
1. **`/admin` (Dashboard Overview)** — 4 KPI snapshot cards, interactive 8-month Visitor Bar Chart, Latest Booking Requests widget, 4 Quick Action shortcuts, and Recently Uploaded list.
2. **`/admin/upload` (Upload Media)** — Drag-and-drop uploader, YouTube/Vimeo link adder, multi-file progress bars, category pills, and 3 toggles (`Feature on Home page`, `Auto-compress images`, `Add watermark`).
3. **`/admin/media` (Media Library)** — Storage usage meter, filter tabs (`All`, `Photos`, `Videos`, `Featured`, `Drafts`), multi-select checkboxes, and dark bulk-action bar (`★ Feature`, `Move to project`, `Hide from website`, `Delete`).
4. **`/admin/bookings` (Booking Requests CRM)** — Pipeline metrics, status filter pills, interactive status cycling (`New → Quoted → Confirmed → Completed`), WhatsApp/Email reply drawer, and functional `Export CSV` download.
5. **`/admin/settings` (Content & Site Settings)** — Live editors for Hero, Trust Numbers, `Show/Hide Package Prices` toggle, Testimonials, Contact/Social links, and `Damith (Owner)` vs `Staff (Upload-Only)` role switcher.
