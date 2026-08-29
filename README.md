# ✨ Aurora Luxe Artistry – Luxury Makeup Artist Booking Website

A modern, responsive, ultra-luxury booking website designed specifically for high-end bridal makeup artists, luxury beauty studios, and editorial beauty professionals. Built strictly with **HTML5, CSS3, and Vanilla JavaScript** and powered by **EmailJS** for serverless dual-email processing (Dealer Notification + Client Auto-Confirmation).

---

## 🌟 Key Highlights & Features

- **Luxury Aesthetic**: Sophisticated champagne gold palette, alabaster cream backgrounds, and editorial typography (*Playfair Display*, *Cormorant Garamond*, *Italiana*, *Plus Jakarta Sans*).
- **9 Complete Website Sections**:
  1. **Home**: High-converting hero section with trust badges, stats, and dual CTAs.
  2. **About the Artist**: Elena Roche's philosophy, master certifications, and 6 luxury pillars.
  3. **Services Menu**: 6 signature services + 1 all-inclusive master package with pricing and instant 1-click booking hooks.
  4. **Portfolio & Gallery**: Interactive category filtering (*All, Bridal, Editorial, Red Carpet, Transformations*), high-res Lightbox modal viewer, and interactive Before & After drag-comparison slider.
  5. **Packages & Pricing**: Tiered luxury bridal collections (*Essential Glam, Signature Bridal [Most Popular], Royal VIP Bridal*).
  6. **Appointment Booking**: Validated form with real-time feedback, loading states, and unique reference ID generation (`AL-2026-XXXX`).
  7. **Testimonials**: 5.0-star verified client reviews with wedding locations.
  8. **FAQ**: Smooth expandable accordion.
  9. **Contact & Studio**: Direct contact cards, Google Maps iframe embed, and curated Instagram feed showcase.
- **Serverless Email Booking via EmailJS**: Dispatches both a dealer notification email and a client confirmation email without needing PHP, Node.js, or any backend server.
- **Instant Demo Mode**: Works straight out of the box for testing with realistic loading feedback and confirmation modal even before entering live EmailJS keys.
- **Mobile-First Responsive Design**: Flawless experience on smartphones, tablets, and 4K displays with sticky header, mobile drawer navigation, and quick mobile booking bar.

---

## 📁 Project Structure

```
makeup-artist-website/
│
├── index.html            # Complete semantic HTML5 structure with JSON-LD schema
├── style.css             # Luxury design system, animations, grid, and responsive styling
├── script.js             # EmailJS dual-send, validation, portfolio filters, lightbox & modals
├── assets/
│   ├── icons/            # SVG icons (favicon.svg, luxury-badge.svg)
│   └── images/           # Curated beauty imagery & placeholders
└── README.md             # Complete documentation & EmailJS setup guide
```

---

## 📧 EmailJS Setup Guide (Step-by-Step)

EmailJS allows your static website to send emails directly from client-side JavaScript safely without exposing sensitive backend passwords.

