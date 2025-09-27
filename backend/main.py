from app import create_app, db
from flask import current_app
from flask_cors import CORS

app = create_app()

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/test-db')
def test_db():
    try:
        # Use db from create_app
        conn = db.engine.raw_connection()
        conn.close()
        return "Database connected successfully!"
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)
