# 🚀 Kubernetes Deployment Guide

This guide covers deploying Links2Go to Kubernetes using Helm charts with Redis dependency.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Configuration](#configuration)
- [Production Deployment](#production-deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Scaling](#scaling)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## 🔧 Prerequisites

### Required Tools
- **Kubernetes cluster** (v1.19+)
- **Helm** (v3.8+)
- **kubectl** configured for your cluster
- **Docker** (for building custom images)

### Cluster Requirements
- **Ingress Controller** (NGINX recommended)
- **Cert-Manager** (for TLS certificates)
- **Storage Class** for Redis persistence
- **Prometheus Operator** (optional, for monitoring)

### Minimum Resources
- **3 worker nodes** (for high availability)
- **4 vCPUs** and **8GB RAM** total
- **20GB** persistent storage for Redis

## ⚡ Quick Start

### 1. Add Bitnami Repository
```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 2. Install Dependencies
```bash
cd helm/
helm dependency update
```

### 3. Deploy to Development
```bash
# Create namespace
kubectl create namespace links2go-dev

# Deploy with default values
helm upgrade --install links2go . \
  --namespace links2go-dev \
  --set ingress.hosts[0].host=links2go-dev.example.com \
  --set redis.auth.password=dev-password-123
```

### 4. Verify Deployment
```bash
# Check pods
kubectl get pods -n links2go-dev

# Check services
kubectl get svc -n links2go-dev

# Check ingress
kubectl get ingress -n links2go-dev
```

## 🏗️ Architecture Overview

### Component Structure
```
┌─────────────────┐    ┌─────────────────┐
│   Internet      │    │   Kubernetes    │
│                 │    │   Cluster       │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
    ┌─────▼─────┐          ┌─────▼─────┐
    │ Ingress   │          │ Ingress   │
    │Controller │          │(nginx)    │
    └─────┬─────┘          └─────┬─────┘
          │                      │
    ┌─────▼─────┐          ┌─────▼─────┐
    │ Frontend  │◄─────────┤ Frontend  │
    │(Static)   │          │ Service   │
    └───────────┘          └─────┬─────┘
                                 │
                           ┌─────▼─────┐
                           │ Frontend  │
                           │ Pods      │
                           │(NGINX)    │
                           └───────────┘
                                 │
    ┌───────────┐          ┌─────▼─────┐
    │ Backend   │◄─────────┤ Backend   │
    │(API)      │          │ Service   │
    └─────┬─────┘          └─────┬─────┘
          │                      │
          │                ┌─────▼─────┐
          │                │ Backend   │
          │                │ Pods      │
          │                │(Node.js)  │
          │                └─────┬─────┘
          │                      │
    ┌─────▼─────┐          ┌─────▼─────┐
    │ Redis     │◄─────────┤ Redis     │
    │(Cache)    │          │ Service   │
    └───────────┘          └─────┬─────┘
                                 │
                           ┌─────▼─────┐
                           │ Redis     │
                           │ Master    │
                           │+ Replica  │
                           └───────────┘
```

### Network Flow
1. **User Request** → Ingress Controller
2. **Static Assets** → Frontend Service → NGINX Pods
3. **API Calls** → Backend Service → Node.js Pods
4. **Data Storage** → Redis Service → Redis Master/Replica

## ⚙️ Configuration

### Basic Configuration
```yaml
# values.yaml overrides
frontend:
  replicaCount: 2
  resources:
    requests:
      cpu: 100m
      memory: 128Mi

backend:
  replicaCount: 3
  resources:
    requests:
      cpu: 250m
      memory: 256Mi

ingress:
  enabled: true
  hosts:
    - host: your-domain.com
      paths:
        - path: /api
          pathType: Prefix
          backend: backend
        - path: /
          pathType: Prefix
          backend: frontend

redis:
  auth:
    password: "your-secure-password"
```

### Environment-Specific Values

#### Development (`values-dev.yaml`)
```yaml
frontend:
  replicaCount: 1
backend:
  replicaCount: 1
redis:
  replica:
    replicaCount: 0
  master:
    persistence:
      size: 1Gi
```

#### Staging (`values-staging.yaml`)
```yaml
frontend:
  replicaCount: 2
backend:
  replicaCount: 2
redis:
  replica:
    replicaCount: 1
  master:
    persistence:
      size: 5Gi
```

#### Production (`values-production.yaml`)
See the provided `values-production.yaml` file for comprehensive production settings.

## 🏭 Production Deployment

### 1. Prepare Production Environment
```bash
# Create production namespace
kubectl create namespace links2go-prod

# Create registry secret (if using private registry)
kubectl create secret docker-registry registry-secret \
  --docker-server=your-registry.com \
  --docker-username=your-username \
  --docker-password=your-password \
  --namespace links2go-prod
```

### 2. Build and Push Images
```bash
# Build frontend image
cd frontend/
docker build -t your-registry.com/links2go/frontend:0.7.0 .
docker push your-registry.com/links2go/frontend:0.7.0

# Build backend image
cd ../backend/
docker build -t your-registry.com/links2go/backend:0.7.0 .
docker push your-registry.com/links2go/backend:0.7.0
```

### 3. Deploy to Production
```bash
# Update dependencies
helm dependency update

# Deploy with production values
helm upgrade --install links2go . \
  --namespace links2go-prod \
  --values values-production.yaml \
  --set global.imageRegistry=your-registry.com \
  --set ingress.hosts[0].host=yourdomain.com \
  --set redis.auth.password=STRONG-PRODUCTION-PASSWORD \
  --timeout 10m \
  --wait
```

### 4. Verify Production Deployment
```bash
# Check all pods are running
kubectl get pods -n links2go-prod

# Check ingress and certificates
kubectl get ingress,certificates -n links2go-prod

# Test health endpoints
curl -k https://yourdomain.com/api/health
```

## 📊 Monitoring & Observability

### Prometheus Integration
```yaml
# Enable monitoring
monitoring:
  enabled: true
  serviceMonitor:
    enabled: true
    namespace: monitoring
```

### Available Metrics
- **Application Metrics**: Request duration, error rates, active connections
- **Redis Metrics**: Memory usage, commands processed, keyspace hits
- **System Metrics**: CPU, memory, disk usage per component

### Grafana Dashboards
Import the provided dashboard JSON files:
- `grafana-dashboard-links2go.json` - Application overview
- `grafana-dashboard-redis.json` - Redis monitoring

### Logging
```bash
# View aggregated logs
kubectl logs -f -l app.kubernetes.io/name=links2go -n links2go-prod

# Frontend logs
kubectl logs -f -l app.kubernetes.io/component=frontend -n links2go-prod

# Backend logs  
kubectl logs -f -l app.kubernetes.io/component=backend -n links2go-prod
```

## 📈 Scaling

### Horizontal Pod Autoscaler (HPA)
```yaml
backend:
  autoscaling:
    enabled: true
    minReplicas: 3
    maxReplicas: 20
    targetCPUUtilizationPercentage: 70
```

### Manual Scaling
```bash
# Scale backend
kubectl scale deployment links2go-backend --replicas=10 -n links2go-prod

# Scale frontend
kubectl scale deployment links2go-frontend --replicas=5 -n links2go-prod
```

### Vertical Scaling
```yaml
backend:
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
```

## 🔒 Security

### Network Policies
```yaml
networkPolicy:
  enabled: true
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
```

### Pod Security Standards
```yaml
podSecurityContext:
  fsGroup: 1001
  runAsNonRoot: true
  seccompProfile:
    type: RuntimeDefault

securityContext:
  allowPrivilegeEscalation: false
  capabilities:
    drop: [ALL]
  runAsNonRoot: true
  runAsUser: 1001
```

### Secret Management
```bash
# Use external secret management
kubectl create secret generic links2go-secret \
  --from-literal=redis-password=SECURE-PASSWORD \
  --namespace links2go-prod
```

## 🔧 Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod status
kubectl describe pod <pod-name> -n links2go-prod

# Check resource constraints
kubectl top pods -n links2go-prod
```

#### Ingress Issues
```bash
# Check ingress controller logs
kubectl logs -f -n ingress-nginx deployment/ingress-nginx-controller

# Verify certificates
kubectl describe certificate links2go-tls -n links2go-prod
```

#### Redis Connection Issues
```bash
# Test Redis connectivity
kubectl run redis-test --rm -it --restart=Never \
  --image=redis:7-alpine -n links2go-prod -- \
  redis-cli -h links2go-redis-master -p 6379 ping
```

#### Performance Issues
```bash
# Check resource usage
kubectl top pods -n links2go-prod

# Check HPA status
kubectl get hpa -n links2go-prod

# Check metrics
kubectl get --raw /apis/metrics.k8s.io/v1beta1/namespaces/links2go-prod/pods
```

### Debug Commands
```bash
# Port forward for local debugging
kubectl port-forward service/links2go-frontend 8080:80 -n links2go-prod
kubectl port-forward service/links2go-backend 3001:3001 -n links2go-prod

# Execute in pod
kubectl exec -it deployment/links2go-backend -n links2go-prod -- /bin/sh

# View events
kubectl get events --sort-by=.metadata.creationTimestamp -n links2go-prod
```

## 🛠️ Maintenance

### Updates and Upgrades
```bash
# Update to new version
helm upgrade links2go . \
  --namespace links2go-prod \
  --values values-production.yaml \
  --set backend.image.tag=0.8.0 \
  --set frontend.image.tag=0.8.0
```

### Backup and Recovery
```bash
# Backup Redis data
kubectl exec -it links2go-redis-master-0 -n links2go-prod -- \
  redis-cli --rdb /tmp/backup.rdb

# Copy backup
kubectl cp links2go-prod/links2go-redis-master-0:/tmp/backup.rdb ./redis-backup.rdb
```

### Health Checks
```bash
# Application health
curl https://yourdomain.com/api/health

# Redis health
kubectl exec -it links2go-redis-master-0 -n links2go-prod -- redis-cli ping
```

## 📚 Additional Resources

- [Helm Chart Values Reference](./helm-values-reference.md)
- [Monitoring Setup Guide](./monitoring-setup.md)
- [Security Best Practices](./security-best-practices.md)
- [Troubleshooting Runbook](./troubleshooting-runbook.md)

---

**Need help?** Open an issue at [Links2Go GitHub Issues](https://github.com/malagant/links2go/issues)