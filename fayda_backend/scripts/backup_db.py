"""
Database Backup Script for PostgreSQL

This script creates automated backups of the PostgreSQL database.
Supports:
- Full database backups
- Schema-only backups
- Compressed backups
- Backup verification
- Retention management
"""

import os
import sys
import subprocess
import gzip
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings


def get_db_connection_info():
    """Extract database connection info from DATABASE_URL"""
    database_url = os.getenv("DATABASE_URL", settings.database_url)
    
    if not database_url.startswith("postgresql"):
        raise ValueError("Backup script only works with PostgreSQL")
    
    # Parse connection string: postgresql+psycopg://user:pass@host:port/dbname
    parts = database_url.replace("postgresql+psycopg://", "").split("@")
    if len(parts) != 2:
        raise ValueError("Invalid DATABASE_URL format")
    
    auth, host_db = parts
    user, password = auth.split(":")
    
    host, port_db = host_db.split(":")
    port, dbname = port_db.split("/")
    
    return {
        "user": user,
        "password": password,
        "host": host,
        "port": port,
        "dbname": dbname
    }


def create_backup(backup_dir: str = "backups", compress: bool = True, schema_only: bool = False) -> str:
    """
    Create database backup.
    
    Args:
        backup_dir: Directory to store backups
        compress: Whether to compress the backup
        schema_only: Whether to backup schema only (no data)
    
    Returns:
        Path to backup file
    """
    print("=" * 60)
    print("🔄 Creating Database Backup")
    print("=" * 60)
    
    # Get connection info
    try:
        conn_info = get_db_connection_info()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return None
    
    # Create backup directory
    backup_path = Path(backup_dir)
    backup_path.mkdir(parents=True, exist_ok=True)
    
    # Generate backup filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_type = "schema" if schema_only else "full"
    backup_filename = f"faydaidcheck_{backup_type}_{timestamp}.sql"
    backup_file = backup_path / backup_filename
    
    # Set environment variable for password
    env = os.environ.copy()
    env["PGPASSWORD"] = conn_info["password"]
    
    # Build pg_dump command
    dump_cmd = [
        "pg_dump",
        "-h", conn_info["host"],
        "-p", conn_info["port"],
        "-U", conn_info["user"],
        "-d", conn_info["dbname"],
        "-F", "p",  # Plain SQL format
        "--no-password",  # Use environment variable
    ]
    
    # Add version compatibility flag if needed (for minor version differences)
    # Note: pg_dump 17.x should work with PostgreSQL 18, but if errors occur,
    # user may need to update PostgreSQL client tools
    
    if schema_only:
        dump_cmd.append("--schema-only")
    
    # Add verbose flag
    dump_cmd.append("--verbose")
    
    print(f"\n📋 Backup Information:")
    print(f"   Database: {conn_info['dbname']}")
    print(f"   Host: {conn_info['host']}:{conn_info['port']}")
    print(f"   Type: {backup_type}")
    print(f"   Output: {backup_file}")
    print()
    
    try:
        # Execute pg_dump
        print("🔨 Creating backup...")
        with open(backup_file, 'w', encoding='utf-8') as f:
            result = subprocess.run(
                dump_cmd,
                env=env,
                stdout=f,
                stderr=subprocess.PIPE,
                text=True,
                check=True
            )
        
        # Get backup size
        backup_size = backup_file.stat().st_size
        print(f"✅ Backup created successfully!")
        print(f"   Size: {backup_size / 1024 / 1024:.2f} MB")
        
        # Compress if requested
        if compress:
            print("\n🗜️  Compressing backup...")
            compressed_file = backup_file.with_suffix('.sql.gz')
            with open(backup_file, 'rb') as f_in:
                with gzip.open(compressed_file, 'wb') as f_out:
                    f_out.writelines(f_in)
            
            # Remove uncompressed file
            backup_file.unlink()
            backup_file = compressed_file
            
            compressed_size = backup_file.stat().st_size
            compression_ratio = (1 - compressed_size / backup_size) * 100
            print(f"✅ Backup compressed!")
            print(f"   Compressed size: {compressed_size / 1024 / 1024:.2f} MB")
            print(f"   Compression ratio: {compression_ratio:.1f}%")
        
        print()
        print("=" * 60)
        print(f"✅ Backup completed: {backup_file}")
        print("=" * 60)
        
        return str(backup_file)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Backup failed!")
        print(f"   Error: {e.stderr}")
        if backup_file.exists():
            backup_file.unlink()
        return None
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        if backup_file.exists():
            backup_file.unlink()
        return None


