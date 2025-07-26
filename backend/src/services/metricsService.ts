import promClient from "prom-client";

class MetricsService {
  private readonly register = new promClient.Registry();

  // Counters
  private readonly urlsShortenedTotal = new promClient.Counter({
    name: "urls_shortened_total",
    help: "Total number of URLs shortened",
    labelNames: ["custom_code"],
  });

  private readonly urlRedirectsTotal = new promClient.Counter({
    name: "url_redirects_total", 
    help: "Total number of URL redirections",
    labelNames: ["short_code", "status"],
  });

  private readonly httpRequestsTotal = new promClient.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
  });

  private readonly redisOperationsTotal = new promClient.Counter({
    name: "redis_operations_total",
    help: "Total number of Redis operations",
    labelNames: ["operation", "status"],
  });

  // Histograms
  private readonly requestDurationSeconds = new promClient.Histogram({
    name: "request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
  });

  private readonly redisOperationDurationSeconds = new promClient.Histogram({
    name: "redis_operation_duration_seconds",
    help: "Duration of Redis operations in seconds",
    labelNames: ["operation"],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  });

  // Gauges
  private readonly activeUrlsGauge = new promClient.Gauge({
    name: "active_urls_gauge",
    help: "Current number of active shortened URLs",
  });

  private readonly redisConnectedGauge = new promClient.Gauge({
    name: "redis_connected",
    help: "Redis connection status (1 = connected, 0 = disconnected)",
  });

  constructor() {
    // Register all metrics
    this.register.registerMetric(this.urlsShortenedTotal);
    this.register.registerMetric(this.urlRedirectsTotal);
    this.register.registerMetric(this.httpRequestsTotal);
    this.register.registerMetric(this.redisOperationsTotal);
    this.register.registerMetric(this.requestDurationSeconds);
    this.register.registerMetric(this.redisOperationDurationSeconds);
    this.register.registerMetric(this.activeUrlsGauge);
    this.register.registerMetric(this.redisConnectedGauge);

    // Add default metrics (process, Node.js specific)
    promClient.collectDefaultMetrics({ register: this.register });
  }

  // Counter methods
  incrementUrlsShortened(hasCustomCode: boolean): void {
    this.urlsShortenedTotal.inc({ custom_code: hasCustomCode.toString() });
  }

  incrementUrlRedirects(shortCode: string, status: "success" | "not_found" | "expired"): void {
    this.urlRedirectsTotal.inc({ short_code: shortCode, status });
  }

  incrementHttpRequests(method: string, route: string, statusCode: number): void {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
  }

  incrementRedisOperations(operation: string, status: "success" | "error"): void {
    this.redisOperationsTotal.inc({ operation, status });
  }

  // Histogram methods
  observeRequestDuration(method: string, route: string, statusCode: number, duration: number): void {
    this.requestDurationSeconds.observe(
      { method, route, status_code: statusCode.toString() },
      duration
    );
  }

  observeRedisOperationDuration(operation: string, duration: number): void {
    this.redisOperationDurationSeconds.observe({ operation }, duration);
  }

  // Gauge methods
  setActiveUrls(count: number): void {
    this.activeUrlsGauge.set(count);
  }

  setRedisConnected(connected: boolean): void {
    this.redisConnectedGauge.set(connected ? 1 : 0);
  }

  // Get metrics for /metrics endpoint
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  // Create timer for measuring durations
  startTimer(histogram: promClient.Histogram<string>) {
    return histogram.startTimer();
  }

  // Get individual metrics for testing/debugging
  getRegistry(): promClient.Registry {
    return this.register;
  }
}

export const metricsService = new MetricsService();