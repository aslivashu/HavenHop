# HavenHop

HavenHop is a comprehensive full-stack web application designed for vacation rental property discovery, property management, user authentication, interactive geolocation mapping, and user-generated reviews.

Live Application: [https://havenhop.onrender.com](https://havenhop.onrender.com)

---

## Technical Stack & Architecture

### Backend Infrastructure

* **Runtime Environment:** Node.js


* **Framework:** Express.js for robust RESTful routing, middleware handling, and controller pattern structuring.


* **Database & ODM:** MongoDB Atlas paired with Mongoose for schema modeling, document validation, and database operations.


* **Authentication & Session Management:** Passport.js utilizing Local Strategy for secure credential verification, alongside `express-session` and `connect-mongo` for persistent session storage directly within MongoDB Atlas.
* **Image Management:** Multer middleware combined with Cloudinary storage API for handling multipart form data and cloud image hosting.
* **Security & Validation:** Joi schema validation for server-side input sanitization, custom error-handling classes (`ExpressError`), and asynchronous error-wrapper utilities (`wrapAsync`).

### Frontend Interface

* **Templating Engine:** Embedded JavaScript (EJS) rendered dynamically via `ejs-mate` layout management.


* **Styling Framework:** Bootstrap 5 for responsive design, custom CSS stylesheets, and Starability CSS for interactive star-rating components.
* **Mapping & Geolocation:** Leaflet.js and OpenStreetMap integration for dynamic marker rendering and coordinate visualization on property detail pages.

---

## Detailed Feature Implementation

### 1. User Management and Authentication System

* **Registration & Login:** Users can create an account or authenticate securely using local strategies provided by Passport.js. Passwords are automatically salted and hashed using passport-local-mongoose.
* **Session Persistence:** Express sessions are backed by MongoDB using `connect-mongo`, ensuring user authentication states persist across server restarts.
* **Authorization Controls:** Middleware checks are implemented to verify user privileges. Only designated property owners or review authors can access edit, update, or delete operations for their respective resources.

### 2. Property Listing Management (CRUD Operations)

* **Creation:** Authorized users can add new rental properties specifying a title, description, price per night, location, country, category, and an image upload.
* **Read / Discovery:** Users can browse all available listings on the home/index views, filter by categories, and view comprehensive details on individual listing pages.
* **Update & Deletion:** Property owners retain full control to edit property specifications or permanently delete listings from the database.

### 3. Geolocation and Interactive Map Integration

* **Geospatial Data:** Listings store geographic coordinates (`geometry.coordinates`) alongside textual location strings.
* **Client-Side Mapping:** Leaflet.js initializes an interactive map component on the show page, translating stored coordinates into visual markers that pinpoint the property location.

### 4. Review and Rating System

* **Interactive Ratings:** Authenticated users can submit feedback by selecting a star rating (1 to 5 stars) using Starability animations and writing text comments.
* **Metadata Tracking:** Each review document records the associated author (`ref: 'User'`), review text, numerical rating, and an automated timestamp (`createdAt`).
* **Granular Deletion:** Review authors can delete their individual reviews, which dynamically updates the listing's review collection.

---

## Local Development and Installation

### Prerequisites

Ensure Node.js and npm are installed on your local machine.

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/aslivashu/havenhop.git
cd HavenHop

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the root directory and configure the environment variables:
```env
ATLASDB_URI=your_mongodb_atlas_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

```


4. Initialize or seed the database with sample listing data:
```bash
node init/index.js

```


5. Start the local server using nodemon:
```bash
nodemon app.js

```


6. Access the application in your browser at `http://localhost:8080`.

---

## Project Directory Structure

```text
HavenHop/
├── controllers/      # Modular business logic for listings, reviews, and users
├── init/             # Mock datasets and database initialization scripts
├── models/           # Mongoose schemas (Listing, Review, User)
├── public/           # Client-side static assets (CSS stylesheets, custom JS, images)
├── routes/           # Express router definitions (listing.js, reviews.js, user.js)
├── utils/            # Custom utility functions (ExpressError.js, wrapAsync.js)
├── views/            # EJS template files (layouts, includes, listings, users)
├── app.js            # Express application entry point and middleware configuration
├── cloudConfig.js    # Cloudinary storage and multer storage configuration
└── middleware.js     # Custom authorization, authentication, and validation checks

```

---

## License

This project is licensed under the terms of the MIT License.


## Contributing
Contributions are always welcome! If you'd like to improve this weather app:
1. **Fork** the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**
