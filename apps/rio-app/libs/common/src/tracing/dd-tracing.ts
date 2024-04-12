import tracer from 'dd-trace';

// initialized in a different file to avoid hoisting.
tracer.init({
  // https://docs.datadoghq.com/tracing/connect_logs_and_traces/nodejs/
  logInjection: true,
  env: process.env.ENV,
  runtimeMetrics: true,
  profiling: true,
  reportHostname: true,
});
export default tracer;
