import type { NextPage } from 'next';
import { useRouter } from 'next/router'; // Import the useRouter hook
import { GoogleLoginButton } from 'react-social-login-buttons';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const Admin: NextPage = () => {
  const router = useRouter(); // Initialize the router

  const handleSignIn = async () => {
    try {
      await signInWithPopup(getAuth(), new GoogleAuthProvider());
      router.back(); // Navigate back to the previous page
    } catch (error) {
      console.error('Error during sign-in:', error);
      // You can also display an error message to the user here
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-3">
      <GoogleLoginButton onClick={handleSignIn} />
    </div>
  );
};

export default Admin;
