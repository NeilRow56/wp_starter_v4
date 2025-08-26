import { CreateClientButton } from '@/components/clients/create-client-button'
import { PageHeader } from '@/components/page-header'

import React from 'react'

export default async function ClientPage() {
  // const clients = await getAllClients()
  return (
    <div className='container my-6'>
      <PageHeader title='Clients'>
        <CreateClientButton />
      </PageHeader>
      CLIENT TABLE
      {/* <ClientTable clients={clients} /> */}
    </div>
  )
}
