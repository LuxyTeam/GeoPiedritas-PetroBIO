/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    typescript: {
        // Ignorar errores de tipos durante el desarrollo
        ignoreBuildErrors: false,
    },
}

module.exports = nextConfig