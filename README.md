# Lead Management System

## 1. Project Overview

The Lead Management System is a web-based application designed to manage business leads, monitor progress, assign responsibilities, and organize team activities.

The application provides separate dashboards and interfaces for **Admin** and **Team Member** users. Each role has its own workspace and access permissions based on the application's implementation.

## 2. User Roles and Dashboards

### Admin Dashboard

The Admin Dashboard serves as the main management interface for administrators.

Depending on the features implemented in the application, the Admin workspace may include:

- Dashboard overview and lead statistics
- Lead management
- Team member management
- Lead assignment and tracking
- Lead status and follow-up monitoring
- CSV lead import and export
- Access to administrative features and reports

**Admin permissions:** The exact permissions depend on the features and authorization rules implemented in the project.

### Team Member Dashboard

The Team Member Dashboard provides a separate workspace for team members to manage their assigned work.

Depending on the implementation, Team Member features may include:

- Dashboard overview
- Viewing assigned leads
- Accessing lead details
- Updating lead status
- Managing follow-up information
- Adding notes to leads
- Tracking assigned tasks and progress

**Team Member permissions:** Team members should only have access to the actions and data permitted by the application's role-based access rules.

## 3. Role-Based Access Control

The system separates Admin and Team Member experiences.

| Area | Admin | Team Member |
|---|---|---|
| Dashboard | Admin Dashboard | Team Member Dashboard |
| Lead management | According to admin permissions | According to team permissions |
| Lead assignment | If implemented | If permitted |
| CSV import/export | Available on the configured Admin page | Not confirmed |
| Team management | If implemented | Not confirmed |
| Follow-up tracking | According to permissions | According to permissions |

The table describes the intended separation of roles. The exact permissions must be verified against the actual frontend and backend code.

## 4. Lead Management

The Leads section organizes business and contact information.

Lead records may contain:

- Business name
- Contact person
- Phone number
- Email address
- City
- Business category
- Website URL
- Social media URL
- Potential service
- Lead status
- Notes
- Assigned team member
- Follow-up date

The available actions depend on the user's role and the permissions configured in the application.

## 5. CSV Document Import

The Admin Leads page includes a CSV Import feature for importing lead records from a spreadsheet file.

### Import Process

1. Open the Admin Leads page.
2. Select **Import CSV**.
3. Choose a CSV file.
4. The application reads its headers and data rows.
5. Valid records are sent to the backend API.
6. The application reports the import result.

### Supported Fields

The importer is designed to support fields such as `businessName`, `contactPerson`, `phone`, `email`, `city`, `category`, `websiteUrl`, `socialMediaUrl`, `potentialService`, `status`, `notes`, `assignedTo`, and `followUpDate`.

CSV headers must match the names or aliases recognized by the importer.

## 6. CSV Document Export

The Admin Leads page also provides a CSV Export feature.

### Export Process

1. Open the Admin Leads page.
2. Select **Export CSV**.
3. The browser downloads `leads.csv`.
4. Open the file in Excel, Google Sheets, or another compatible spreadsheet application.

The export contains the configured lead fields from the leads available in the frontend Redux state when the export is performed.

## 7. Backend API Integration

The CSV import implementation uses the following endpoint:

`POST /api/admin/leads/add-lead`

The frontend sends lead records using Axios. Authentication and authorization depend on the application's configuration.

The backend is responsible for validating requests and applying the appropriate access rules.

## 8. Technologies Used

- React
- JavaScript
- Axios
- Redux
- Lucide React
- CSS and existing UI components
- Backend API

## 9. Project Structure

Example structure for the separate Leads pages:

```text
src/
└── pages/
    ├── admin/
    │   └── Leads.jsx
    └── team-member/
        └── Leads.jsx
```

The project may contain additional folders for dashboards, components, Redux state, authentication, routing, and API services. Add those folders according to the actual repository structure.

## 10. Security and Permissions

- Authentication should identify the current user.
- Role-based authorization should restrict protected actions.
- Backend endpoints should enforce permissions rather than relying only on frontend visibility.
- Sensitive credentials and tokens should never be committed to the README.

## 11. Testing Checklist

- [ ] Admin can access the correct dashboard.
- [ ] Team Member can access the correct dashboard.
- [ ] Each role sees only its permitted features.
- [ ] Lead operations work according to the assigned permissions.
- [ ] CSV import processes valid records.
- [ ] CSV export downloads the expected lead data.
- [ ] Protected backend endpoints enforce authorization.

## 12. Future Improvements

- Dashboard analytics and charts
- CSV template download
- Import preview and validation
- Duplicate lead detection
- Import progress and detailed error reports
- Lead assignment history
- Advanced filtering and reporting


