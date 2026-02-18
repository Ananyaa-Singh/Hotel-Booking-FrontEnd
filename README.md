## **Frontend README.md**

```markdown
# Hotel Booking System - Frontend

This is the **React frontend** for the Hotel Booking System. It allows Admins to manage rooms/bookings and Customers to browse rooms, book, and pay online.

---

## **Features**

- Admin dashboard: manage rooms and bookings
- Customer dashboard: browse rooms, book, and pay
- Room filtering and pagination
- Responsive UI design
- JWT tokens stored encrypted in `localStorage`

---

## **Technologies Used**

- React
- React Router DOM
- Axios
- Tailwind CSS / Custom CSS
- CryptoJS

---

## **Setup Instructions**

1. Clone the repository:

```bash
git clone <frontend-repo-url>
cd hotel-booking-frontend
Install dependencies:

npm install
Configure backend API URL in src/service/ApiService.js:

static BASE_URL = "http://localhost:8080/api";
Run the frontend:

npm start
Frontend runs on: http://localhost:3000

Usage
Admin: Navigate to /admin to manage rooms and bookings

Customer: Browse rooms, make bookings, and pay online

