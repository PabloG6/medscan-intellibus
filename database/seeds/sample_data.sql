-- MedScan AI Database Seed Data
-- Purpose: Insert sample data for development and testing
-- Created: 2025-10-19

BEGIN;

-- Insert sample organizations
INSERT INTO organizations (organization_id, name, type, address, phone, license_number, subscription_plan) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'General Hospital Medical Center', 'hospital', '123 Medical Drive, Boston, MA 02115', '+1-617-555-0001', 'MA-HOSP-001', 'enterprise'),
('550e8400-e29b-41d4-a716-446655440002', 'Downtown Imaging Center', 'imaging_center', '456 Radiology Ave, San Francisco, CA 94102', '+1-415-555-0002', 'CA-IMG-002', 'professional'),
('550e8400-e29b-41d4-a716-446655440003', 'University Research Hospital', 'research', '789 Research Blvd, Seattle, WA 98101', '+1-206-555-0003', 'WA-RES-003', 'enterprise'),
('550e8400-e29b-41d4-a716-446655440004', 'Community Health Clinic', 'clinic', '321 Community St, Austin, TX 78701', '+1-512-555-0004', 'TX-CLINIC-004', 'basic');

-- Insert sample users
INSERT INTO users (user_id, email, password_hash, first_name, last_name, role, department, organization_id, license_number) VALUES
-- General Hospital Medical Center users
('660e8400-e29b-41d4-a716-446655440001', 'admin@gmail.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Dr. Admin', 'Administrator', 'administrator', 'Administration', '550e8400-e29b-41d4-a716-446655440001', 'ADMIN-001'),
('660e8400-e29b-41d4-a716-446655440002', 'demo@medscan.ai', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Dr. Sarah', 'Johnson', 'radiologist', 'Radiology', '550e8400-e29b-41d4-a716-446655440001', 'RAD-12345'),
('660e8400-e29b-41d4-a716-446655440003', 'dr.chen@generalhospital.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Dr. Michael', 'Chen', 'radiologist', 'Radiology', '550e8400-e29b-41d4-a716-446655440001', 'RAD-12346'),
('660e8400-e29b-41d4-a716-446655440004', 'dr.williams@generalhospital.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Dr. Emily', 'Williams', 'physician', 'Emergency Medicine', '550e8400-e29b-41d4-a716-446655440001', 'EM-78901'),
('660e8400-e29b-41d4-a716-446655440005', 'tech.davis@generalhospital.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Robert', 'Davis', 'technician', 'Radiology', '550e8400-e29b-41d4-a716-446655440001', 'TECH-55501'),

-- Downtown Imaging Center users
('660e8400-e29b-41d4-a716-446655440006', 'dr.garcia@downtownimaging.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Dr. Maria', 'Garcia', 'radiologist', 'Diagnostic Imaging', '550e8400-e29b-41d4-a716-446655440002', 'RAD-22201'),
('660e8400-e29b-41d4-a716-446655440007', 'admin@downtownimaging.com', '$2b$10$rOPHe.D7o3t0LXBNBLtgKeJ8tAOW8fh9OcGVN8UqUEJQgbUOj.A2K', 'Jennifer', 'Martinez', 'administrator', 'Administration', '550e8400-e29b-41d4-a716-446655440002', 'ADMIN-002');

-- Insert AI models
INSERT INTO ai_models (model_id, model_name, model_version, model_type, supported_scan_types, accuracy_rate, sensitivity, specificity, deployment_date, training_dataset_size) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'ChestXRay-Pneumonia-Detector', 'v2.1.0', 'classification', ARRAY['xray'], 94.50, 92.30, 96.70, '2025-09-15', 150000),
('770e8400-e29b-41d4-a716-446655440002', 'CT-Brain-Hemorrhage-Detector', 'v1.8.3', 'detection', ARRAY['ct'], 97.20, 95.80, 98.60, '2025-08-20', 75000),
('770e8400-e29b-41d4-a716-446655440003', 'MRI-Brain-Tumor-Segmentation', 'v3.0.1', 'segmentation', ARRAY['mri'], 91.40, 89.20, 93.60, '2025-10-01', 45000),
('770e8400-e29b-41d4-a716-446655440004', 'Multi-Modal-Lung-Analyzer', 'v1.5.2', 'hybrid', ARRAY['xray', 'ct'], 93.80, 91.50, 96.10, '2025-09-30', 200000);

