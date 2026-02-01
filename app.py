from flask import Flask, render_template, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from werkzeug.serving import make_ssl_devcert
import mysql.connector
import os
import uuid
from datetime import datetime

from Administrator.app import admin_bp
from gatepass.app import gatepass_bp

app = Flask(__name__)

app.secret_key = 'uahc-vis'

app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(gatepass_bp, url_prefix='/gatepass')

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="UAHC-VIS"
    )

if not os.path.exists('ssl_cert.crt') or not os.path.exists('ssl_cert.key'):
    make_ssl_devcert('ssl_cert', host='localhost')  # Adjust path if needed

# Set the upload directories for profile pictures and violation images
BASE_UPLOAD_FOLDER = 'uploads'
PROFILE_FOLDER = os.path.join(BASE_UPLOAD_FOLDER, 'profile')
VIOLATION_FOLDER = os.path.join(BASE_UPLOAD_FOLDER, 'violations')

os.makedirs(PROFILE_FOLDER, exist_ok=True)
os.makedirs(VIOLATION_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def generate_report_id():
    return str(uuid.uuid4())

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    print("Home page accessed")
    return render_template('index.html')


@app.route('/scanner')
def scanner():
    return render_template('scanner.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/uploads/profile/<filename>')
def uploaded_profile(filename):
    return send_from_directory(PROFILE_FOLDER, secure_filename(filename))


@app.route('/uploads/violations/<filename>')
def uploaded_violation(filename):
    return send_from_directory(VIOLATION_FOLDER, secure_filename(filename))


@app.route('/api/user/<user_id>')
def get_user_data(user_id):
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
                SELECT 
                    CONCAT(o.first_name, ' ', o.last_name) AS full_name,
                    v.vehicle_id,  -- Add a comma here to separate fields
                    CONCAT(o.barangay, ', ', o.municipality, ', ', o.province) AS owner_address,
                    o.phone,
                    o.profile_pic,
                    e.name AS emergency_name,
                    e.phone AS emergency_phone
                FROM owner o
                LEFT JOIN emergency e ON o.user_id = e.user_id
                LEFT JOIN vehicle v ON o.user_id = v.user_id  -- Assuming the owner has a relationship with vehicle
                WHERE o.user_id = %s
            """, (user_id,))

        
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if not result:
            return jsonify({'status': 'error', 'message': 'User not found'}), 404

        return jsonify(result)

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/report_violation', methods=['POST'])
def report_violation():
    report_id = generate_report_id()
    try:
        violation_type = request.form['violation']
        vehicle_id = request.form['vehicle_id']
        user_id = request.form['user_id']
        status = 'PENDING'
        report_date = datetime.now().strftime('%Y-%m-%d')
        r_contact = request.form['reporter_contact']
        r_name = request.form['reporter_name']

        # Get list of files
        files = request.files.getlist('violation_images[]')
        
        if not files or len(files) == 0:
            return jsonify({'status': 'error', 'message': 'Proof is required'}), 400

        saved_filenames = []

        for file in files:
            if file and file.filename:
                # 1. Get the original extension (if any)
                # If file is 'document.pdf', ext becomes 'pdf'
                parts = file.filename.rsplit('.', 1)
                ext = parts[1].lower() if len(parts) > 1 else "dat"
                
                # 2. Generate a completely random name to prevent script execution
                filename = f"{uuid.uuid4()}.{ext}"
                file_path = os.path.join(VIOLATION_FOLDER, filename)
                
                # 3. Save the file
                file.save(file_path)
                saved_filenames.append(filename)

        images_string = ",".join(saved_filenames)

        # Database Insertion
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO reports (report_id, violation, vehicle_id, user_id, image, status, date, reporter_contact, reporter_name)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (report_id, violation_type, vehicle_id, user_id, images_string, status, report_date, r_contact, r_name))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'status': 'success', 'message': f'Reported with {len(saved_filenames)} files.'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001) #ssl_context=("ssl_cert.crt", "ssl_cert.key"))
