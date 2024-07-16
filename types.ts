export interface Variable {
  uuid: string
  symbol: string
  displayName: string
  isConstant?: boolean
}

export interface Computation {
  uuid?: string
  name: string
  expression: string
  description: string
}

export const aggregationsFns = [
  'median',
  'average',
  'integration',
  'sum',
] as const

export type AggregationFn = (typeof aggregationsFns)[number]

export interface Aggregation {
  fn: AggregationFn
  description?: string
}

export interface Kpi {
  uuid?: string
  name: string
  description: string
  computationId: Computation['name'] | undefined
  aggregationId: AggregationFn
}

export interface PopulatedKpi extends Kpi {
  computation: Computation | undefined
  aggregation: Aggregation
}

export interface Result {
  uuid: string
  kpiName: string
  computationName: string
  aggregationName: string
  value: number
}
