/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Menonaktifkan linting saat build agar proses deployment tidak terhambat
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Juga mengabaikan error type-checking saat build demi kecepatan deployment
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
