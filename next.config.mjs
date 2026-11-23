/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@xenova/transformers", "onnxruntime-node"],
  // onnxruntime_binding.node loads libonnxruntime.so at runtime (dlopen), so Next's
  // file tracer cannot see it. Force-include the Linux native files in the
  // serverless bundle, otherwise production fails with
  // "libonnxruntime.so.1.14.0: cannot open shared object file".
  outputFileTracingIncludes: {
    "/**": ["./node_modules/onnxruntime-node/bin/napi-v3/linux/x64/**"],
  },
  // Drop the macOS/Windows binaries (~63MB) - they are never used on Vercel (Linux).
  outputFileTracingExcludes: {
    "/**": [
      "./node_modules/onnxruntime-node/bin/napi-v3/darwin/**",
      "./node_modules/onnxruntime-node/bin/napi-v3/win32/**",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