-- Insert sample patients
INSERT INTO patients (patient_id, patient_number, first_name, last_name, date_of_birth, gender, phone, medical_record_number, organization_id) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'P12847', 'John', 'Smith', '1975-06-15', 'male', '+1-617-555-1001', 'MRN-001234', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'P12848', 'Mary', 'Johnson', '1982-03-22', 'female', '+1-617-555-1002', 'MRN-001235', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'P12849', 'Robert', 'Williams', '1968-11-08', 'male', '+1-617-555-1003', 'MRN-001236', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440004', 'P12850', 'Linda', 'Brown', '1990-09-14', 'female', '+1-617-555-1004', 'MRN-001237', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440005', 'P12851', 'David', 'Davis', '1955-01-30', 'male', '+1-617-555-1005', 'MRN-001238', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample scans
INSERT INTO scans (scan_id, patient_id, scan_number, scan_type, body_part, study_description, referring_physician, technician_id, department, modality, priority, status, acquisition_date, organization_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'SC-2025-001', 'xray', 'Chest', 'Chest X-Ray PA and Lateral', 'Dr. Williams', '660e8400-e29b-41d4-a716-446655440005', 'Emergency Medicine', 'CR', 'urgent', 'completed', '2025-10-19 08:30:00+00', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'SC-2025-002', 'ct', 'Brain', 'CT Head without contrast', 'Dr. Martinez', '660e8400-e29b-41d4-a716-446655440005', 'Emergency Medicine', 'CT', 'emergency', 'completed', '2025-10-19 09:15:00+00', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'SC-2025-003', 'mri', 'Brain', 'MRI Brain with and without contrast', 'Dr. Patel', '660e8400-e29b-41d4-a716-446655440005', 'Neurology', 'MR', 'routine', 'in_progress', '2025-10-19 10:00:00+00', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'SC-2025-004', 'xray', 'Spine', 'Lumbar Spine X-Ray', 'Dr. Orthopedic', '660e8400-e29b-41d4-a716-446655440005', 'Orthopedics', 'CR', 'routine', 'completed', '2025-10-19 11:30:00+00', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 'SC-2025-005', 'ct', 'Chest', 'CT Chest with contrast', 'Dr. Pulmonologist', '660e8400-e29b-41d4-a716-446655440005', 'Pulmonology', 'CT', 'urgent', 'scheduled', '2025-10-19 14:00:00+00', '550e8400-e29b-41d4-a716-446655440001');

