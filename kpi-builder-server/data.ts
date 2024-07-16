import { Computation, Kpi, PopulatedKpi, Variable } from '../types.ts'

export const variables: Variable[] = [
  {
    uuid: '598e6c6e-ad1d-4753-b2fd-71c31e143b3c',
    symbol: 'v1',
    displayName: 'Pressure',
  },
  {
    uuid: 'eda4d68b-e22b-4acb-81f9-a2d78641973e',
    symbol: 'v2',
    displayName: 'Temperature',
  },
  {
    uuid: '9e9d0b42-c6fc-481f-9e70-eeafb96c0f0a',
    symbol: 'v3',
    displayName: 'Energy Consumption',
  },
  {
    uuid: '73e52840-f917-4230-91c3-f12fb2b50144',
    symbol: 'v4',
    displayName: 'Plastic Consumption',
  },
  {
    uuid: '820109c0-dd5c-4c9d-b6de-b3056f5d939e',
    symbol: 'v5',
    displayName: 'Speed',
  },
  {
    uuid: 'dad0048c-fe61-477b-a737-eb0757100480',
    displayName: 'Energy Price',
    symbol: 'c1',
    isConstant: true,
  },
  {
    uuid: '06c0eb5a-5ef6-45e8-a8b8-970c482196b5',
    displayName: 'Plastic Price',
    symbol: 'c2',
    isConstant: true,
  },
]

// Pressure, Temperature, Energy, Plastic, Speed
// Energy Price, Plastic Price
const rawConstants = [3, 20]
const rawTimeseries = [
  [5, 1, 10, 20, 10, ...rawConstants],
  [7, 2, 12, 24, 11, ...rawConstants],
  [7, 3, 12, 25, 11, ...rawConstants],
  [5, 3, 11, 23, 10, ...rawConstants],
  [5, 4, 12, 23, 10, ...rawConstants],
  [8, 4, 16, 28, 13, ...rawConstants],
  [9, 5, 17, 30, 14, ...rawConstants],
  [8, 5, 16, 29, 12, ...rawConstants],
  [10, 6, 28, 31, 16, ...rawConstants],
  [10, 7, 28, 32, 17, ...rawConstants],
]

export const timeseries: Record<string, number>[] = rawTimeseries.map((el) => {
  return [0, 1, 2, 3, 4, 5, 6].reduce((acc, idx) => {
    return { ...acc, [variables[idx].uuid]: el[idx] }
  }, {})
})