### Step 1: Create a Free Account
1. Visit [https://www.emailjs.com/](https://www.emailjs.com/) and click **Sign Up Free**.
2. Complete your registration and log into your EmailJS dashboard.

---

### Step 2: Add an Email Service
1. Go to the **Email Services** tab from the left sidebar.
2. Click **Add New Service** (e.g., select **Gmail**, **Outlook**, or **Custom SMTP**).
3. Connect your makeup studio's email account (e.g., `concierge@auroraluxeartistry.com` or your personal Gmail).
4. Note your **Service ID** (e.g., `service_luxury_mua`).

---

### Step 3: Create Template 1 – Dealer / Artist Notification Email

This email is sent to **your inbox** whenever a client submits a new booking request.

1. Go to the **Email Templates** tab and click **Create New Template**.
2. **Subject Line**:
   ```
   ✨ New Makeup Booking Request: {{client_name}} – {{service_name}} [{{booking_ref}}]
   ```
3. **Content Body** (HTML / Text):
   ```html
   <h2>✨ New Appointment Booking Request</h2>
   <p>You have received a new booking inquiry through the Aurora Luxe Artistry website.</p>

   <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Booking Reference:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD; color: #9E7B35; font-weight: bold;">{{booking_ref}}</td>
     </tr>
     <tr>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Client Name:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{client_name}}</td>
     </tr>
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Email Address:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><a href="mailto:{{client_email}}">{{client_email}}</a></td>
     </tr>
     <tr>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Phone Number:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><a href="tel:{{client_phone}}">{{client_phone}}</a></td>
     </tr>
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Requested Service:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD; font-weight: bold;">{{service_name}}</td>
     </tr>
     <tr>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Preferred Date:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{booking_date}}</td>
     </tr>
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Preferred Time:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{booking_time}}</td>
     </tr>
     <tr>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Party Size:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{party_size}}</td>
     </tr>
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Venue / Location:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{venue_location}}</td>
     </tr>
     <tr>
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Client Notes / Look:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{client_message}}</td>
     </tr>
     <tr style="background: #FAF8F5;">
       <td style="padding: 10px; border: 1px solid #EBE4DD;"><strong>Submitted At:</strong></td>
       <td style="padding: 10px; border: 1px solid #EBE4DD;">{{submission_time}}</td>
     </tr>
   </table>
   ```
4. Save the template and note the **Template ID** (e.g., `template_dealer_booking`).

---

### Step 4: Create Template 2 – Client Auto-Confirmation Email

This email is automatically dispatched to the **client's email address**.

1. Click **Create New Template**.
2. **Settings**:
   - In the **To Email** field in the right sidebar, enter: `{{to_email}}`
   - In the **From Name** field, enter: `Aurora Luxe Artistry`
3. **Subject Line**:
   ```
   Booking Request Received – Aurora Luxe Artistry [Ref: {{booking_ref}}]
   ```
4. **Content Body** (HTML / Text):
   ```html
   <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #231F1D; line-height: 1.6;">
     <div style="text-align: center; padding: 25px 0; border-bottom: 2px solid #C5A059;">
       <h1 style="font-size: 26px; color: #141211; margin: 0; letter-spacing: 1px;">Aurora Luxe Artistry</h1>
       <p style="color: #9E7B35; text-transform: uppercase; font-size: 11px; letter-spacing: 2px; margin-top: 5px;">Elena Roche • Master Makeup Artist</p>
     </div>

     <div style="padding: 30px 20px;">
       <p style="font-size: 16px;">Dear <strong>{{to_name}}</strong>,</p>
       <p>Thank you for requesting an appointment with <strong>{{business_name}}</strong>. We have received your event details and our concierge is reviewing our schedule availability.</p>

       <div style="background-color: #FAF8F5; border: 1px solid #EBE4DD; border-radius: 8px; padding: 20px; margin: 25px 0;">
         <h3 style="margin-top: 0; color: #9E7B35; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Booking Summary</h3>
         <p style="margin: 6px 0;"><strong>Reference Code:</strong> <span style="font-family: monospace; color: #141211;">{{booking_ref}}</span></p>
         <p style="margin: 6px 0;"><strong>Selected Service:</strong> {{service_name}}</p>
         <p style="margin: 6px 0;"><strong>Requested Date & Time:</strong> {{booking_date}} at {{booking_time}}</p>
         <p style="margin: 6px 0;"><strong>Venue / Location:</strong> {{venue_location}}</p>
         <p style="margin: 6px 0;"><strong>Party Size:</strong> {{party_size}}</p>
       </div>

       <h4 style="color: #141211; margin-bottom: 8px;">What Happens Next?</h4>
       <ul style="padding-left: 20px; color: #6B635E;">
         <li>Our studio concierge will verify date availability and send your official invoice & schedule confirmation within 24 hours.</li>
         <li>If you selected a Bridal Trial, we will coordinate your personalized 2.5-hour preview session in our Manhattan studio.</li>
       </ul>

       <p style="margin-top: 30px;">If you have any immediate questions, please feel free to contact Elena directly at <a href="tel:{{artist_phone}}" style="color: #9E7B35; font-weight: bold;">{{artist_phone}}</a> or email <a href="mailto:{{artist_email}}" style="color: #9E7B35;">{{artist_email}}</a>.</p>

       <p style="margin-top: 25px;">Warmest regards,<br>
       <strong>Elena Roche & The Aurora Luxe Team</strong><br>
       <span style="font-size: 12px; color: #968D86;">{{studio_address}}</span></p>
     </div>
   </div>
   ```
5. Save the template and note the **Template ID** (e.g., `template_client_confirm`).

---

### Step 5: Get Your Public Key
1. In EmailJS, go to **Account** > **API Keys**.
2. Copy your **Public Key** (e.g., `user_ab12cd34ef56gh78`).

---

### Step 6: Add Credentials to `script.js`

Open `script.js` and update the `EMAILJS_CONFIG` constant at the top of the file:

```javascript
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',              // Replace with your EmailJS Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID',              // Replace with your EmailJS Service ID
  DEALER_TEMPLATE_ID: 'YOUR_DEALER_TEMPLATE',  // Replace with Template 1 ID
  CLIENT_TEMPLATE_ID: 'YOUR_CLIENT_TEMPLATE'   // Replace with Template 2 ID
};
```

---

## 🧪 Testing Your Website

1. **Smart Preview / Demo Mode (No Setup Required)**:
   - Double click `index.html` or open with Live Server.
   - Fill in the booking form with test data and click **Submit Booking Request**.
   - The site will show an animated loading spinner, generate a booking reference code (e.g. `AL-2026-8942`), and display the luxury confirmation modal with receipt copying and printing capabilities.

2. **Live Production Email Testing**:
   - Add your live EmailJS credentials in `script.js`.
   - Submit a test booking with your own email address in the **Email Address** field.
   - Check your primary artist inbox: You should receive the **New Booking Request** notification.
   - Check the client email inbox: You should receive the **Booking Request Received** confirmation with reference code and business contact information.

---

## 🚀 Deployment Instructions

This website consists of 100% static HTML, CSS, and JavaScript, meaning it can be hosted for **free** on any static hosting platform:

### Option A: GitHub Pages
1. Push the `makeup-artist-website` repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/root`, then click **Save**.
4. Your site will be live at `https://<username>.github.io/<repository-name>/`.

### Option B: Netlify
1. Drag and drop the `makeup-artist-website` folder onto [Netlify Drop](https://app.netlify.com/drop).
2. Your site will deploy instantly with a live HTTPS URL.

### Option C: Vercel
1. Install Vercel CLI via `npm i -g vercel` or link your GitHub repository on [vercel.com](https://vercel.com).
2. Deploy with zero configuration.

---

## 🎨 Customizing Studio Details & Branding

- **Business Info**: In `script.js`, edit `BUSINESS_INFO` with your phone, email, studio address, and brand name.
- **Services & Pricing**: Modify the pricing values and feature lists directly in `index.html`.
- **Theme Palette**: In `style.css`, customize the CSS variables under `:root` (e.g., `--gold-primary`, `--bg-cream`, `--bg-dark`).

---

&copy; 2026 Aurora Luxe Artistry by Elena Roche. All Rights Reserved.
