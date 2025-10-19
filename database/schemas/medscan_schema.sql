-- MedScan AI Database Schema
-- Medical Scan Analysis and AI Processing System
-- Created: October 19, 2025
-- Version: 1.0.0

-- Enable UUID extension for PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USER MANAGEMENT & AUTHENTICATION
-- =============================================================================

-- Organizations table for multi-tenant support
CREATE TABLE organizations (
    organization_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hospital', 'clinic', 'imaging_center', 'research')),
    address TEXT,
    phone VARCHAR(20),
    license_number VARCHAR(100),
    subscription_plan VARCHAR(20) DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'professional', 'enterprise')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table for medical professionals
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('radiologist', 'physician', 'administrator', 'technician', 'nurse')),
    department VARCHAR(100),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    license_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for security tracking
CREATE TABLE user_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 2. PATIENT MANAGEMENT
-- =============================================================================

-- Patients table with HIPAA-compliant structure
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_number VARCHAR(50) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'unknown')),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    medical_record_number VARCHAR(100),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_number, organization_id)
);

-- Patient medical history for context
CREATE TABLE patient_medical_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    condition_name VARCHAR(200) NOT NULL,
    diagnosis_date DATE,
    severity VARCHAR(20) CHECK (severity IN ('mild', 'moderate', 'severe', 'critical')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'chronic', 'remission')),
    notes TEXT,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. MEDICAL SCAN MANAGEMENT
-- =============================================================================

-- Main scans table
CREATE TABLE scans (
    scan_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    scan_number VARCHAR(50) NOT NULL,
    scan_type VARCHAR(50) NOT NULL CHECK (scan_type IN ('xray', 'ct', 'mri', 'ultrasound', 'mammogram', 'pet', 'nuclear')),
    body_part VARCHAR(100),
    study_description TEXT,
    referring_physician VARCHAR(200),
    technician_id UUID REFERENCES users(user_id),
    department VARCHAR(100),
    modality VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'emergency', 'stat')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'failed')),
    acquisition_date TIMESTAMP WITH TIME ZONE,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    file_path VARCHAR(500),
    file_size_mb DECIMAL(10,2),
    dicom_metadata JSONB,
    clinical_indication TEXT,
    contrast_used BOOLEAN DEFAULT false,
    contrast_type VARCHAR(100),
    radiation_dose_dlp DECIMAL(10,3), -- Dose Length Product for CT
    radiation_dose_ctdi DECIMAL(10,3), -- CT Dose Index
    organization_id UUID NOT NULL REFERENCES organizations(organization_id) ON DELETE CASCADE,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scan_number, organization_id)
);

-- Individual scan files (DICOM series)
CREATE TABLE scan_files (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    series_number INTEGER,
    instance_number INTEGER,
    slice_thickness DECIMAL(8,4),
    pixel_spacing_x DECIMAL(8,4),
    pixel_spacing_y DECIMAL(8,4),
    checksum VARCHAR(128),
    upload_status VARCHAR(20) DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed', 'corrupted')),
    dicom_uid VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 4. AI ANALYSIS & PROCESSING
-- =============================================================================

-- AI model versions and configurations
CREATE TABLE ai_models (
    model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('classification', 'detection', 'segmentation', 'hybrid')),
    supported_scan_types VARCHAR(200)[], -- Array of supported scan types
    accuracy_rate DECIMAL(5,2),
    sensitivity DECIMAL(5,2),
    specificity DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    deployment_date DATE,
    training_dataset_size INTEGER,
    model_file_path VARCHAR(500),
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(model_name, model_version)
);

