import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Variable } from 'types'

export function Variables({ variables }) {
  const Row = ({ variable }: { variable: Variable }) => {
    return (
      <TableRow>
        <TableCell className="text-left font-bold">{variable.symbol}</TableCell>
        <TableCell className="text-left">
          <Checkbox disabled checked={variable.isConstant} />
        </TableCell>
        <TableCell className="text-left">{variable.displayName}</TableCell>
      </TableRow>
    )
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm">
          Explain Expression Variables
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>{' '}
      <CollapsibleContent>
        <ScrollArea className="h-72 rounded-md border mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Symbol</TableHead>
                <TableHead className="w-[100px]">Constant</TableHead>
                <TableHead>Variable Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {variables.map((v) => (
                <Row variable={v} key={v.uuid} />
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}
