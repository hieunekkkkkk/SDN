import React from 'react'
import { SignIn } from '@clerk/clerk-react';


function LoginPage() {
  return (
    <div className='loginContainer'>
        <SignIn/>
    </div>
  )
}

export default LoginPage;