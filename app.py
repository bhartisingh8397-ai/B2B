import os
import time
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# Initialize Flask application with static folder configured to cloudflow
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, 'cloudflow')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app)  # Enable Cross-Origin Resource Sharing for API routes

# In-memory storage for contact submissions (production apps would use a database)
CONTACT_SUBMISSIONS = []

# --------------------------------------------------------------------------
# Frontend File Serving Routes
# --------------------------------------------------------------------------
@app.route('/')
def serve_index():
    """Serve main index.html landing page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    """Serve any frontend asset or HTML page (product.html, pricing.html, etc)."""
    if os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    elif os.path.exists(os.path.join(FRONTEND_DIR, f"{path}.html")):
        return send_from_directory(FRONTEND_DIR, f"{path}.html")
    else:
        return send_from_directory(FRONTEND_DIR, 'index.html')

# --------------------------------------------------------------------------
# REST API Endpoints
# --------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    """API Health Check Endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "CloudFlow CRM Backend API",
        "version": "3.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "uptime": "99.99%"
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
                "popular": False,
                "features": [
                    "Up to 5 Active Users",
                    "Visual Kanban Pipelines (3 Max)",
                    "10,000 Contact Records",
                    "Email & Calendar Integration",
                    "Standard Dashboard Analytics"
                ]
            },
            {
                "id": "professional",
                "name": "Professional",
                "tagline": "For fast-growing revenue teams needing AI automation.",
                "monthly_price": 79,
                "annual_price": 63,
                "popular": True,
                "features": [
                    "Unlimited Active Users",
                    "Unlimited Custom Pipelines",
                    "100,000 Contact Records",
                    "AI Sales Co-Pilot & Sentiment Scoring",
                    "Visual Workflow Builder",
                    "Native Slack, Zoom & Stripe Sync"
                ]
            },
            {
                "id": "enterprise",
                "name": "Enterprise",
                "tagline": "Built for large organizations requiring custom SLAs and security.",
                "monthly_price": 199,
                "annual_price": 159,
                "popular": False,
                "features": [
                    "Everything in Professional",
                    "Unlimited Contact Records",
                    "Custom AI Model Training",
                    "REST API & Webhooks Access",
                    "SAML SSO & Audit Logging",
                    "99.9% Guaranteed Uptime SLA",
                    "Dedicated Account Manager & 24/7 Phone Support"
                ]
            }
        ]
    }), 200

@app.route('/api/integrations', methods=['GET'])
def get_integrations():
    """Return pre-built ecosystem integrations."""
    return jsonify({
        "total": 12,
        "integrations": [
            {"name": "Slack", "category": "Communication", "icon": "#", "color": "rgba(99,102,241,0.2)"},
            {"name": "Gmail / Workspace", "category": "Email", "icon": "M", "color": "rgba(239,68,68,0.2)"},
            {"name": "Zapier", "category": "Automation", "icon": "Z", "color": "rgba(245,158,11,0.2)"},
            {"name": "Stripe", "category": "Billing", "icon": "S", "color": "rgba(6,182,212,0.2)"},
            {"name": "Zoom", "category": "Meetings", "icon": "Z", "color": "rgba(168,85,247,0.2)"},
            {"name": "HubSpot", "category": "Marketing", "icon": "H", "color": "rgba(16,185,129,0.2)"}
        ]
    }), 200

@app.route('/api/contact', methods=['POST'])
def handle_contact_submission():
    """Handle contact form submissions with data validation."""
    data = request.get_json(silent=True) or request.form

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    company = data.get('company', '').strip()
    topic = data.get('topic', 'general').strip()
    message = data.get('message', '').strip()

    # Field Validation
    if not name:
        return jsonify({"success": False, "error": "Full Name is required."}), 400
    if not email or '@' not in email:
        return jsonify({"success": False, "error": "A valid work email address is required."}), 400
    if not message:
        return jsonify({"success": False, "error": "Message content is required."}), 400

    submission = {
        "id": f"SUB-{int(time.time())}",
        "name": name,
        "email": email,
        "company": company or "N/A",
        "topic": topic,
        "message": message,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }

    CONTACT_SUBMISSIONS.append(submission)

    return jsonify({
        "success": True,
        "message": "Thank you! Your message has been received by CloudFlow CRM sales team. We will reach out within 15 minutes.",
        "submission_id": submission["id"]
    }), 201

# --------------------------------------------------------------------------
# Application Runner
# --------------------------------------------------------------------------
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"CloudFlow CRM Flask Server running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
