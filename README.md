ENAGOM Electrical Website Overview
The ENAGOM Electrical webside is designed to promote professional electrical services while providing customers with clear information about the company, its services and trusted partnerships.

The site emphasizes reliability, professionalism, and energy solutions for both residential and commercial clients.

Purpose -To advertise ENAGOM Electrical's services (Installations, Maintenance, & Energy Solutions)
- To build trust with clients through testimonials and recognized quality brands.
- To provide a user-friendly way for potential customers to request information or contact the team
- To highlight professionalism with clear reasons why customers should choose ENAGOM.
Website Structure- Header Section
The header section has a company logo,navigation menu(Home, About Us,Services,Testimonials,Contact).
- Hero banner with a Welcome massage and a call-to action button.

Brands and partner section -has logos of trusted brands displayed to build credibility.

why choose us section, has the key value propositions
Services Section, has the services that ENAGOM Electrical provides

Testimonials section, has customer feedback displayed with names,images and a feedback

footer section, has newsletter sign up,contact details and quick links, and social icons

Features - Responsive Design that is accessible on desktop and mobile.
- Service Highlights Cards, with images and descriptions
- Client Testimonials section for credibility
- Newsletter Signup for lead generation
- Brands Partnership with well-known companies

On each section i use the ID to navigate to the relevant pages of the website.

Updates with css
Header 
- Company logo and navigation bar
- Hero banner with background image,welcome massage, and call-to action button.

Brands & Partners
- Grid layout with partner logos for credibility.

Why Choose Us
- Centered heading and responsive value proposition cards.

Services
- Highlight cards styled with CSS(hover effect, responsive grid).

Projects 
- Responsive two-faced card slider for project showcase (pure CSS).

Testimonials
- Vertical scroll slider showing customer feedback with names and avatars.

Contact Section
- Split layout: 
    .Left: embedded map.
    .Right: contact form + details underneath.

Footer
- gradient gold-orange top boarder
- newsletter signup,quick links, contact info, and social media icons.

Features & Styling
Responsive Design
- mobile- first with flexible grids & media queries.

Hero Section
- full width background image with dark overlay for readability.

Project Slider
- Flip -style two-faced cards without JavaScripts.

Testimonials
- styles with vertical scroll effects.

Contact Section
- CSS grid for map & form side by side.

Footer
- gradient border, clean grid layout, social icons.

Smooth Navigation 
- section IDs link menu item to page sections.

Technologies Used
- HTML5 for structure
- CSS3 for custom responsive design,animations, and layout.
- (Optional) Google Maps Embed for location

I added  the career section to add more content

Website Structure (updated)
Careers Section 
- job listing and opportunities to join ENAGOM Electrical

Features (updated)
Career Page
- Highlight job opportunities with responsive cards and "Apply Now" buttons.

update
- updated the size of the nav bar and added icons to the nav bar
- added icons to the footer social media links
- resized and aligned the footer section,

 September 2025 – Responsive Design Enhancements

- Implemented responsive styling across all pages using CSS Grid, Flexbox, and media queries (max-width: 1200px, 768px, 480px).

- Converted fixed pixel values to relative units (em, rem, %) for scalable typography and spacing.

- Added responsive Hero section with background image scaling and adaptive text size.

-Updated Services, Projects, and Footer sections to support multi-column layouts on desktop and single-column layouts on mobile.

- Styled Testimonials section with vertical scroll container that adjusts to viewport height.

- Modified Contact section layout → map left, form right, details below on desktop → stacked layout on mobile for usability.

- Added Careers form toggle (Apply button shows form; Cancel/Submit hides it) for cleaner mobile UI.

- Tested responsiveness on desktop, tablet, and mobile using Chrome DevTools (W3C, 2023; Mozilla Developer Network, 2025).

References
Marcotte, E., 2011. Responsive Web Design. New York: A Book Apart.

W3C, 2023. Media Queries Level 4. [online] W3C. Available at: https://www.w3.org/TR/mediaqueries-4/
 [Accessed 13 September 2025].

Mozilla Developer Network (MDN), 2025. Responsive design. [online] MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
 [Accessed 13 September 2025].Marcotte, E., 2011. Responsive Web Design. New York: A Book Apart.

W3C, 2023. Media Queries Level 4. [online] W3C. Available at: https://www.w3.org/TR/mediaqueries-4/
 [Accessed 13 September 2025].

Mozilla Developer Network (MDN), 2025. Responsive design. [online] MDN Web Docs. Available at: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
 [Accessed 13 September 2025].

Javascript Updates
ENAGOM Electrical – Quickstart README

A concise version of the full documentation. This one‑page README provides everything needed to understand, run, and modify the website.

---

🚀 Overview

ENAGOM Electrical is a responsive, SEO‑friendly website built to showcase electrical services, brand partners, testimonials, and career opportunities. The site is structured with HTML5, styled using modern CSS (Flexbox, Grid, media queries), and enhanced with JavaScript for user interaction.


 Core Features

. Responsive layout (mobile‑first)
. Smooth navigation using section IDs
. Testimonials vertical scroll section
. CSS-powered project flip cards
. Careers apply‑form toggle (JS)
. Contact form validation (JS)
. Hero section with CTA button


 Technologies Used

* **HTML5** – page structure
* **CSS3** – responsive design, animations, grid, flex
* **JavaScript** – navigation controls, form validation, career form toggle

---

 JavaScript Features

1. Hero Section Button

Scrolls user to services section.

```javascript
document.getElementById("hero-btn").addEventListener("click", () => {
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});
```

2. Navigation Menu Toggle (Mobile)

```javascript
const navToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("nav ul");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
```

3. Careers "Apply Now" Form Toggle

```javascript
const applyButtons = document.querySelectorAll(".apply-btn");
const careersForm = document.getElementById("careers-form");
const closeForm = document.getElementById("close-form");

applyButtons.forEach(btn => {
  btn.addEventListener("click", () => careersForm.classList.add("show"));
});

closeForm.addEventListener("click", () => {
  careersForm.classList.remove("show"));
});
```

4. Contact Form Validation

```javascript
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (e) => {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    e.preventDefault();
    alert("Please complete all required fields.");
  }
});
```

---

How to Run

1. Download or clone project folder
2. Open **index.html** in any browser
3. Ensure images & assets remain in correct folders

No installation required.

---

 Notes

. Ensure section IDs match navigation href values
. All JavaScript placed in **script.js** and linked before `</body>`
.CSS media queries improve layout at 1200px, 768px, 480px breakpoints



 References (Harvard Style)

Marcotte, E., 2011. *Responsive Web Design*. New York: A Book Apart.

W3C, 2023. *Media Queries Level 4*. Available at: [https://www.w3.org/TR/mediaqueries-4/](https://www.w3.org/TR/mediaqueries-4/) (Accessed 13 September 2025).

Mozilla Developer Network, 2025. *Responsive Design*. Available at: [https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design) (Accessed 13 September 2025).

---
