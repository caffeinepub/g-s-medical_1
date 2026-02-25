# Specification

## Summary
**Goal:** Hide any visible admin login shortcut or link from the public-facing website while keeping the `/admin` route accessible via direct URL.

**Planned changes:**
- Remove or hide any link, button, or text pointing to `/admin` from `Navigation.tsx` and any other publicly visible components (e.g., homepage, footer, navigation links).

**User-visible outcome:** Regular visitors no longer see any shortcut or link to the admin login page on the public website. Admins can still access the admin panel by navigating directly to `/admin` in the browser.
