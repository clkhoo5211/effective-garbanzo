import { GITHUB_CONFIG } from '@/consts'
import { useAuthStore } from '@/hooks/use-auth'
import { toast } from 'sonner'

const GITHUB_TOKEN_CACHE_KEY = 'github_token'

function getTokenFromCache(): string | null {
	if (typeof sessionStorage === 'undefined') return null
	try {
		return sessionStorage.getItem(GITHUB_TOKEN_CACHE_KEY)
	} catch {
		return null
	}
}

function saveTokenToCache(token: string): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.setItem(GITHUB_TOKEN_CACHE_KEY, token)
	} catch (error) {
		console.error('Failed to save token to cache:', error)
	}
}

function clearTokenCache(): void {
	if (typeof sessionStorage === 'undefined') return
	try {
		sessionStorage.removeItem(GITHUB_TOKEN_CACHE_KEY)
	} catch (error) {
		console.error('Failed to clear token cache:', error)
	}
}

export function clearAllAuthCache(): void {
	clearTokenCache()
}

export function hasAuth(): boolean {
	// For PAT authentication, we check if the PAT is available
	return !!process.env.PERSONAL_ACCESS_TOKEN || !!getTokenFromCache()
}

/**
 * Get GitHub authentication token
 * Uses Personal Access Token (PAT) for authentication
 * @returns GitHub Personal Access Token
 */
export async function getAuthToken(): Promise<string> {
	// 1. First try to get token from cache
	const cachedToken = getTokenFromCache()
	if (cachedToken) {
		toast.info('Using cached token...')
		return cachedToken
	}

	// 2. Use Personal Access Token from environment variables
	const pat = process.env.PERSONAL_ACCESS_TOKEN
	if (pat) {
		toast.info('Using Personal Access Token...')
		saveTokenToCache(pat)
		return pat
	}

	// 3. Fallback to private key authentication (GitHub App)
	const privateKey = useAuthStore.getState().privateKey
	if (!privateKey) {
		throw new Error('No authentication method available. Please set PERSONAL_ACCESS_TOKEN environment variable or use useAuth().setPrivateKey()')
	}

	// Import GitHub App functions only when needed
	const { signAppJwt, getInstallationId, createInstallationToken } = await import('./github-client')

	toast.info('Signing JWT...')
	const jwt = signAppJwt(GITHUB_CONFIG.APP_ID, privateKey)

	toast.info('Getting installation information...')
	const installationId = await getInstallationId(jwt, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO)

	toast.info('Creating installation token...')
	const token = await createInstallationToken(jwt, installationId)

	saveTokenToCache(token)

	return token
}
