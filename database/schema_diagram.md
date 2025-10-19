# Database Schema Summary

## Entity Relationship Overview

```mermaid
erDiagram
    ORGANIZATIONS ||--o{ USERS : has
    ORGANIZATIONS ||--o{ PATIENTS : serves
    ORGANIZATIONS ||--o{ SCANS : processes
    
    PATIENTS ||--o{ SCANS : undergoes
    PATIENTS ||--o{ PATIENT_MEDICAL_HISTORY : has
    
    USERS ||--o{ SCANS : performs
    USERS ||--o{ REPORTS : creates
    USERS ||--o{ SCAN_QUEUE : assigned_to
    
    SCANS ||--o{ SCAN_FILES : contains
    SCANS ||--o{ AI_ANALYSES : analyzed_by
    SCANS ||--o{ REPORTS : documented_in
    SCANS ||--o{ SCAN_QUEUE : queued_in
    
    AI_MODELS ||--o{ AI_ANALYSES : executes
    AI_ANALYSES ||--o{ FINDINGS : produces
    AI_ANALYSES ||--o{ REPORTS : supports
    
    ORGANIZATIONS {
        uuid organization_id PK
        string name
        enum type
        string address
        string phone
        enum subscription_plan
        boolean is_active
    }
    
    USERS {
        uuid user_id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        enum role
        string department
        uuid organization_id FK
        string license_number
        boolean is_active
    }
    
    PATIENTS {
        uuid patient_id PK
        string patient_number
        string first_name
        string last_name
        date date_of_birth
        enum gender
        string phone
        string medical_record_number
        uuid organization_id FK
    }
    
    SCANS {
        uuid scan_id PK
        uuid patient_id FK
        string scan_number
        enum scan_type
        string body_part
        string study_description
        uuid technician_id FK
        enum priority
        enum status
        timestamp acquisition_date
        uuid organization_id FK
    }
    
    AI_ANALYSES {
        uuid analysis_id PK
        uuid scan_id FK
        uuid model_id FK
        timestamp processing_start_time
        timestamp processing_end_time
        enum status
        decimal confidence_score
        enum overall_result
        jsonb raw_output
    }
    
    FINDINGS {
        uuid finding_id PK
        uuid analysis_id FK
        string finding_type
        string description
        string location_description
        jsonb coordinates
        decimal confidence_percentage
        enum severity
        boolean is_primary_finding
    }
    
    REPORTS {
        uuid report_id PK
        uuid scan_id FK
        uuid analysis_id FK
        uuid reporting_radiologist_id FK
        enum report_type
        text findings_text
        text impression
        text recommendations
        enum report_status
    }
```

## Key Relationships

### 1. **Multi-Tenant Structure**
- Organizations contain Users, Patients, and Scans
- Data isolation by organization_id
- Supports multiple healthcare institutions

### 2. **Medical Workflow**
```
Patient → Scan → AI Analysis → Findings → Report
```

### 3. **Queue Management**
```
Scan → Queue Entry → Assigned User → Processing → Completion
```

### 4. **AI Processing Pipeline**
```
Scan Files → AI Model → Analysis Job → Findings → Clinical Review
```

## Table Categories

### 🏢 **Organization & Users**
- `organizations` - Healthcare institutions
- `users` - Medical professionals
- `user_sessions` - Authentication tracking
- `user_preferences` - User settings

### 👥 **Patient Care**
- `patients` - Patient demographics
- `patient_medical_history` - Medical background

### 🏥 **Medical Imaging**
- `scans` - Imaging studies
- `scan_files` - DICOM files
- `scan_queue` - Processing workflow

### 🤖 **AI & Analytics**
- `ai_models` - AI model versions
- `ai_analyses` - Processing jobs
- `findings` - Detected abnormalities

### 📋 **Clinical Documentation**
- `reports` - Radiologist interpretations
- `report_templates` - Standardized formats

### 📊 **System Operations**
- `system_metrics` - Performance data
- `audit_logs` - Compliance tracking
- `system_alerts` - Notifications
- `system_settings` - Configuration

### 🔗 **Integration**
- `external_integrations` - PACS/RIS connections
- `sync_logs` - Data synchronization
- `workflow_rules` - Automation rules

## Data Flow Examples

### Typical Scan Processing Flow
1. **Upload**: Scan created in `scans` table
2. **Queue**: Entry added to `scan_queue`
3. **Process**: AI analysis job in `ai_analyses`
4. **Detect**: Findings stored in `findings`
5. **Report**: Radiologist creates `reports`
6. **Audit**: All actions logged in `audit_logs`

### Performance Monitoring
1. **Metrics**: Real-time data in `system_metrics`
2. **Alerts**: Issues flagged in `system_alerts`
3. **Analytics**: Aggregated views for dashboards

### Integration Pipeline
1. **External**: Data received via `external_integrations`
2. **Sync**: Process logged in `sync_logs`
3. **Transform**: Data normalized to schema
4. **Store**: Records created in appropriate tables

## Indexing Strategy

### Primary Indexes
- All primary keys (UUID)
- Foreign key relationships
- Unique constraints (email, patient_number per org)

### Performance Indexes
- `scans(organization_id, status, priority)`
- `ai_analyses(scan_id, status)`
- `findings(analysis_id, severity)`
- `audit_logs(timestamp, user_id)`
- `system_metrics(metric_type, recorded_at)`

### Search Indexes
- `patients(medical_record_number)`
- `scans(scan_number, organization_id)`
- `users(email, organization_id)`

## Security Considerations

### Data Protection
- UUID primary keys prevent enumeration
- Password hashing with bcrypt
- Session management with tokens
- Audit trail for all changes

### HIPAA Compliance
- Patient data encryption at rest
- Access logging and monitoring
- Role-based permissions
- Data retention policies

### Multi-Tenancy
- Organization-based data isolation
- Cross-tenant access prevention
- Shared infrastructure security

## Scalability Features

### Performance
- Efficient indexing for large datasets
- Partitioning capability for time-series data
- Archive strategies for old records

### Growth
- Horizontal scaling support
- Read replicas for analytics
- Caching layer compatibility

### Monitoring
- Real-time metrics collection
- Performance bottleneck detection
- Capacity planning data