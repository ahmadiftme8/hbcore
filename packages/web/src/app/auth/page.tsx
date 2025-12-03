import { GoogleSignInButton } from '@/components/Auth/GoogleSignInButton';
import './auth.css';

export default function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">Sign In</h1>
        <p className="auth-page__description">Sign in to your account to continue</p>
        <div className="auth-page__actions">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
