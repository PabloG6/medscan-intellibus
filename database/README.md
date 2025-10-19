# MedScan AI Database Schema Documentation

## Overview
This directory contains the complete database schema for the MedScan AI medical productivity system. The schema is designed to support AI-powered medical scan analysis with full HIPAA compliance, audit trails, and enterprise-scale performance.

## Files

### Core Schema
- **`medscan_schema.sql`** - Complete PostgreSQL database schema with all tables, indexes, triggers, and views

### Migration Scripts
- **`migrations/`** - Version-controlled database migration scripts
- **`seeds/`** - Initial data and sample records for development

### Documentation
- **`README.md`** - This documentation file
- **`schema_diagram.md`** - Entity relationship diagrams and table relationships
- **`api_mappings.md`** - How database tables map to API endpoints

## Database Design Principles

### 1. **Multi-Tenant Architecture**
- Organization-based data isolation
- Scalable for multiple healthcare institutions
- Shared infrastructure with tenant separation

### 2. **HIPAA Compliance**
- Comprehensive audit logging
- Patient data encryption capabilities
- Access control and user session tracking
- Data retention and deletion policies

### 3. **Performance Optimization**
- Strategic indexing for common queries
- Optimized for medical imaging workloads
- Queue-based processing architecture
- Efficient data archival strategies

### 4. **AI/ML Integration**
- Flexible model versioning and deployment
- Rich metadata storage for training data
- Performance metrics and accuracy tracking
- Scalable inference result storage

## Table Categories

### 🔐 **Authentication & Access Control**
- `organizations` - Healthcare institutions
- `users` - Medical professionals and system users
- `user_sessions` - Active login sessions
- `user_preferences` - User customization settings

### 👥 **Patient Management**
- `patients` - Patient demographics and contact info
- `patient_medical_history` - Medical background and conditions

### 🏥 **Medical Imaging**
- `scans` - Core imaging studies and metadata
- `scan_files` - Individual DICOM files and series
- `scan_queue` - Processing workflow management

### 🤖 **AI Processing**
- `ai_models` - AI model versions and configurations
- `ai_analyses` - Analysis jobs and processing results
- `findings` - Individual abnormalities detected by AI

### 📋 **Reporting & Documentation**
- `reports` - Radiologist interpretations and findings
- `report_templates` - Standardized reporting templates

### 📊 **Analytics & Monitoring**
- `system_metrics` - Performance and usage statistics
- `audit_logs` - Complete audit trail for compliance
- `system_alerts` - System notifications and warnings

### ⚙️ **Configuration**
- `system_settings` - System and organization configuration
- `workflow_rules` - Automated workflow and business rules

### 🔗 **Integration**
- `external_integrations` - PACS, RIS, EMR connections
- `sync_logs` - Data synchronization history

## Key Features

### 🛡️ **Security & Compliance**
- UUID primary keys for security
- Comprehensive audit trails
- Session management and tracking
- Role-based access control
- Data encryption support

### ⚡ **Performance**
- Optimized indexes for medical workflows
- Efficient queue processing
- Batch operation support
- Archive and cleanup strategies

### 🔄 **Workflow Management**
- Priority-based processing queues
- Automated workflow rules
- SLA tracking and monitoring
- Load balancing across resources

### 📈 **Analytics & Reporting**
- Real-time performance metrics
- AI model accuracy tracking
- Operational dashboards
- Compliance reporting

## Usage Examples

### Common Queries

#### Get pending scans for a radiologist
```sql
SELECT s.scan_number, s.scan_type, p.patient_number, sq.priority_score
FROM scan_queue sq
JOIN scans s ON sq.scan_id = s.scan_id
JOIN patients p ON s.patient_id = p.patient_id
WHERE sq.assigned_to_user_id = $user_id
  AND sq.status = 'assigned'
ORDER BY sq.priority_score DESC, sq.queue_entered_at ASC;
```

#### AI analysis performance by model
```sql
SELECT 
  am.model_name,
  am.model_version,
  COUNT(a.analysis_id) as total_analyses,
  AVG(a.processing_duration_seconds) as avg_processing_time,
  AVG(a.confidence_score) as avg_confidence
FROM ai_analyses a
JOIN ai_models am ON a.model_id = am.model_id
WHERE a.status = 'completed'
  AND a.processing_start_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY am.model_name, am.model_version
ORDER BY avg_confidence DESC;
```

#### Critical findings requiring immediate attention
```sql
SELECT 
  s.scan_number,
  p.patient_number,
  f.finding_type,
  f.confidence_percentage,
  f.description,
  a.processing_end_time
FROM findings f
JOIN ai_analyses a ON f.analysis_id = a.analysis_id
JOIN scans s ON a.scan_id = s.scan_id
JOIN patients p ON s.patient_id = p.patient_id
WHERE f.severity = 'critical'
  AND f.is_confirmed IS NULL
ORDER BY a.processing_end_time DESC;
```

## Development Setup

### Prerequisites
- PostgreSQL 13+ with UUID and JSONB support
- Extensions: `uuid-ossp`, `pgcrypto`

### Installation
1. Create database: `createdb medscan_ai`
2. Run schema: `psql medscan_ai < schemas/medscan_schema.sql`
3. Verify installation: Check that all tables and indexes are created

### Migrations
- Use the migration scripts in `migrations/` directory
- Follow semantic versioning for schema changes
- Always backup before applying migrations in production

## API Integration

The database schema directly supports the MedScan AI REST API with the following patterns:

- **Organizations**: `/api/v1/organizations/{orgId}`
- **Users**: `/api/v1/users/{userId}`
- **Patients**: `/api/v1/patients/{patientId}`
- **Scans**: `/api/v1/scans/{scanId}`
- **Analyses**: `/api/v1/analyses/{analysisId}`
- **Reports**: `/api/v1/reports/{reportId}`

## Maintenance

### Regular Tasks
- **Daily**: Monitor system_alerts and audit_logs
- **Weekly**: Review performance metrics and queue status
- **Monthly**: Archive old scan files and audit logs
- **Quarterly**: Update AI model performance baselines

### Backup Strategy
- **Real-time**: Streaming replication for high availability
- **Daily**: Full database backups with point-in-time recovery
- **Weekly**: Export audit logs for long-term compliance storage

### Monitoring
- Track key metrics: scan processing times, queue lengths, AI accuracy
- Monitor disk usage for scan file storage
- Alert on failed AI analyses or system errors
- Regular security audits of user access patterns

## Contributing

When modifying the schema:
1. Create migration scripts for all changes
2. Update this documentation
3. Test with sample data
4. Consider performance impact on large datasets
5. Ensure HIPAA compliance is maintained

## License

This schema is part of the MedScan AI system. See the main project LICENSE file for details.