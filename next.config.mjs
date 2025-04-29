/** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',  // Adjusted port to match your API server
                pathname: '/api/media/**',  // Matches your image path
            },
        ]
    },

    typescript: {
        // Set to true to allow production builds to complete despite type errors
        ignoreBuildErrors: true,
      },

}


export default nextConfig
