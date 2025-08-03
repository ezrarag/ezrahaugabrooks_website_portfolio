# TODO

## Completed ✅
- [x] Glassmorphism (frosted glass) effect for both homepage cards
- [x] White header, animated dots, and logo for visibility
- [x] Vertically and horizontally centered cards
- [x] Homepage background image from profile card
- [x] Subcategory filtering for resume/CV download modal
- [x] Pendulum animation for three dots menu
- [x] Schedule form integration with Supabase
- [x] Music page scrolling and header behavior
- [x] Music services dropdown menu with Framer Motion animations
- [x] Music service modal with document upload and payment
- [x] Play/stop button for background video (moved to header)
- [x] Stripe payment integration for music services
- [x] AI chat integration with conversation storage
- [x] Header visibility and z-index fixes
- [x] Landing page viewport height only (no scrolling)
- [x] Disabled Developer/Linguist pages with consistent styling

## In Progress / Next Steps 🔄
- [ ] **AI Chat Debugging**: Fix chat response issues (add environment variables)
- [ ] **Stripe Webhook Setup**: Add webhook for production payment handling
- [ ] **Environment Variables**: Set up OpenRouter API key and Stripe keys for Vercel deployment
- [ ] **File Upload**: Implement actual file upload to Supabase storage
- [ ] **Video Background**: Add actual background video file to Supabase storage
- [ ] **Dashboard UI**: Move dashboard button outside hamburger menu and implement header expansion

## Optional / Future 🚀
- [ ] Dynamic subcategory loading from Supabase (instead of hardcoded)
- [ ] Add preview step before download (show generated doc before saving)
- [ ] Add payment processing for scheduling (Stripe, PayPal, etc.)
- [ ] AI integration for document generation (fix model error, connect to Supabase for real data)
- [ ] Backend: update `/api/generate-document` to use subcategories and query real data from Supabase

---

**Notes:**
- **Stripe Keys**: Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (public) and `STRIPE_SECRET_KEY` (private) for Vercel
- **AI Chat**: Add `OPENROUTER_API_KEY` for OpenRouter (recommended) or `XAI_API_KEY` for Grok integration
- **File Upload**: Implement Supabase storage upload in `MusicServiceModal`
- **Video Background**: Upload background video to Supabase storage and update URL
- **Environment Variables**: Set up in Vercel dashboard → Settings → Environment Variables
- **Dashboard**: Move button outside hamburger menu and implement header expansion animation 