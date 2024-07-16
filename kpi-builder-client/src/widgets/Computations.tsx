import { useState } from 'react'
import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import type { Computation } from 'types'
import * as Api from '@/services/api-service'
import { Variables } from '@/widgets/Variables'

function ComputationDialog({
  saveFn,
  isOpen,
  onOpenChange,
  computation,
  setComputation,
  variables,
}) {
  const title = computation.uuid ? 'Edit Computation' : 'Create Computation'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={computation.name}
              pattern="[a-z0-9]{4,20}"
              placeholder="myComputation1"
              className="col-span-3"
              onChange={(event) =>
                setComputation({ ...computation, name: event.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expression" className="text-right">
              Expression
            </Label>
            <Input
              id="expression"
              value={computation.expression}
              placeholder="((v1 + v2) - (v4 - v3) / 3"
              className="col-span-3"
              onChange={(event) =>
                setComputation({
                  ...computation,
                  expression: event.target.value,
                })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={computation.description}
              placeholder="My Description"
              className="col-span-3"
              onChange={(event) =>
                setComputation({
                  ...computation,
                  description: event.target.value,
                })
              }
            />
          </div>
        </div>
        <Variables variables={variables} />
        <DialogFooter>
          <Button onClick={() => saveFn()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Computations({ computations, variables, setShouldRefresh }) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [computation, setComputation] = useState<Computation>(
    Api.defaultComputation
  )

  const createComputation = () => {
    setComputation(Api.defaultComputation)
    setIsDialogOpen(true)
  }

  const editComputation = (computation: Computation) => {
    setComputation(computation)
    setIsDialogOpen(true)
  }

  const saveComputation = async () => {
    const isComputationValid = (computation: Computation): boolean => {
      return Object.values(computation).every((el) => !!el)
    }

    if (!isComputationValid(computation)) {
      toast({
        title: 'Computations is not valid',
        description: 'Please add all values',
      })
    } else {
      setComputation(Api.defaultComputation)
      setIsDialogOpen(false)
      await Api.saveComputation(computation)
      setShouldRefresh((value) => ({
        ...value,
        computations: true,
        kpis: true,
        results: true,
      }))
    }
  }

  const removeComputation = async (event: Event, computation: Computation) => {
    event.stopPropagation()
    await Api.removeComputation(computation)
    setShouldRefresh((value) => ({
      ...value,
      computations: true,
      kpis: true,
      results: true,
    }))
  }

  const Row = ({ computation }: { computation: Computation }) => {
    return (
      <TableRow onClick={() => editComputation(computation)}>
        <TableCell className="text-left font-bold">
          {computation.name}
        </TableCell>
        <TableCell className="text-left">{computation.expression}</TableCell>
        <TableCell className="text-left">{computation.description}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="destructive"
            size={'sm'}
            onClick={(event: Event) => removeComputation(event, computation)}
          >
            <TrashIcon />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="computations">
      <ComputationDialog
        saveFn={saveComputation}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        computation={computation}
        setComputation={setComputation}
        variables={variables}
      />

      <div className="flex justify-end">
        <Button variant="default" size="sm" onClick={createComputation}>
          Add Computation
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your computations.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-2/12">Name</TableHead>
            <TableHead className="w-3/12">Expression</TableHead>
            <TableHead className="w-7/12">Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {computations.map((c) => (
            <Row computation={c} key={c.uuid!} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
