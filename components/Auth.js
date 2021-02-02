import { useAuth } from '../lib/auth';

export default function Auth() {
  const auth = useAuth();

  return (
    <div className="Auth">
      {auth.user ? (
        <>
          <p>{auth.user.email}</p>

          <button type="button" onClick={() => auth.signOut()}>
            Sign out
          </button>
        </>
      ) : (
        <button type="button" onClick={() => auth.signInWithGitHub()}>
          Sign in with GitHub
        </button>
      )}
    </div>
  );
}
