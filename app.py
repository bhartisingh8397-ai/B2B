import os
import time
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, 'cloudflow')

# Use /tmp for SQLite database in Vercel serverless environment
if os.environ.get('VERCEL') or os.environ.get('AWS_LAMBDA_FUNCTION_NAME'):
    DATABASE_PATH = '/tmp/cloudflow.db'
else:
    DATABASE_PATH = os.path.join(BASE_DIR, 'cloudflow.db')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
app.secret_key = os.environ.get('SECRET_KEY', 'cloudflow-secret-key-2026-b2b-saas')

# Enable CORS with credentials support for sessions
CORS(app, supports_credentials=True)

# --------------------------------------------------------------------------
# SQLite Database Helpers & Initialization
# --------------------------------------------------------------------------
def get_db_connection():
    """Create a database connection with dict-like row access."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize SQLite database tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Contact messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            company TEXT,
            topic TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("Database tables initialized successfully in cloudflow.db")

# Initialize database on startup
init_db()

# --------------------------------------------------------------------------
# Frontend File Serving Routes
# --------------------------------------------------------------------------
@app.route('/')
def serve_index():
    """Serve main index.html landing page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve any frontend asset or HTML page (signin.html, signup.html, product.html, etc)."""
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    elif os.path.exists(os.path.join(FRONTEND_DIR, f"{path}.html")):
        return send_from_directory(FRONTEND_DIR, f"{path}.html")
    else:
        return send_from_directory(FRONTEND_DIR, 'index.html')

# --------------------------------------------------------------------------
# Authentication REST API Endpoints (Sign Up, Sign In, Logout, Me)
# --------------------------------------------------------------------------
@app.route('/api/auth/signup', methods=['POST'])
def handle_signup():
    """Register a new user in SQLite database."""
    data = request.get_json(silent=True) or request.form

    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not full_name:
        return jsonify({"success": False, "error": "Full Name is required."}), 400
    if not email or '@' not in email:
        return jsonify({"success": False, "error": "A valid email address is required."}), 400
    if not password or len(password) < 6:
        return jsonify({"success": False, "error": "Password must be at least 6 characters long."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check existing user
    existing_user = cursor.execute('SELECT id FROM users WHERE email = ?', (email,)).fetchone()
    if existing_user:
        conn.close()
        return jsonify({"success": False, "error": "An account with this email already exists."}), 409

    # Secure Password Hashing
    password_hash = generate_password_hash(password)

    try:
        cursor.execute(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            (full_name, email, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        # Set session state
        session['user_id'] = user_id
        session['user_name'] = full_name
        session['user_email'] = email

        return jsonify({
            "success": True,
            "message": "Account created successfully! Welcome to CloudFlow CRM.",
            "user": {
                "id": user_id,
                "full_name": full_name,
                "email": email
            }
        }), 201
    except Exception as e:
        conn.close()
        return jsonify({"success": False, "error": f"Registration failed: {str(e)}"}), 500

@app.route('/api/auth/login', methods=['POST'])
def handle_login():
    """Authenticate existing user credentials from SQLite database."""
    data = request.get_json(silent=True) or request.form

    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    if not email or not password:
        return jsonify({"success": False, "error": "Email and password are required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    user = cursor.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({"success": False, "error": "Invalid email or password."}), 401

    # Set session state
    session['user_id'] = user['id']
    session['user_name'] = user['full_name']
    session['user_email'] = user['email']

    return jsonify({
        "success": True,
        "message": "Signed in successfully!",
        "user": {
            "id": user['id'],
            "full_name": user['full_name'],
            "email": user['email']
        }
    }), 200

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Check current authenticated session user state."""
    if 'user_id' in session:
        return jsonify({
            "authenticated": True,
            "user": {
                "id": session['user_id'],
                "full_name": session['user_name'],
                "email": session['user_email']
            }
        }), 200
    else:
        return jsonify({"authenticated": False, "user": None}), 200

@app.route('/api/auth/logout', methods=['POST'])
def handle_logout():
    """Terminate active user session."""
    session.clear()
    return jsonify({"success": True, "message": "Signed out successfully."}), 200

# --------------------------------------------------------------------------
# Contact API Endpoint (Saved to SQLite `contacts` table)
# --------------------------------------------------------------------------
@app.route('/api/contact', methods=['POST'])
def handle_contact_submission():
    """Handle contact form submissions and store in SQLite contacts table."""
    data = request.get_json(silent=True) or request.form

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    company = data.get('company', '').strip()
    topic = data.get('topic', 'general').strip()
    message = data.get('message', '').strip()

    if not name:
        return jsonify({"success": False, "error": "Full Name is required."}), 400
    if not email or '@' not in email:
        return jsonify({"success": False, "error": "A valid work email address is required."}), 400
    if not message:
        return jsonify({"success": False, "error": "Message content is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        'INSERT INTO contacts (name, email, company, topic, message) VALUES (?, ?, ?, ?, ?)',
        (name, email, company, topic, message)
    )
    conn.commit()
    contact_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "success": True,
        "message": "Thank you! Your message has been saved to SQLite DB and dispatched to our sales team. We will reach out within 15 minutes.",
        "submission_id": contact_id
    }), 201

# --------------------------------------------------------------------------
# General REST API Endpoints
# --------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    """API Health Check Endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "CloudFlow CRM Backend API",
        "database": "SQLite 3 (cloudflow.db)",
        "version": "3.1.0",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }), 200

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Return real-time CRM dashboard preview statistics."""
    return jsonify({
        "total_arr": "$1,420,800",
        "arr_growth": "+24.8% vs last month",
        "win_rate": "42.6%",
        "win_rate_growth": "+8.2% AI optimized",
        "active_deals": 184,
        "deals_closing_soon": 12,
        "quarterly_velocity": [
            {"month": "Jan", "value": 450000, "height": "45%"},
            {"month": "Feb", "value": 600000, "height": "60%"},
            {"month": "Mar", "value": 780000, "height": "78%"},
            {"month": "Apr", "value": 650000, "height": "65%"},
            {"month": "May", "value": 880000, "height": "88%"},
            {"month": "Jun", "value": 980000, "height": "98%"}
        ]
    }), 200

@app.route('/api/pricing', methods=['GET'])
def get_pricing_plans():
    """Return available subscription plans and pricing details."""
    return jsonify({
        "plans": [
            {
                "id": "starter",
                "name": "Starter",
                "tagline": "Perfect for boutique sales teams and early-stage startups.",
                "monthly_price": 29,
                "annual_price": 23,
                "popular": False
            },
            {
                "id": "professional",
                "name": "Professional",
                "tagline": "For fast-growing revenue teams needing AI automation.",
                "monthly_price": 79,
                "annual_price": 63,
                "popular": True
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "tagline": "Built for large organizations requiring custom SLAs and security.",
                "monthly_price": 199,
                "annual_price": 159,
                "popular": False
            }
        ]
    }), 200

# --------------------------------------------------------------------------
# Application Runner
# --------------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"CloudFlow CRM Flask Server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
