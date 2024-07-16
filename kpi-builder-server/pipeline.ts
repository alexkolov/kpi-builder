import { evaluate, mean, median, sum } from 'npm:mathjs'
import {
  PopulatedKpi,
  Result,
  Computation,
  Variable,
  AggregationFn,
} from '../types.ts'
import { timeseries, variables } from './data.ts'

function compute(
  point: Record<string, number>,
  expression: Computation['expression']
) {
  const result = variables.reduce((acc: string, v: Variable) => {
    return acc.replaceAll(v.symbol, String(point[v.uuid]))
  }, expression)
  return evaluate(result)
}

function integration(points: number[], dx = 1) {
  let area = 0
  for (let i = 0; i < points.length - 1; i++) {
    area += ((points[i] + points[i + 1]) / 2) * dx
  }
  return area
}

function aggregate(points: number[], fn: AggregationFn) {
  const fnMap = {
    average: () => mean(...points),
    median: () => median(...points),
    sum: () => sum(...points),
    integration: () => integration(points, 1),
  }
  return fnMap[fn]()
}

export function calculate(kpi: PopulatedKpi): Result {
  const computeResults = timeseries.map((point) =>
    compute(point, kpi.computation!.expression)
  )

  const aggrigationResult = aggregate(computeResults, kpi.aggregation.fn)

  return {
    uuid: crypto.randomUUID(),
    kpiName: kpi.name,
    computationName: kpi.computation!.name,
    aggregationName: kpi.aggregation.fn,
    value: aggrigationResult,
  }
}
