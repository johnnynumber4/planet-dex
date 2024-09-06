import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from '@mui/material';

function AuthButton() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          {/* <p>Signed in as {session.user.name}</p> */}
          <Button variant="contained" onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <Button variant="contained" onClick={() => signIn("discord")}>
          Sign in with Discord
        </Button>
      )}
    </div>
  );
}

export default AuthButton;
