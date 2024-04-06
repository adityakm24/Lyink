// next.config.js

module.exports = {
  webpack: (config, { isServer }) => {
    // Use webpack 5 instead of webpack 4
    config.resolve.fallback = { fs: false, module: false };

    return config;
  },
};
