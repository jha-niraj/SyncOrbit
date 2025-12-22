import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb'
		}
	}
};

export default nextConfig;