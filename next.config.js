/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/ws-stomp',
                destination: 'http://localhost:8080/ws-stomp'
            },
            {
                source: '/ws-stomp/:path*',
                destination: 'http://localhost:8080/ws-stomp/:path*'
            }
        ]
    }
}

module.exports = nextConfig
