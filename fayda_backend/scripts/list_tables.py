"""
List all tables in the database with their schemas.
Run this to see what tables exist and view their structure.
"""
import os
import sys
from sqlalchemy import create_engine, text, inspect
from tabulate import tabulate

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings

def list_all_tables():
    """List all tables with column information."""
    
    database_url = os.getenv("DATABASE_URL", settings.database_url)
    
    if not database_url.startswith("postgresql"):
        print("⚠️  This script works best with PostgreSQL.")
        return
    
    print("=" * 80)
    print("📋 Database Tables Report")
    print("=" * 80)
    print()
    
    try:
        engine = create_engine(database_url, pool_pre_ping=True)
        inspector = inspect(engine)
        
        # Get all schemas
        schemas = inspector.get_schema_names()
        
        all_tables = []
        
        for schema in schemas:
            if schema in ['pg_catalog', 'information_schema']:
                continue
                
            tables = inspector.get_table_names(schema=schema)
            
            for table in tables:
                # Get column info
                columns = inspector.get_columns(table, schema=schema)
                column_info = ", ".join([f"{col['name']} ({col['type']})" for col in columns[:3]])
                if len(columns) > 3:
                    column_info += f", ... (+{len(columns)-3} more)"
                
                # Get row count
                with engine.connect() as conn:
                    try:
                        result = conn.execute(text(f'SELECT COUNT(*) FROM "{schema}"."{table}"'))
                        count = result.fetchone()[0]
                    except:
                        count = "N/A"
                
                all_tables.append({
                    'Schema': schema,
                    'Table': table,
                    'Columns': len(columns),
                    'Rows': count,
                    'Preview': column_info
                })
        
        if all_tables:
            print(tabulate(all_tables, headers='keys', tablefmt='grid', showindex=False))
            print()
            print(f"Total: {len(all_tables)} table(s)")
        else:
            print("No tables found.")
            
        # Show expected tables
        print()
        print("=" * 80)
        print("📌 Expected Application Tables")
        print("=" * 80)
        expected_tables = [
            'tenant', 'users', 'payments', 'verification', 
            'subject_pii', 'evidence_object', 'audit_event'
        ]
        
        found_tables = [t['Table'] for t in all_tables]
        for expected in expected_tables:
            status = "✅" if expected in found_tables else "❌"
            print(f"{status} {expected}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return

if __name__ == "__main__":
    list_all_tables()

