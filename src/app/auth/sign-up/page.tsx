import { auth } from '@/lib/auth'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import { SignUpForm } from './_components/sign-up-form'

const SignupPage = async () => {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!!session) redirect('/')
  return <SignUpForm />
}

export default SignupPage
