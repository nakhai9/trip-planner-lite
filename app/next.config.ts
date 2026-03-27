const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Tránh Next/Turbopack chọn nhầm workspace (vd. lockfile ở thư mục home)
  turbopack: {
    root: path.join(__dirname),
  },
};

module.exports = nextConfig;
