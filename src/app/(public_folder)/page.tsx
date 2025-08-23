import HomeView from './_components/home'
import { Pricing } from './_components/pricing'

export default async function Home() {
  return (
    <div className='flex min-h-dvh items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-8'>
        {/* <h1 className='text-6xl font-bold'>{APP_NAME}</h1>
        <GetStartedButton /> */}
        <HomeView />
        <Pricing />
      </div>
    </div>
  )
}
