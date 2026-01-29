# DanaTour MVP - Screen Breakdown & Task Assignment

> **Mục tiêu:** Demo ý tưởng với UI hoàn chỉnh, đủ flow booking tour

---

## Header Navigation Mapping

| Nav Item        | Path       | Purpose                                                                 |
| --------------- | ---------- | ----------------------------------------------------------------------- |
| Home            | `/`        | Landing page                                                            |
| Da Nang Explore | `/explore` | **Lộ trình cá nhân hóa** - User scroll qua các điểm đến, collect stamps |
| Find Tour       | `/tours`   | **Tìm kiếm Tour** - Danh sách tour có filter/search                     |
| About           | `/about`   | Giới thiệu nhóm/công ty                                                 |

---

## Current State (Đã có)

| Screen              | Path       | Status                                   |
| ------------------- | ---------- | ---------------------------------------- |
| Home/Landing        | `/`        | ✅ Done                                  |
| Da Nang Explore     | `/explore` | ✅ Done (scroll storytelling + passport) |
| Book Tour Modal     | Component  | ✅ Done                                  |
| Tours (placeholder) | `/tours`   | ✅ Done (Coming Soon UI)                 |
| About               | `/about`   | ✅ Done                                  |

---

## MVP Screens cần triển khai

### Priority 1: Core Booking Flow (Critical)

#### 1. Tour Listing Page `/tours` ⭐ (Find Tour)

**Assignee:** ****\_****  
**Effort:** 2-3 ngày

**Mô tả:** Trang tìm kiếm & lọc tour (thay thế placeholder hiện tại)

**Components cần:**

- `TourCard.tsx` - Card hiển thị tour
- `TourFilter.tsx` - Sidebar filter
- `SearchBar.tsx` - Tìm kiếm tour

**Features:**

- [ ] Grid/List view toggle
- [ ] Filter by: Zone (Sea/City/Mountain), Price, Duration
- [ ] Sort by: Price, Rating, Popular
- [ ] Pagination hoặc infinite scroll

---

#### 2. Tour Detail Page `/tours/:id`

**Assignee:** ****\_****  
**Effort:** 2-3 ngày

**Sections:**

- [ ] Hero image gallery
- [ ] Tour info (title, price, duration, rating)
- [ ] Tabs: Overview | Itinerary | Reviews
- [ ] Itinerary timeline
- [ ] Sticky booking sidebar
- [ ] CTA "Book Now"

**Components:** `ImageGallery.tsx`, `ItineraryTimeline.tsx`, `ReviewCard.tsx`, `BookingSidebar.tsx`

---

#### 3. Checkout Page `/checkout`

**Assignee:** ****\_****  
**Effort:** 2-3 ngày

**Sections:**

- [ ] Order summary
- [ ] Customer info form
- [ ] Payment method selector
- [ ] Promo code input
- [ ] Confirm booking button

---

#### 4. Booking Confirmation `/booking/confirmation`

**Assignee:** ****\_****  
**Effort:** 1 ngày

- Success message + booking reference
- Tour summary + next steps
- Download ticket button

---

### Priority 2: Essential Pages

#### 5. Login/Register `/login`, `/register` ⭐

**Assignee:** ****\_****  
**Effort:** 2 ngày

**Login Page Features:**

- [ ] Email/Password form
- [ ] Remember me checkbox
- [ ] "Forgot password" link
- [ ] Social login buttons (Google, Facebook - UI only)
- [ ] Link to Register page
- [ ] Form validation với error messages

**Register Page Features:**

- [ ] Full name, Email, Password, Confirm Password
- [ ] Phone number (optional)
- [ ] Terms & conditions checkbox
- [ ] Link to Login page
- [ ] Password strength indicator

**Components cần:**

- `AuthLayout.tsx` - Layout wrapper cho auth pages (centered card)
- `InputField.tsx` - Styled input với label, error, icon
- `SocialLoginButtons.tsx` - Google/Facebook buttons
- `PasswordInput.tsx` - Password với show/hide toggle

**Design Notes:**

- Background: gradient hoặc travel image blur
- Card: glassmorphism style (như BookTourModal)
- Màu accent: Gold (#FFC857)

---

#### 6. User Dashboard `/account`

**Assignee:** ****\_****  
**Effort:** 2 ngày

**Tabs:**

- My Bookings - upcoming/past
- Saved Itineraries (từ Da Nang Explore)
- Profile settings

---

### Priority 3: Nice to Have

| Page    | Path       | Effort   |
| ------- | ---------- | -------- |
| Contact | `/contact` | 0.5 ngày |
| FAQ     | `/faq`     | 0.5 ngày |

---

## Task Distribution (4 người)

| Member | Screens                       | Days |
| ------ | ----------------------------- | ---- |
| **1**  | Tour Listing + Tour Detail    | 4-5  |
| **2**  | Checkout + Confirmation       | 3-4  |
| **3**  | Login/Register                | 2    |
| **4**  | Dashboard + Shared Components | 3-4  |

---

## Routing (App.tsx)

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/explore" element={<DaNangExplore />} />
  <Route path="/tours" element={<Tours />} />
  <Route path="/tours/:id" element={<TourDetail />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/booking/confirmation" element={<BookingConfirmation />} />
  <Route path="/about" element={<About />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/account" element={<Account />} />
</Routes>
```

---

## Demo Flow Priority

```
Home → Find Tour → Tour Detail → Checkout → Confirmation
         ↓
    Da Nang Explore (personal itinerary)
         ↓
       About
```

---

## Tech Stack

- **Framework:** React + TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animation:** Framer Motion
