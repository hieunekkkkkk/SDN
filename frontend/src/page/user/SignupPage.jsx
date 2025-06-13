import React from 'react'
import { SignUp } from '@clerk/clerk-react';

function SignupPage() {
  return (
    <div className='signupContainer'>
        <SignUp/>
    </div>
  )
}

export default SignupPage;