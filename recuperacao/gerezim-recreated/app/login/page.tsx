import React from 'react'
import LoginCarousel from '../../components/auth/LoginCarousel'
import Logo from '../../components/auth/Logo'
import LoginFormFull from '../../components/auth/LoginFormFull'

type Props = { searchParams?: { message?: string } }

export default function LoginPage({ searchParams }: Props) {
  const message = searchParams?.message ?? null

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-navy-500">
      <div className="relative w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-transparent">
        <div className="flex flex-col lg:flex-row w-full min-h-[560px]">
          {/* Left: Carousel */}
          <div className="hidden lg:block lg:w-[65%] bg-navy-800 p-8">
            <LoginCarousel />
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-[35%] bg-[rgba(255,255,255,0.02)] p-8 flex items-center justify-center">
            <div className="w-full">
              <div className="mb-8 flex items-center justify-center">
                <Logo />
              </div>

              <div className="bg-transparent">
                {/* @ts-expect-error Server->Client prop */}
                <LoginFormFull initialMessage={message} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="max-w-3xl mx-auto py-14">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-title">Entrar</h1>
          <p className="text-sm text-slate-500 mt-1">Use suas credenciais para acessar o painel.</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
