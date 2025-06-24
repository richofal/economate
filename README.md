# EconoMate - Personal Finance Manager

EconoMate is a comprehensive personal finance management system built with Laravel, Inertia.js, React, and TypeScript. This application helps users track expenses, manage wallets, plan budgets, and analyze spending patterns with intuitive visualizations.

---

## ✨ Features

-   **Dashboard**: Overview of financial status with charts and summaries.
-   **Multi-wallet Management**: Track multiple accounts and payment methods.
-   **Transaction Tracking**: Log and categorize income and expenses.
-   **Budget Planning**: Set and monitor spending goals.
-   **Split Bill**: Share expenses with friends and track payments.
-   **Data Visualization**: Charts and graphs for financial analysis.
-   **User Roles**: Admin and regular user permissions.
-   **Responsive Design**: Works on desktop, tablet, and mobile devices.

---

## 🛠️ Requirements

-   PHP 8.1 or higher
-   Node.js 16+ and npm/yarn
-   MySQL 8.0+ or MariaDB 10.5+
-   Composer
-   Git

---

## 🚀 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/richofal/economate.git
    cd economate
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install JavaScript dependencies**

    ```bash
    npm install
    ```

4. **Environment setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

    Edit the **`.env`** file with your database credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=economate
    DB_USERNAME=root
    DB_PASSWORD=your_password
    ```

5. **Database setup**

    ```bash
    php artisan migrate --seed
    ```

    This will create all necessary tables and seed the database with initial data.

6. **Storage setup**

    ```bash
    php artisan storage:link
    ```

7. **Build assets**

    For development:

    ```bash
    npm run dev
    ```

    For production:

    ```bash
    npm run build
    ```

8. **Run the application**

    ```bash
    php artisan serve
    ```

    The application will be available at [http://localhost:8000](http://localhost:8000).

---

## 🔑 Default Login

### Admin Account:

-   **Email**: `admin@example.com`
-   **Password**: `password`

### User Account:

-   **Email**: `user@example.com`
-   **Password**: `password`

---

## 📂 Project Structure

economate/  
├── app/ # PHP application code  
│ ├── Http/Controllers/ # Controllers  
│ ├── Models/ # Eloquent models  
│ └── Policies/ # Authorization policies  
├── database/  
│ ├── migrations/ # Database migrations  
│ └── seeders/ # Database seeders  
├── resources/  
│ ├── js/ # React/TypeScript frontend code  
│ │ ├── Components/ # Reusable UI components  
│ │ ├── Layouts/ # Layout templates  
│ │ └── Pages/ # Page components  
│ ├── css/ # CSS files  
│ └── views/ # Blade templates  
├── routes/ # Route definitions  
├── public/ # Publicly accessible files  
├── storage/ # App storage  
└── tests/ # Test files

---

## 💻 Key Technologies

### Backend:

-   Laravel 10
-   PHP 8.1+
-   MySQL/MariaDB

### Frontend:

-   Inertia.js
-   React 18
-   TypeScript
-   Tailwind CSS
-   Framer Motion
-   Recharts

---

## ⚙️ Development Workflow

### Running Development Server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server for frontend
npm run dev
```

### Database Refresh

To refresh the database and seed it with initial data, run:

```bash
php artisan migrate:fresh --seed
```

This command will drop all tables and re-run all migrations, seeding the database with initial data.

### 🎨 Customization

You can customize the look and feel of the application by modifying the Tailwind CSS configuration and React components. The main styles are located in `resources/css/app.css`.

## Adding New Features

To add new features, follow these steps:

1. **Create a new migration** for any database changes:

    ```bash
    php artisan make:migration create_feature_table
    ```

2. **Update the model** if necessary, or create a new one.
3. **Create a new controller** for handling requests:

    ```bash
    php artisan make:controller FeatureController
    ```

4. **Add routes** in `routes/web.php` or `routes/api.php`.
5. **Create React components** in `resources/js/Components` or `resources/js/Pages`.
6. **Update the frontend** to include new features, ensuring to use Inertia.js for navigation.

## Styling

EconoMate uses Tailwind CSS for styling. You can customize the theme by modifying the following files:

-   `tailwind.config.js` for theme configuration.
-   CSS classes directly in React components.
-   `resources/css/app.css` for global styles.
