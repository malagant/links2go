#!/bin/bash

# Links2Go Deployment Script
# Automates the deployment of Links2Go to Kubernetes using Helm

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HELM_CHART_DIR="$PROJECT_ROOT/helm"

# Default values
NAMESPACE="links2go"
ENVIRONMENT="development"
RELEASE_NAME="links2go"
DOMAIN=""
REDIS_PASSWORD=""
IMAGE_TAG="0.7.0"
REGISTRY=""
VALUES_FILE=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_usage() {
    cat << EOF
Links2Go Deployment Script

Usage: $0 [OPTIONS]

Options:
    -e, --environment ENV       Environment to deploy to (development|staging|production) [default: development]
    -n, --namespace NAMESPACE   Kubernetes namespace [default: links2go]
    -r, --release RELEASE       Helm release name [default: links2go]
    -d, --domain DOMAIN         Domain name for ingress (required for staging/production)
    -p, --redis-password PASS   Redis password (auto-generated if not provided)
    -t, --image-tag TAG         Docker image tag [default: 0.7.0]
    -g, --registry REGISTRY     Docker registry prefix
    -f, --values-file FILE      Additional values file
    -h, --help                  Show this help message

Examples:
    # Development deployment
    $0 --environment development

    # Staging deployment
    $0 --environment staging --domain staging.example.com --redis-password secure123

    # Production deployment
    $0 --environment production \\
       --domain yourdomain.com \\
       --redis-password super-secure-password \\
       --registry your-registry.com \\
       --values-file values-production.yaml

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -n|--namespace)
            NAMESPACE="$2"
            shift 2
            ;;
        -r|--release)
            RELEASE_NAME="$2"
            shift 2
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -p|--redis-password)
            REDIS_PASSWORD="$2"
            shift 2
            ;;
        -t|--image-tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -g|--registry)
            REGISTRY="$2"
            shift 2
            ;;
        -f|--values-file)
            VALUES_FILE="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Validate environment
case $ENVIRONMENT in
    development|staging|production)
        ;;
    *)
        log_error "Invalid environment: $ENVIRONMENT. Must be one of: development, staging, production"
        exit 1
        ;;
esac

# Validate required parameters for non-development environments
if [[ "$ENVIRONMENT" != "development" && -z "$DOMAIN" ]]; then
    log_error "Domain is required for $ENVIRONMENT environment"
    exit 1
fi

# Generate Redis password if not provided
if [[ -z "$REDIS_PASSWORD" ]]; then
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    log_info "Generated Redis password: $REDIS_PASSWORD"
fi

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if kubectl is available and configured
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    
    # Check if helm is available
    if ! command -v helm &> /dev/null; then
        log_error "helm is not installed or not in PATH"
        exit 1
    fi
    
    # Check if we can connect to Kubernetes cluster
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster. Please check your kubectl configuration."
        exit 1
    fi
    
    # Check if helm chart directory exists
    if [[ ! -d "$HELM_CHART_DIR" ]]; then
        log_error "Helm chart directory not found: $HELM_CHART_DIR"
        exit 1
    fi
    
    log_success "All prerequisites met"
}

# Setup namespace
setup_namespace() {
    log_info "Setting up namespace: $NAMESPACE"
    
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        kubectl create namespace "$NAMESPACE"
        log_success "Created namespace: $NAMESPACE"
    else
        log_info "Namespace $NAMESPACE already exists"
    fi
}

# Update Helm dependencies
update_dependencies() {
    log_info "Updating Helm dependencies..."
    
    cd "$HELM_CHART_DIR"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo update
    helm dependency update
    
    log_success "Helm dependencies updated"
}

# Build Helm install/upgrade command
build_helm_command() {
    local cmd="helm upgrade --install $RELEASE_NAME $HELM_CHART_DIR"
    cmd="$cmd --namespace $NAMESPACE"
    cmd="$cmd --set redis.auth.password=$REDIS_PASSWORD"
    cmd="$cmd --set backend.image.tag=$IMAGE_TAG"
    cmd="$cmd --set frontend.image.tag=$IMAGE_TAG"
    
    # Add registry if provided
    if [[ -n "$REGISTRY" ]]; then
        cmd="$cmd --set global.imageRegistry=$REGISTRY"
    fi
    
    # Add domain configuration
    if [[ -n "$DOMAIN" ]]; then
        cmd="$cmd --set ingress.hosts[0].host=$DOMAIN"
        cmd="$cmd --set ingress.tls[0].hosts[0]=$DOMAIN"
        cmd="$cmd --set ingress.tls[0].secretName=${RELEASE_NAME}-tls"
    fi
    
    # Add environment-specific values file
    local env_values_file="$HELM_CHART_DIR/values-$ENVIRONMENT.yaml"
    if [[ -f "$env_values_file" ]]; then
        cmd="$cmd --values $env_values_file"
    fi
    
    # Add custom values file if provided
    if [[ -n "$VALUES_FILE" && -f "$VALUES_FILE" ]]; then
        cmd="$cmd --values $VALUES_FILE"
    fi
    
    # Add deployment options
    cmd="$cmd --timeout 10m --wait"
    
    echo "$cmd"
}

