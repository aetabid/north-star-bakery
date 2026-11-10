# North Star Bakery

A responsive website for North Star Bakery, a neighborhood bakery that bakes everything by hand. The site helps local customers browse breads, pastries, and custom cakes, build a pre-order list, and send pre-order requests.

**Live site:** https://aetabid.github.io/north-star-bakery/

**Project presentation:** [View the slides (PDF)](North_Star_Bakery_Presentation.pdf)

## Pages

- **Home:** welcome message, storefront photo, audio greeting, and featured item of the week
- **Our Products:** breads, pastries, and cakes with prices, plus an interactive pre-order list builder
- **About Our Bakery:** the bakery's story, local ingredients, and team
- **Contact and Pre-Orders:** validated pre-order form, location, and hours

## Features

- **Pre-order list builder:** filter products by category, add items, and see a running estimated total
- **Saved list:** the pre-order list is stored in localStorage, so it survives a refresh and is filled into the contact form automatically
- **Form validation:** JavaScript checks name, email, phone format, request type, and pickup date (no past dates, closed Mondays, 3 days' notice for custom cakes), with clear error messages under each field
- **Accessibility:** descriptive alt text, labeled form fields, screen reader announcements for errors, and high-contrast colors

## Design

- **Colors:** cream (#FFF8F0), brown (#6B3E26), peach (#D88C5A), charcoal (#2F2A26)
- **Fonts:** Georgia for headings, Arial for body text
- **Layout:** Flexbox header and navigation, CSS Grid product cards
- **Responsive:** mobile-first CSS with a media query at 768px, so the navigation stacks on phones and sits in a row on larger screens

## Built With

- HTML5
- CSS3 (external stylesheet: `styles.css`)
- JavaScript (`scripts.js`)
- localStorage
- GitHub Pages

## Author

Ayman Tabidi
Introduction to Web Development