-- AI analysis jobs and results
CREATE TABLE ai_analyses (
    analysis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES ai_models(model_id),
    analysis_type VARCHAR(100),
    processing_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    processing_end_time TIMESTAMP WITH TIME ZONE,
    processing_duration_seconds INTEGER,
    status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed', 'cancelled', 'timeout')),
    confidence_score DECIMAL(5,2),
    overall_result VARCHAR(20) DEFAULT 'indeterminate' CHECK (overall_result IN ('normal', 'abnormal', 'indeterminate')),
    priority_score INTEGER DEFAULT 0,
    raw_output JSONB,
    processed_output JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    processing_node VARCHAR(100), -- For distributed processing
    gpu_time_seconds DECIMAL(10,3),
    cpu_time_seconds DECIMAL(10,3),
    memory_used_mb INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual findings from AI analysis
CREATE TABLE findings (
    finding_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES ai_analyses(analysis_id) ON DELETE CASCADE,
    finding_type VARCHAR(100) NOT NULL,
    finding_category VARCHAR(50), -- e.g., 'pathology', 'artifact', 'normal_variant'
    description TEXT NOT NULL,
    location_description VARCHAR(200),
    anatomical_region VARCHAR(100),
    coordinates JSONB, -- Store bounding box, polygon, or point coordinates
    slice_number INTEGER,
    confidence_percentage DECIMAL(5,2) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    clinical_significance TEXT,
    recommended_action TEXT,
    is_primary_finding BOOLEAN DEFAULT false,
    is_confirmed BOOLEAN, -- Radiologist confirmation
    confirmed_by UUID REFERENCES users(user_id),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    false_positive BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 5. REPORTS & DOCUMENTATION
-- =============================================================================

-- Radiology reports
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES ai_analyses(analysis_id),
    reporting_radiologist_id UUID NOT NULL REFERENCES users(user_id),
    supervising_radiologist_id UUID REFERENCES users(user_id),
    report_type VARCHAR(20) DEFAULT 'preliminary' CHECK (report_type IN ('preliminary', 'final', 'addendum', 'correction', 'revised')),
    clinical_history TEXT,
    technique TEXT,
    comparison_studies TEXT,
    findings_text TEXT NOT NULL,
    impression TEXT NOT NULL,
    recommendations TEXT,
    critical_findings TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_timeframe VARCHAR(50),
    report_status VARCHAR(20) DEFAULT 'draft' CHECK (report_status IN ('draft', 'pending_review', 'finalized', 'amended', 'cancelled')),
    dictated_at TIMESTAMP WITH TIME ZONE,
    transcribed_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    finalized_at TIMESTAMP WITH TIME ZONE,
    turnaround_time_minutes INTEGER,
    word_count INTEGER,
    character_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report templates for standardization
CREATE TABLE report_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(100) NOT NULL,
    scan_type VARCHAR(50) NOT NULL,
    body_part VARCHAR(100),
    template_content TEXT NOT NULL,
    variables JSONB, -- Placeholder variables
    organization_id UUID REFERENCES organizations(organization_id),
    created_by UUID NOT NULL REFERENCES users(user_id),
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 6. WORKFLOW & QUEUE MANAGEMENT
-- =============================================================================

-- Scan processing queue
CREATE TABLE scan_queue (
    queue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL REFERENCES scans(scan_id) ON DELETE CASCADE,
    queue_type VARCHAR(20) DEFAULT 'analysis' CHECK (queue_type IN ('analysis', 'reporting', 'review', 'quality_control')),
    queue_position INTEGER,
    priority_score INTEGER DEFAULT 0,
    assigned_to_user_id UUID REFERENCES users(user_id),
    assigned_by_user_id UUID REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'paused', 'cancelled')),
    estimated_processing_time INTEGER, -- seconds
    actual_processing_time INTEGER, -- seconds
    sla_deadline TIMESTAMP WITH TIME ZONE,
    queue_entered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Workflow rules and automation
CREATE TABLE workflow_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(100) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    conditions JSONB NOT NULL, -- JSON conditions for rule matching
    actions JSONB NOT NULL, -- JSON actions to execute
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    execution_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 7. SYSTEM ANALYTICS & MONITORING
-- =============================================================================

-- System performance metrics
CREATE TABLE system_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('processing_time', 'accuracy_rate', 'throughput', 'user_activity', 'system_load', 'error_rate')),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(20),
    organization_id UUID REFERENCES organizations(organization_id),
    user_id UUID REFERENCES users(user_id),
    scan_id UUID REFERENCES scans(scan_id),
    analysis_id UUID REFERENCES ai_analyses(analysis_id),
    aggregation_period VARCHAR(20), -- 'hour', 'day', 'week', 'month'
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comprehensive audit logs for HIPAA compliance
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    session_id UUID REFERENCES user_sessions(session_id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    request_url VARCHAR(500),
    http_method VARCHAR(10),
    response_status INTEGER,
    organization_id UUID REFERENCES organizations(organization_id),
    patient_id UUID REFERENCES patients(patient_id), -- For patient access tracking
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System alerts and notifications
CREATE TABLE system_alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('security', 'performance', 'system_error', 'data_integrity', 'compliance')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    organization_id UUID REFERENCES organizations(organization_id),
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users(user_id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 8. CONFIGURATION & SETTINGS
-- =============================================================================

-- System and organization settings
CREATE TABLE system_settings (
    setting_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(organization_id),
    setting_category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string' CHECK (setting_type IN ('string', 'integer', 'decimal', 'boolean', 'json', 'array')),
    description TEXT,
    is_system_setting BOOLEAN DEFAULT false,
    is_encrypted BOOLEAN DEFAULT false,
    validation_rules JSONB,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, setting_key)
);

-- User preferences and customizations
CREATE TABLE user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    preference_category VARCHAR(50) NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, preference_key)
);

