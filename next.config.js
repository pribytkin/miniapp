/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://secrets-gospel-bob-dreams.trycloudflare.com/api/:path*'
            }
        ]
    }
}

module.exports = nextConfig
