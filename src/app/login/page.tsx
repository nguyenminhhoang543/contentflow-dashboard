import { login, signup } from "./actions"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const error = params?.error as string;
  const message = params?.message as string;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm bg-card border border-border-subtle rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded bg-accent-amber flex items-center justify-center text-background mb-4">
            <span className="font-black text-2xl">CF</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">ContentFlow</h1>
          <p className="text-sm text-foreground-muted mt-1">Sign in to your client dashboard</p>
        </div>

        {error && (
          <div className="bg-accent-red/10 border border-accent-red text-accent-red px-4 py-3 rounded mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-accent-green/10 border border-accent-green text-accent-green px-4 py-3 rounded mb-6 text-sm font-medium">
            {message}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2.5 px-3 text-foreground focus:outline-none focus:border-accent-amber"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-foreground-muted" htmlFor="password">Password</label>
            </div>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-elevated border border-border-subtle text-sm rounded-md py-2.5 px-3 text-foreground focus:outline-none focus:border-accent-amber"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button 
              formAction={login}
              className="w-full bg-accent-amber hover:bg-accent-amber-light text-background font-medium py-2.5 rounded-md transition-colors"
            >
              Log In
            </button>
            <button 
              formAction={signup}
              className="w-full bg-background border border-border-subtle hover:bg-elevated text-foreground font-medium py-2.5 rounded-md transition-colors"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
