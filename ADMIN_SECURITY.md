# Admin Panel Security Documentation

## 🔒 Security Enhancements Implemented

### 1. **Audit Logging** ✅
- **What**: Tracks all admin actions with timestamp, IP address, and details
- **Database**: `audit_logs` table stores complete audit trail
- **Tracked Actions**:
  - User status changes (ban/activate)
  - User deletion
  - Cache clearing operations
- **Info Captured**:
  - Admin who performed action
  - Action type and resource affected
  - IP address and user agent
  - Timestamp and status (success/failed)
  - Additional JSON details

**View Audit Logs:**
```
GET /api/admin/audit-logs?limit=50&action=USER_DELETED
```

### 2. **Rate Limiting** ✅
- **User Management**:
  - Status changes: 10 requests/minute
  - User deletion: 5 requests/minute (critical action)
- **Cache Management**:
  - Clear namespace: 10 requests/minute
  - Clear all cache: 3 requests/hour (very restrictive)
- **Protection**: Prevents admin API abuse and brute force attempts

### 3. **HTTPS Enforcement** ✅
- **Development**: HTTP allowed for localhost
- **Production**: HTTPS enforced when `ENVIRONMENT=production`
- **Session Cookies**: `secure` flag enabled in production
- **Implementation**: Automatic based on environment variable

### 4. **Role-Based Access Control (RBAC)** ✅
- **Backend**: All endpoints use `verify_admin()` dependency
- **Frontend**: AdminRoute component blocks non-superusers
- **UI**: Admin links hidden for regular users
- **Token**: JWT includes user role information

### 5. **Self-Protection** ✅
- Admins cannot ban/delete their own account
- Prevents accidental lockouts
- Returns 400 Bad Request with clear error message

## 🛡️ Security Layers

```
┌─────────────────────────────────────────┐
│  Frontend UI Layer                      │
│  - Admin links hidden for non-admins   │
│  - AdminRoute checks is_superuser       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Backend API Layer                      │
│  - verify_admin() on all endpoints     │
│  - Rate limiting per endpoint           │
│  - Audit logging for all actions        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│  Database Layer                          │
│  - is_superuser field validation        │
│  - Audit trail in audit_logs table      │
└─────────────────────────────────────────┘
```

## 📊 Admin Endpoints

| Endpoint | Rate Limit | Audit Logged | Description |
|----------|-----------|--------------|-------------|
| `GET /api/admin/stats` | Default | No | Platform statistics |
| `GET /api/admin/users` | Default | No | List users |
| `PUT /api/admin/users/{id}/status` | 10/min | ✅ Yes | Ban/activate user |
| `DELETE /api/admin/users/{id}` | 5/min | ✅ Yes | Delete user |
| `GET /api/admin/logs` | Default | No | System activity |
| `GET /api/admin/audit-logs` | Default | No | Admin action history |
| `POST /api/admin/cache/clear/{ns}` | 10/min | ✅ Yes | Clear cache namespace |
| `POST /api/admin/cache/clear-all` | 3/hour | ✅ Yes | Clear all cache |

## 🔑 Access Admin Panel

1. **Login as superuser**: `dakshsgt69@gmail.com`
2. **Navigate**: 
   - Sidebar: Click "Admin Panel" 🛡️
   - URL: `/dashboard/admin`
   - Command Palette: `Ctrl+K` → "admin"

## 🚨 Security Checklist for Production

- [x] Audit logging enabled
- [x] Rate limiting on critical endpoints
- [x] HTTPS enforcement (auto in production)
- [x] Role-based access control
- [x] Self-protection against lockouts
- [x] IP and user agent tracking
- [ ] 2FA for admin accounts (future enhancement)
- [ ] Admin session timeout (future enhancement)
- [ ] IP whitelist (optional)

## 📝 Example Audit Log Entry

```json
{
  "id": 1,
  "admin_id": 1,
  "action": "USER_DELETED",
  "resource_type": "user",
  "resource_id": "42",
  "details": "{\"user_email\": \"bad@example.com\"}",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "status": "success",
  "created_at": "2025-12-20T15:30:00Z"
}
```

## 🔍 Monitoring

**View recent admin activity:**
```bash
docker exec -it agri-ai-backend psql -U postgres -d agri_ai -c "SELECT admin_id, action, resource_type, resource_id, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10;"
```

**Check failed actions:**
```sql
SELECT * FROM audit_logs WHERE status = 'failed' ORDER BY created_at DESC;
```

## 🎯 Best Practices

1. **Never share admin credentials**
2. **Review audit logs regularly**
3. **Use strong passwords** (minimum 12 characters)
4. **Enable HTTPS in production** (set `ENVIRONMENT=production`)
5. **Monitor rate limit violations**
6. **Keep only necessary admin accounts**

---

**Status**: ✅ Production-Ready Admin Panel with Enterprise Security
