# TODO

## Completed
- [x] Glassmorphism (frosted glass) effect for both homepage cards
- [x] White header, animated dots, and logo for visibility
- [x] Vertically and horizontally centered cards
- [x] Homepage background image from profile card
- [x] Subcategory filtering for resume/CV download modal
- [x] Pendulum animation for three dots menu
- [x] Schedule form integration with Supabase

## In Progress / Next Steps
- [ ] AI integration for document generation (fix model error, connect to Supabase for real data)
- [ ] Backend: update `/api/generate-document` to use subcategories and query real data from Supabase
- [ ] Testing and polish (UI/UX, error handling, edge cases)

## Optional / Future
- [ ] Dynamic subcategory loading from Supabase (instead of hardcoded)
- [ ] Add preview step before download (show generated doc before saving)
- [ ] Add payment processing for scheduling (Stripe, PayPal, etc.)

---

**Notes:**
- All homepage UI polish and glassmorphism complete. Next: focus on AI/Supabase integration for document generation.
- Ensure Supabase table `appointment_requests` matches all fields used in the schedule form (see previous SQL instructions).
- For AI document generation, resolve the model instantiation error and ensure the API can use both area and subcategory filters.
- Continue to test all flows after each major change. 