# Deploy application
deploy_application() {
    log_info "Deploying Links2Go to $ENVIRONMENT environment..."
    
    local helm_cmd
    helm_cmd=$(build_helm_command)
    
    log_info "Executing: $helm_cmd"
    
    if eval "$helm_cmd"; then
        log_success "Deployment completed successfully"
    else
        log_error "Deployment failed"
        exit 1
    fi
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Wait for pods to be ready
    log_info "Waiting for pods to be ready..."
    kubectl wait --for=condition=ready pod \
        -l app.kubernetes.io/instance="$RELEASE_NAME" \
        -n "$NAMESPACE" \
        --timeout=300s
    
    # Check pod status
    log_info "Pod status:"
    kubectl get pods -n "$NAMESPACE" -l app.kubernetes.io/instance="$RELEASE_NAME"
    
    # Check services
    log_info "Service status:"
    kubectl get svc -n "$NAMESPACE" -l app.kubernetes.io/instance="$RELEASE_NAME"
    
    # Check ingress if enabled
    if [[ -n "$DOMAIN" ]]; then
        log_info "Ingress status:"
        kubectl get ingress -n "$NAMESPACE" -l app.kubernetes.io/instance="$RELEASE_NAME"
    fi
    
    # Test health endpoint
    if [[ -n "$DOMAIN" ]]; then
        log_info "Testing health endpoint..."
        local health_url="https://$DOMAIN/api/health"
        if curl -s -k "$health_url" | grep -q "ok"; then
            log_success "Health check passed: $health_url"
        else
            log_warning "Health check failed or not accessible yet: $health_url"
        fi
    fi
    
    log_success "Deployment verification completed"
}

# Show deployment information
show_deployment_info() {
    log_success "Links2Go deployed successfully!"
    echo
    echo "Deployment Details:"
    echo "  Environment: $ENVIRONMENT"
    echo "  Namespace: $NAMESPACE"
    echo "  Release: $RELEASE_NAME"
    echo "  Image Tag: $IMAGE_TAG"
    
    if [[ -n "$DOMAIN" ]]; then
        echo "  Domain: $DOMAIN"
        echo "  Frontend: https://$DOMAIN"
        echo "  API Health: https://$DOMAIN/api/health"
        echo "  Metrics: https://$DOMAIN/api/metrics"
    else
        echo "  Access via port-forward:"
        echo "    kubectl port-forward -n $NAMESPACE svc/$RELEASE_NAME-frontend 8080:80"
        echo "    kubectl port-forward -n $NAMESPACE svc/$RELEASE_NAME-backend 3001:3001"
    fi
    
    echo
    echo "Useful Commands:"
    echo "  # View pods"
    echo "  kubectl get pods -n $NAMESPACE"
    echo
    echo "  # View logs"
    echo "  kubectl logs -f -l app.kubernetes.io/component=backend -n $NAMESPACE"
    echo "  kubectl logs -f -l app.kubernetes.io/component=frontend -n $NAMESPACE"
    echo
    echo "  # Scale deployment"
    echo "  kubectl scale deployment $RELEASE_NAME-backend --replicas=5 -n $NAMESPACE"
    echo
    echo "  # Uninstall"
    echo "  helm uninstall $RELEASE_NAME -n $NAMESPACE"
}

# Main execution
main() {
    log_info "Starting Links2Go deployment..."
    log_info "Environment: $ENVIRONMENT"
    log_info "Namespace: $NAMESPACE"
    log_info "Release: $RELEASE_NAME"
    
    check_prerequisites
    setup_namespace
    update_dependencies
    deploy_application
    verify_deployment
    show_deployment_info
    
    log_success "Deployment script completed!"
}

# Execute main function
main "$@"