-- =============================================================================
-- 9. INTEGRATION & EXTERNAL SYSTEMS
-- =============================================================================

-- PACS and external system integrations
CREATE TABLE external_integrations (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(organization_id),
    integration_type VARCHAR(50) NOT NULL CHECK (integration_type IN ('pacs', 'ris', 'his', 'emr', 'hl7', 'dicom')),
    system_name VARCHAR(100) NOT NULL,
    endpoint_url VARCHAR(500),
    authentication_type VARCHAR(50),
    credentials JSONB, -- Encrypted credentials
    configuration JSONB,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'idle' CHECK (sync_status IN ('idle', 'syncing', 'error', 'disabled')),
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Data synchronization logs
CREATE TABLE sync_logs (
    sync_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES external_integrations(integration_id),
    sync_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound', 'bidirectional')),
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =============================================================================

-- User and authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Patient indexes
CREATE INDEX idx_patients_number_org ON patients(patient_number, organization_id);
CREATE INDEX idx_patients_organization ON patients(organization_id);
CREATE INDEX idx_patients_mrn ON patients(medical_record_number);

-- Scan indexes
CREATE INDEX idx_scans_patient_id ON scans(patient_id);
CREATE INDEX idx_scans_organization ON scans(organization_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_type ON scans(scan_type);
CREATE INDEX idx_scans_acquisition_date ON scans(acquisition_date);
CREATE INDEX idx_scans_priority ON scans(priority);

-- AI analysis indexes
CREATE INDEX idx_ai_analyses_scan_id ON ai_analyses(scan_id);
CREATE INDEX idx_ai_analyses_status ON ai_analyses(status);
CREATE INDEX idx_ai_analyses_model_id ON ai_analyses(model_id);
CREATE INDEX idx_ai_analyses_start_time ON ai_analyses(processing_start_time);

-- Findings indexes
CREATE INDEX idx_findings_analysis_id ON findings(analysis_id);
CREATE INDEX idx_findings_type ON findings(finding_type);
CREATE INDEX idx_findings_severity ON findings(severity);

-- Queue indexes
CREATE INDEX idx_scan_queue_status ON scan_queue(status);
CREATE INDEX idx_scan_queue_assigned_to ON scan_queue(assigned_to_user_id);
CREATE INDEX idx_scan_queue_priority ON scan_queue(priority_score DESC);

-- Audit and monitoring indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_system_metrics_type_time ON system_metrics(metric_type, recorded_at);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scans_updated_at BEFORE UPDATE ON scans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INITIAL DATA AND CONSTRAINTS
-- =============================================================================

-- Add check constraints for data integrity
ALTER TABLE scans ADD CONSTRAINT check_file_size_positive 
    CHECK (file_size_mb IS NULL OR file_size_mb >= 0);

ALTER TABLE findings ADD CONSTRAINT check_confidence_range 
    CHECK (confidence_percentage >= 0 AND confidence_percentage <= 100);

ALTER TABLE ai_analyses ADD CONSTRAINT check_confidence_range 
    CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100));

ALTER TABLE system_metrics ADD CONSTRAINT check_metric_recorded_time 
    CHECK (recorded_at <= CURRENT_TIMESTAMP);

-- Add foreign key constraints with proper cascading
ALTER TABLE ai_analyses ADD CONSTRAINT fk_ai_analyses_scan_id 
    FOREIGN KEY (scan_id) REFERENCES scans(scan_id) ON DELETE CASCADE;

ALTER TABLE findings ADD CONSTRAINT fk_findings_analysis_id 
    FOREIGN KEY (analysis_id) REFERENCES ai_analyses(analysis_id) ON DELETE CASCADE;

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- Active scans with patient and organization info
CREATE VIEW v_active_scans AS
SELECT 
    s.scan_id,
    s.scan_number,
    s.scan_type,
    s.status,
    s.priority,
    s.acquisition_date,
    p.patient_number,
    p.first_name,
    p.last_name,
    o.name as organization_name,
    u.first_name as technician_first_name,
    u.last_name as technician_last_name
FROM scans s
JOIN patients p ON s.patient_id = p.patient_id
JOIN organizations o ON s.organization_id = o.organization_id
LEFT JOIN users u ON s.technician_id = u.user_id
WHERE s.is_deleted = false;

-- AI analysis results with findings summary
CREATE VIEW v_analysis_summary AS
SELECT 
    a.analysis_id,
    a.scan_id,
    a.status,
    a.confidence_score,
    a.overall_result,
    a.processing_duration_seconds,
    COUNT(f.finding_id) as finding_count,
    MAX(f.severity) as max_severity,
    AVG(f.confidence_percentage) as avg_finding_confidence
FROM ai_analyses a
LEFT JOIN findings f ON a.analysis_id = f.analysis_id
GROUP BY a.analysis_id, a.scan_id, a.status, a.confidence_score, a.overall_result, a.processing_duration_seconds;

-- Queue status overview
CREATE VIEW v_queue_status AS
SELECT 
    sq.queue_type,
    sq.status,
    COUNT(*) as count,
    AVG(sq.priority_score) as avg_priority,
    MIN(sq.queue_entered_at) as oldest_entry
FROM scan_queue sq
GROUP BY sq.queue_type, sq.status;

-- Performance metrics summary
CREATE VIEW v_performance_metrics AS
SELECT 
    DATE(recorded_at) as metric_date,
    metric_type,
    COUNT(*) as measurement_count,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    STDDEV(metric_value) as std_deviation
FROM system_metrics
WHERE recorded_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(recorded_at), metric_type
ORDER BY metric_date DESC, metric_type;

-- =============================================================================
-- COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE organizations IS 'Healthcare institutions using the MedScan AI system';
COMMENT ON TABLE users IS 'Medical professionals and system users with role-based access';
COMMENT ON TABLE patients IS 'Patient demographic and contact information (HIPAA compliant)';
COMMENT ON TABLE scans IS 'Medical imaging studies and associated metadata';
COMMENT ON TABLE ai_analyses IS 'AI processing jobs and results for medical scans';
COMMENT ON TABLE findings IS 'Individual abnormalities and features detected by AI';
COMMENT ON TABLE reports IS 'Radiologist reports and interpretations';
COMMENT ON TABLE scan_queue IS 'Workflow queue for scan processing and review';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit trail for HIPAA compliance';
COMMENT ON TABLE system_metrics IS 'Performance monitoring and analytics data';

-- End of MedScan AI Database Schema