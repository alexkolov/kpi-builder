import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Result } from 'types'

export function Results({ results }) {
  const Row = ({ result }: { result: Result }) => {
    const value = new Intl.NumberFormat('en', {
      maximumFractionDigits: 2,
    }).format(result.value)

    return (
      <TableRow>
        <TableCell className="text-left font-bold">{result.kpiName}</TableCell>
        <TableCell className="text-left">{result.computationName}</TableCell>
        <TableCell className="text-left">{result.aggregationName}</TableCell>
        <TableCell className="text-left">{value}</TableCell>
      </TableRow>
    )
  }

  return (
    <div className="results">
      <div className="h-10"></div>

      <Table>
        <TableCaption>A list of your results.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-4/12">KPI</TableHead>
            <TableHead className="w-3/12">Computation</TableHead>
            <TableHead className="w-3/12">Aggregation</TableHead>
            <TableHead className="w-2/12">Value</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {results.map((r) => (
            <Row result={r} key={r.uuid} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
