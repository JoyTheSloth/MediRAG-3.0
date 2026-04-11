# Health Check Endpoint

<cite>
**Referenced Files in This Document**
- [main.py](file://Backend/src/api/main.py)
- [schemas.py](file://Backend/src/api/schemas.py)
- [config.yaml](file://Backend/config.yaml)
- [warmup.py](file://Backend/scripts/warmup.py)
- [test_api.py](file://Backend/tests/test_api.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Endpoint Definition](#endpoint-definition)
3. [Response Schema](#response-schema)
4. [Implementation Details](#implementation-details)
5. [System Status Monitoring](#system-status-monitoring)
6. [Ollama Availability Checking](#ollama-availability-checking)
7. [Integration Patterns](#integration-patterns)
8. [Practical Examples](#practical-examples)
9. [Client Implementation Guidelines](#client-implementation-guidelines)
10. [Common Use Cases](#common-use-cases)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Conclusion](#conclusion)

## Introduction

The `/health` endpoint is a critical system monitoring component that provides real-time status information about the MediRAG application's operational state. This endpoint serves as a liveness check mechanism that allows external systems to verify the application's availability and monitor its dependency health, particularly focusing on the Ollama AI service integration.

The endpoint follows RESTful conventions by exposing a simple GET method at `/health` that returns structured JSON data containing both application-level status and dependency health indicators. This design enables seamless integration with various monitoring and orchestration platforms while maintaining minimal overhead for health check implementations.

## Endpoint Definition

### HTTP Method and URL Pattern
- **Method**: GET
- **URL**: `/health`
- **HTTP Status**: Always returns 200 OK
- **Response Model**: `HealthResponse`

### Purpose and Behavior
The `/health` endpoint serves as a comprehensive system health indicator that provides two primary pieces of information:
1. **Application Status**: Confirms the API server is running and responsive
2. **Dependency Health**: Reports whether the Ollama AI service is available for LLM operations

The endpoint is designed to never fail with HTTP error codes, ensuring that health monitoring systems can rely on consistent responses regardless of the underlying system state.

**Section sources**
- [main.py:203-218](file://Backend/src/api/main.py#L203-L218)

## Response Schema

### HealthResponse Structure

The `/health` endpoint returns a structured JSON object with the following fields:

| Field Name | Type | Description | Default Value |
|------------|------|-------------|---------------|
| `status` | string | Application status indicator | "ok" |
| `ollama_available` | boolean | Ollama service availability flag | false |
| `version` | string | API version identifier | "0.1.0" |

### Response Validation
The response schema is strictly validated using Pydantic models, ensuring consistent data types and preventing malformed responses. The schema definition includes explicit field validators that enforce data integrity.

### Response Format
```json
{
  "status": "ok",
  "ollama_available": true,
  "version": "0.1.0"
}
```

**Section sources**
- [schemas.py:135-140](file://Backend/src/api/schemas.py#L135-L140)

## Implementation Details

### Core Implementation
The `/health` endpoint is implemented as a FastAPI route decorator that returns a `HealthResponse` model instance. The implementation follows these key design principles:

1. **Always Success**: The endpoint returns HTTP 200 regardless of system state
2. **Consistent Structure**: Response format remains identical across all invocations  
3. **Dependency Awareness**: Integrates with Ollama availability checking logic

### Route Registration
The endpoint is registered with FastAPI using the standard decorator pattern:
```python
@app.get("/health", response_model=HealthResponse, tags=["system"])
```

### Response Construction
The endpoint constructs the response by:
1. Calling the internal `_check_ollama()` function to determine service availability
2. Creating a `HealthResponse` instance with the current status and availability flag
3. Returning the validated response model

**Section sources**
- [main.py:203-218](file://Backend/src/api/main.py#L203-L218)
- [schemas.py:135-140](file://Backend/src/api/schemas.py#L135-L140)

## System Status Monitoring

### Role in Health Monitoring
The `/health` endpoint plays a crucial role in comprehensive system monitoring by providing:

1. **Liveness Verification**: Confirms the API server is operational and responding to requests
2. **Dependency Tracking**: Monitors critical external dependencies (primarily Ollama)
3. **Operational Readiness**: Enables automated systems to determine service availability
4. **Integration Point**: Serves as a standardized interface for monitoring platforms

### Monitoring Scope
The endpoint monitors:
- Application server responsiveness
- Database connectivity and initialization
- Model loading status
- External service availability (Ollama)

### Integration Benefits
- **Zero Configuration**: No special setup required for health monitoring
- **Consistent Format**: Standardized response structure across all environments
- **Reliability**: Never returns error codes, ensuring monitoring systems remain stable

## Ollama Availability Checking

### Availability Detection Mechanism
The Ollama availability check is performed through a targeted HTTP request to the Ollama API:

```python
def _check_ollama() -> bool:
    """Return True if Ollama API is reachable."""
    try:
        resp = requests.get(f"{_ollama_base}/api/tags", timeout=2)
        return resp.status_code == 200
    except Exception:
        return False
```

### Configuration Dependencies
The Ollama check uses the configured base URL from the application configuration:
- **Default URL**: `http://localhost:11434`
- **Configurable**: Can be overridden through the `config.yaml` file
- **Timeout Protection**: 2-second timeout prevents blocking health checks

### Availability Impact
The Ollama availability flag affects downstream system behavior:
- **Available**: Enables full LLM-dependent features
- **Unavailable**: Disables LLM-dependent operations with graceful fallbacks
- **Monitoring**: Allows external systems to track service health

**Section sources**
- [main.py:179-185](file://Backend/src/api/main.py#L179-L185)
- [config.yaml:44-52](file://Backend/config.yaml#L44-L52)

## Integration Patterns

### Deployment Health Checks
The `/health` endpoint integrates seamlessly with various deployment and monitoring systems:

#### Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
```

#### Docker Health Checks
```dockerfile
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

#### Load Balancer Health Checks
External load balancers can use the `/health` endpoint to determine backend server availability and route traffic accordingly.

### Automated Monitoring Systems
The endpoint supports various monitoring approaches:
- **Simple HTTP Checks**: Basic curl/wget commands
- **Advanced Monitoring**: Prometheus, Grafana, or proprietary monitoring solutions
- **CI/CD Pipelines**: Integration testing and deployment verification

**Section sources**
- [warmup.py:27-33](file://Backend/scripts/warmup.py#L27-L33)

## Practical Examples

### Successful Response Example
```json
{
  "status": "ok",
  "ollama_available": true,
  "version": "0.1.0"
}
```

### Error Scenario Response
When Ollama is unavailable:
```json
{
  "status": "ok",
  "ollama_available": false,
  "version": "0.1.0"
}
```

### Client Implementation Examples

#### Python Implementation
```python
import requests

def check_health(api_url):
    try:
        response = requests.get(f"{api_url}/health", timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Health check failed: {e}")
        return None

# Usage
health_data = check_health("http://localhost:8000")
if health_data and health_data["ollama_available"]:
    print("System is healthy and ready")
else:
    print("System may have issues")
```

#### JavaScript Implementation
```javascript
async function checkHealth(baseUrl) {
    try {
        const response = await fetch(`${baseUrl}/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Health check failed:', error);
        return null;
    }
}
```

**Section sources**
- [test_api.py:8-16](file://Backend/tests/test_api.py#L8-L16)
- [warmup.py:27-33](file://Backend/scripts/warmup.py#L27-L33)

## Client Implementation Guidelines

### Best Practices for Health Monitoring

#### Timeout Configuration
- **Recommended**: 5-second timeout for health checks
- **Minimum**: 2-second timeout for Ollama checks
- **Maximum**: 10-second timeout for production environments

#### Retry Logic
Implement exponential backoff for transient failures:
- First retry: 1-2 seconds delay
- Second retry: 3-5 seconds delay  
- Third retry: 10-15 seconds delay

#### Error Handling
- **Network failures**: Treat as temporary issues
- **HTTP errors**: Log but don't trigger immediate alerts
- **Timeouts**: Consider system overloaded rather than failed

#### Monitoring Integration
- **Thresholds**: Alert when `ollama_available` is false for extended periods
- **Trends**: Monitor response time trends and status changes
- **Correlation**: Track health status with other system metrics

### Automated Systems Design
For production monitoring systems:
1. **Multiple Check Points**: Verify both API and Ollama availability
2. **Graceful Degradation**: Continue operation when Ollama is unavailable
3. **Alerting Strategy**: Differentiate between API failures and dependency issues
4. **Logging**: Record health check results for historical analysis

## Common Use Cases

### Kubernetes Readiness Probes
The `/health` endpoint is ideal for Kubernetes readiness probes because:
- **Fast Response**: Sub-100ms response time
- **Consistent Format**: Predictable JSON structure
- **Dependency Awareness**: Ollama status included in response
- **No Side Effects**: Health checks don't modify system state

### Docker Container Health Checks
Docker containers can leverage the endpoint for:
- **Container Lifecycle Management**: Automatic restart on failure
- **Service Discovery**: Dynamic service registration based on health status
- **Load Balancing**: Traffic routing based on health indicators

### Microservice Dependency Verification
In microservice architectures:
- **Service Mesh Integration**: Health endpoint for service mesh monitoring
- **Circuit Breaker Patterns**: Use health status for circuit breaker decisions
- **Cross-Service Dependencies**: Monitor dependent services health

### CI/CD Pipeline Integration
Automated testing and deployment:
- **Pre-deployment Checks**: Verify service health before updates
- **Post-deployment Validation**: Confirm successful deployment
- **Rollback Triggers**: Automatic rollback on health check failures

## Troubleshooting Guide

### Common Issues and Solutions

#### Health Check Always Returns False
**Symptoms**: `ollama_available` is always false
**Causes**:
- Ollama service not running
- Incorrect Ollama base URL configuration
- Network connectivity issues
- Firewall blocking connections

**Solutions**:
1. Verify Ollama service status: `curl http://localhost:11434/api/tags`
2. Check configuration file: `config.yaml` contains correct Ollama URL
3. Test network connectivity between services
4. Review firewall and security group settings

#### Slow Health Check Responses
**Symptoms**: Health checks taking longer than expected
**Causes**:
- Network latency issues
- High system load
- DNS resolution delays
- Proxy configuration problems

**Solutions**:
1. Optimize network configuration
2. Reduce timeout values appropriately
3. Implement connection pooling
4. Use direct IP addresses if DNS is problematic

#### Configuration Issues
**Symptoms**: Health endpoint not returning expected format
**Causes**:
- Missing or malformed configuration files
- Environment variable conflicts
- Permission issues with configuration paths

**Solutions**:
1. Validate configuration file syntax
2. Check file permissions and accessibility
3. Verify environment variable overrides
4. Restart service after configuration changes

### Debugging Tools and Commands

#### Manual Health Check
```bash
# Basic health check
curl -s http://localhost:8000/health

# Verbose health check with timing
curl -w "@{response_time}\n" -o /dev/null -s http://localhost:8000/health

# Health check with custom timeout
curl --max-time 3 http://localhost:8000/health
```

#### Ollama Connectivity Test
```bash
# Test Ollama service directly
curl -s http://localhost:11434/api/tags

# Check Ollama models
curl -s http://localhost:11434/api/tags | jq '.models[].name'
```

**Section sources**
- [main.py:179-185](file://Backend/src/api/main.py#L179-L185)
- [config.yaml:44-52](file://Backend/config.yaml#L44-L52)

## Conclusion

The `/health` endpoint provides a robust foundation for system monitoring and availability checking in the MediRAG application. Its design emphasizes simplicity, reliability, and comprehensive dependency awareness, making it suitable for integration with diverse monitoring and orchestration platforms.

Key benefits of this implementation include:
- **Universal Compatibility**: Works with any HTTP client or monitoring system
- **Dependency Intelligence**: Provides insight into critical service dependencies
- **Operational Reliability**: Never fails with HTTP errors, ensuring monitoring stability
- **Minimal Overhead**: Lightweight implementation with fast response times

The endpoint serves as a critical component in production deployments, enabling automated health monitoring, graceful degradation, and reliable service discovery across various infrastructure environments. Its straightforward integration patterns and comprehensive monitoring capabilities make it an essential tool for maintaining system reliability and operational excellence.