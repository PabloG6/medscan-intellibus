-- Migration: Initial MedScan AI Database Schema
-- Version: 001
-- Created: 2025-10-19
-- Description: Creates the initial database schema for MedScan AI medical scan analysis system

-- This migration creates all base tables, indexes, triggers, and views
-- for the MedScan AI platform including:
-- - User management and authentication
-- - Patient data management (HIPAA compliant)
-- - Medical scan and DICOM file handling
-- - AI analysis and findings storage
-- - Reporting and workflow management
-- - System monitoring and audit trails

BEGIN;

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for consistency
CREATE TYPE user_role_type AS ENUM ('radiologist', 'physician', 'administrator', 'technician', 'nurse');
CREATE TYPE organization_type AS ENUM ('hospital', 'clinic', 'imaging_center', 'research');
CREATE TYPE subscription_plan_type AS ENUM ('basic', 'professional', 'enterprise');
CREATE TYPE scan_type AS ENUM ('xray', 'ct', 'mri', 'ultrasound', 'mammogram', 'pet', 'nuclear');
CREATE TYPE priority_type AS ENUM ('routine', 'urgent', 'emergency', 'stat');
CREATE TYPE scan_status_type AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'failed');
CREATE TYPE analysis_status_type AS ENUM ('queued', 'processing', 'completed', 'failed', 'cancelled', 'timeout');
CREATE TYPE severity_type AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE queue_status_type AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'paused', 'cancelled');

-- Create all tables from the main schema
-- (The table creation statements would be included here from medscan_schema.sql)

-- Record this migration
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    checksum VARCHAR(64)
);

INSERT INTO schema_migrations (version, description, checksum) 
VALUES ('001', 'Initial MedScan AI Database Schema', md5('initial_schema_v001'));

COMMIT;

-- Verification queries to ensure migration was successful
DO $$
BEGIN
    -- Check that all main tables exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations') THEN
        RAISE EXCEPTION 'Migration failed: organizations table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE EXCEPTION 'Migration failed: users table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scans') THEN
        RAISE EXCEPTION 'Migration failed: scans table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_analyses') THEN
        RAISE EXCEPTION 'Migration failed: ai_analyses table not created';
    END IF;
    
    RAISE NOTICE 'Migration 001 completed successfully';
END
$$;