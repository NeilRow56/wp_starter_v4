import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export async function ClientTable() {
  return (
    <Table>
      <TableCaption className='text-xl font-bold'>
        A list of your clients.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Fee Earner</TableHead>
          <TableHead>Entity Type</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  )
}
