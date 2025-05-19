// Login.tsx
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // ユーザー情報は onAuthStateChanged で取得済み
    } catch (e) {
      alert("ログイン失敗：" + (e as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-xl font-bold">Google ログイン</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Google アカウントでログイン
      </button>
    </div>
  );
};

export default Login;