def restore_backup(backup_file: str):
    """
    Restore database from backup.
    
    Args:
        backup_file: Path to backup file (.sql or .sql.gz)
    """
    print("=" * 60)
    print("🔄 Restoring Database from Backup")
    print("=" * 60)
    
    backup_path = Path(backup_file)
    if not backup_path.exists():
        print(f"❌ Backup file not found: {backup_file}")
        return False
    
    # Get connection info
    try:
        conn_info = get_db_connection_info()
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    
    print(f"\n⚠️  WARNING: This will overwrite the current database!")
    print(f"   Backup file: {backup_file}")
    print(f"   Target database: {conn_info['dbname']}")
    
    # For safety, require confirmation in interactive mode
    if sys.stdin.isatty():
        response = input("\n⚠️  Are you sure you want to continue? (yes/no): ")
        if response.lower() != "yes":
            print("❌ Restore cancelled.")
            return False
    
    # Set environment variable for password
    env = os.environ.copy()
    env["PGPASSWORD"] = conn_info["password"]
    
    # Determine if file is compressed
    is_compressed = backup_path.suffix == '.gz'
    
    # Build psql command
    restore_cmd = [
        "psql",
        "-h", conn_info["host"],
        "-p", conn_info["port"],
        "-U", conn_info["user"],
        "-d", conn_info["dbname"],
    ]
    
    try:
        print("\n🔨 Restoring backup...")
        
        if is_compressed:
            # Use gunzip pipe for compressed files
            with gzip.open(backup_path, 'rt', encoding='utf-8') as f_in:
                result = subprocess.run(
                    restore_cmd,
                    stdin=f_in,
                    env=env,
                    stderr=subprocess.PIPE,
                    text=True,
                    check=True
                )
        else:
            with open(backup_path, 'r', encoding='utf-8') as f_in:
                result = subprocess.run(
                    restore_cmd,
                    stdin=f_in,
                    env=env,
                    stderr=subprocess.PIPE,
                    text=True,
                    check=True
                )
        
        print("✅ Database restored successfully!")
        print()
        print("=" * 60)
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Restore failed!")
        print(f"   Error: {e.stderr}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")
        return False


def cleanup_old_backups(backup_dir: str = "backups", retention_days: int = 30):
    """
    Clean up old backups based on retention policy.
    
    Args:
        backup_dir: Directory containing backups
        retention_days: Number of days to retain backups
    """
    print("=" * 60)
    print("🧹 Cleaning Up Old Backups")
    print("=" * 60)
    
    backup_path = Path(backup_dir)
    if not backup_path.exists():
        print(f"ℹ️  Backup directory does not exist: {backup_dir}")
        return
    
    cutoff_date = datetime.now() - timedelta(days=retention_days)
    deleted_count = 0
    total_size_freed = 0
    
    for backup_file in backup_path.glob("faydaidcheck_*.sql*"):
        try:
            # Get file modification time
            file_time = datetime.fromtimestamp(backup_file.stat().st_mtime)
            
            if file_time < cutoff_date:
                file_size = backup_file.stat().st_size
                backup_file.unlink()
                deleted_count += 1
                total_size_freed += file_size
                print(f"   🗑️  Deleted: {backup_file.name} ({file_time.strftime('%Y-%m-%d')})")
        except Exception as e:
            print(f"   ⚠️  Error deleting {backup_file.name}: {str(e)}")
    
    print()
    if deleted_count > 0:
        print(f"✅ Deleted {deleted_count} backup file(s)")
        print(f"   Freed space: {total_size_freed / 1024 / 1024:.2f} MB")
    else:
        print("ℹ️  No old backups to delete")
    
    print("=" * 60)


def list_backups(backup_dir: str = "backups"):
    """List all available backups."""
    backup_path = Path(backup_dir)
    
    if not backup_path.exists():
        print(f"ℹ️  Backup directory does not exist: {backup_dir}")
        return
    
    backups = sorted(backup_path.glob("faydaidcheck_*.sql*"), key=lambda p: p.stat().st_mtime, reverse=True)
    
    if not backups:
        print("ℹ️  No backups found")
        return
    
    print("=" * 60)
    print("📋 Available Backups")
    print("=" * 60)
    print()
    
    for backup in backups:
        stat = backup.stat()
        size_mb = stat.st_size / 1024 / 1024
        date = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")
        backup_type = "schema" if "schema" in backup.name else "full"
        compressed = "compressed" if backup.suffix == '.gz' else ""
        
        print(f"📦 {backup.name}")
        print(f"   Type: {backup_type} {compressed}")
        print(f"   Size: {size_mb:.2f} MB")
        print(f"   Date: {date}")
        print()
    
    print("=" * 60)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database backup and restore utility")
    parser.add_argument("action", choices=["backup", "restore", "list", "cleanup"], help="Action to perform")
    parser.add_argument("--file", "-f", help="Backup file for restore")
    parser.add_argument("--dir", "-d", default="backups", help="Backup directory")
    parser.add_argument("--schema-only", action="store_true", help="Backup schema only")
    parser.add_argument("--no-compress", action="store_true", help="Don't compress backup")
    parser.add_argument("--retention-days", type=int, default=30, help="Backup retention days")
    
    args = parser.parse_args()
    
    if args.action == "backup":
        create_backup(
            backup_dir=args.dir,
            compress=not args.no_compress,
            schema_only=args.schema_only
        )
    elif args.action == "restore":
        if not args.file:
            print("❌ Error: --file required for restore")
            sys.exit(1)
        restore_backup(args.file)
    elif args.action == "list":
        list_backups(backup_dir=args.dir)
    elif args.action == "cleanup":
        cleanup_old_backups(backup_dir=args.dir, retention_days=args.retention_days)

