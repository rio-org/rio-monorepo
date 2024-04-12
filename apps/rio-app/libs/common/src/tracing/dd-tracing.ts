import tracer from 'dd-trace';

// initialized in a different file to avoid hoisting.
tracer.init({
  // https://docs.datadoghq.com/tracing/connect_logs_and_traces/nodejs/
  logInjection: true,
  env: process.env.DD_ENV,
  runtimeMetrics: true,
  profiling: true,
  startupLogs: true,
  clientIpEnabled: true,
  service: process.env.DD_SERVICE,
  dbmPropagationMode: 'full',
});

export default tracer;