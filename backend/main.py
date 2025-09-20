from app import create_app, db
from flask import current_app

app = create_app()

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