-- Insert sample AI analyses
INSERT INTO ai_analyses (analysis_id, scan_id, model_id, analysis_type, processing_start_time, processing_end_time, processing_duration_seconds, status, confidence_score, overall_result, priority_score) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'Pneumonia Detection', '2025-10-19 08:32:00+00', '2025-10-19 08:32:45+00', 45, 'completed', 92.50, 'abnormal', 8),
('aa0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'Brain Hemorrhage Detection', '2025-10-19 09:17:00+00', '2025-10-19 09:18:30+00', 90, 'completed', 78.30, 'abnormal', 6),
('aa0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'Spine Analysis', '2025-10-19 11:35:00+00', '2025-10-19 11:35:30+00', 30, 'completed', 85.20, 'normal', 2);

-- Insert sample findings
INSERT INTO findings (finding_id, analysis_id, finding_type, finding_category, description, location_description, confidence_percentage, severity, is_primary_finding) VALUES
('ff0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'Possible Pneumonia', 'pathology', 'Opacity detected in left lower lobe consistent with pneumonia. Recommend immediate clinical correlation and treatment consideration.', 'Left lung, lower lobe', 92.50, 'high', true),
('ff0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', 'Suspicious Nodule', 'pathology', 'Small nodular opacity in right middle lobe. Recommend follow-up imaging or further investigation as clinically indicated.', 'Right lung, middle lobe', 78.30, 'medium', false),
('ff0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440002', 'Possible Hemorrhage', 'pathology', 'Small hyperdense area in right frontal region suggestive of acute hemorrhage. Requires immediate clinical attention.', 'Right frontal lobe', 78.30, 'critical', true);

-- Insert sample queue entries
INSERT INTO scan_queue (queue_id, scan_id, queue_type, queue_position, priority_score, assigned_to_user_id, status, estimated_processing_time, queue_entered_at) VALUES
('qq0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440003', 'analysis', 1, 5, '660e8400-e29b-41d4-a716-446655440002', 'assigned', 180, '2025-10-19 10:02:00+00'),
('qq0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440005', 'analysis', 2, 8, null, 'pending', 120, '2025-10-19 13:45:00+00');

-- Insert sample reports
INSERT INTO reports (report_id, scan_id, analysis_id, reporting_radiologist_id, report_type, findings_text, impression, recommendations, report_status, dictated_at) VALUES
('rr0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'preliminary', 
'PA and lateral chest radiographs demonstrate opacity in the left lower lobe consistent with pneumonia. There is also a small nodular opacity in the right middle lobe that requires follow-up.', 
'1. Left lower lobe pneumonia. 2. Right middle lobe nodule requiring follow-up.', 
'Immediate antibiotic therapy for pneumonia. Follow-up chest CT in 6-8 weeks to evaluate right middle lobe nodule.', 
'finalized', '2025-10-19 09:00:00+00');

-- Insert system settings
INSERT INTO system_settings (setting_id, organization_id, setting_category, setting_key, setting_value, setting_type, description) VALUES
('ss0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'ai_processing', 'auto_analysis_enabled', 'true', 'boolean', 'Enable automatic AI analysis for new scans'),
('ss0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'ai_processing', 'confidence_threshold', '75.0', 'decimal', 'Minimum confidence threshold for flagging findings'),
('ss0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'workflow', 'max_queue_size', '100', 'integer', 'Maximum number of scans in processing queue'),
('ss0e8400-e29b-41d4-a716-446655440004', null, 'system', 'session_timeout_minutes', '480', 'integer', 'User session timeout in minutes');

-- Insert sample metrics for demonstration
INSERT INTO system_metrics (metric_id, metric_type, metric_name, metric_value, metric_unit, organization_id, recorded_at) VALUES
('mm0e8400-e29b-41d4-a716-446655440001', 'processing_time', 'avg_ai_analysis_time', 45.5, 'seconds', '550e8400-e29b-41d4-a716-446655440001', '2025-10-19 12:00:00+00'),
('mm0e8400-e29b-41d4-a716-446655440002', 'accuracy_rate', 'pneumonia_detection_accuracy', 94.5, 'percentage', '550e8400-e29b-41d4-a716-446655440001', '2025-10-19 12:00:00+00'),
('mm0e8400-e29b-41d4-a716-446655440003', 'throughput', 'scans_per_hour', 12.3, 'count', '550e8400-e29b-41d4-a716-446655440001', '2025-10-19 12:00:00+00');

COMMIT;

-- Verification queries
SELECT 'Organizations created: ' || COUNT(*) FROM organizations;
SELECT 'Users created: ' || COUNT(*) FROM users;
SELECT 'Patients created: ' || COUNT(*) FROM patients;
SELECT 'Scans created: ' || COUNT(*) FROM scans;
SELECT 'AI Models created: ' || COUNT(*) FROM ai_models;
SELECT 'AI Analyses created: ' || COUNT(*) FROM ai_analyses;
SELECT 'Findings created: ' || COUNT(*) FROM findings;

-- Sample query to verify relationships work correctly
SELECT 
    o.name as organization,
    p.patient_number,
    s.scan_number,
    s.scan_type,
    aa.overall_result,
    f.finding_type,
    f.confidence_percentage
FROM organizations o
JOIN patients p ON o.organization_id = p.organization_id
JOIN scans s ON p.patient_id = s.patient_id
JOIN ai_analyses aa ON s.scan_id = aa.scan_id
JOIN findings f ON aa.analysis_id = f.analysis_id
WHERE o.name = 'General Hospital Medical Center'
ORDER BY s.acquisition_date DESC;