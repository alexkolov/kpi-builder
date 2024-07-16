import { useState } from 'react'
import { TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { type PopulatedKpi } from '@/services/api-service'
import * as Api from '@/services/api-service'
import { Aggregation, Computation } from 'types'

function KpiDialog({
  saveFn,
  isOpen,
  onOpenChange,
  kpi,
  setKpi,
  computaion,
  aggregation,
}) {
  const title = kpi.uuid ? 'Edit KPI' : 'Create KPI'

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
              value={kpi.name}
              pattern="[a-z0-9]{4,20}"
              placeholder="myComputation1"
              className="col-span-3"
              onChange={(event) => setKpi({ ...kpi, name: event.target.value })}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={kpi.description}
              placeholder="My Description"
              className="col-span-3"
              onChange={(event) =>
                setKpi({
                  ...kpi,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="computation" className="text-right">
              Computation
            </Label>
            <Select
              value={kpi.computationId}
              onValueChange={(value: string) => {
                setKpi({ ...kpi, computationId: value })
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="---" />
              </SelectTrigger>
              <SelectContent>
                {computaion.map((computaion: Computation) => (
                  <SelectItem key={computaion.uuid} value={computaion.uuid}>
                    {computaion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="aggregation" className="text-right">
              Aggregation
            </Label>
            <Select
              value={kpi.aggregationId}
              onValueChange={(value: string) => {
                setKpi({ ...kpi, aggregationId: value })
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="---" />
              </SelectTrigger>
              <SelectContent>
                {aggregation.map((aggregation: Aggregation) => (
                  <SelectItem key={aggregation.fn} value={aggregation.fn}>
                    {aggregation.fn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => saveFn()}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function Kpis({ computations, aggregation, kpis, setShouldRefresh }) {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [kpi, setKpi] = useState<PopulatedKpi>(Api.defaultComputation)

  const creatKpi = () => {
    setKpi(Api.defaultPopulatedKpi)
    setIsDialogOpen(true)
  }

  const editKpi = (kpi: PopulatedKpi) => {
    setKpi(kpi)
    setIsDialogOpen(true)
  }

  const saveKpi = async () => {
    const isKpiValid = (kpi: PopulatedKpi): boolean => {
      const _kpi: PopulatedKpi = structuredClone(kpi)
      delete _kpi.computation
      delete _kpi.aggregation
      return Object.values(_kpi).every((el) => !!el)
    }

    if (!isKpiValid(kpi)) {
      toast({
        title: 'Computations is not valid',
        description: 'Please add all values',
      })
    } else {
      setKpi(Api.defaultPopulatedKpi)
      setIsDialogOpen(false)
      await Api.saveKpi(kpi)
      setShouldRefresh((value) => ({
        ...value,
        kpis: true,
        results: true,
      }))
    }
  }

  const removeKpi = async (event: Event, kpi: PopulatedKpi) => {
    event.stopPropagation()
    await Api.removeKpi(kpi)
    setShouldRefresh((value) => ({
      ...value,
      kpis: true,
      results: true,
    }))
  }

  const Row = ({ kpi }: { kpi: PopulatedKpi }) => {
    return (
      <TableRow onClick={() => editKpi(kpi)}>
        <TableCell className="text-left font-bold">{kpi.name}</TableCell>
        <TableCell className="text-left">
          {kpi.computation?.name ?? '---'}
        </TableCell>
        <TableCell className="text-left">{kpi.aggregation.fn}</TableCell>
        <TableCell className="text-left">{kpi.description}</TableCell>
        <TableCell className="text-right">
          <Button
            variant="destructive"
            size={'sm'}
            onClick={(event: Event) => removeKpi(event, kpi)}
          >
            <TrashIcon />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <div className="kpis">
      <KpiDialog
        saveFn={saveKpi}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        kpi={kpi}
        setKpi={setKpi}
        computaion={computations}
        aggregation={aggregation}
      />

      <div className="flex justify-end">
        <Button variant="default" size="sm" onClick={creatKpi}>
          Add KPI
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your KPIs.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Computation</TableHead>
            <TableHead>Aggregation</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {kpis.map((k) => (
            <Row kpi={k} key={k.name} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
