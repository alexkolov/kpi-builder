import { Computation, PopulatedKpi, Variable } from 'types'

const baseUrl = 'http://localhost:8000/'

export async function loadVariables(): Promise<
  { data: Variable[]; error?: never } | { error: unknown; data?: never }
> {
  const url = `${baseUrl}variables`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export const defaultComputation: Computation = {
  name: '',
  expression: '',
  description: '',
}

export async function saveComputation(computation: Computation) {
  const url = computation.uuid
    ? `${baseUrl}computations/${computation.uuid}`
    : `${baseUrl}computations/new`
  const method = computation.uuid ? 'PUT' : 'POST'
  const body = JSON.stringify(computation)
  const request = new Request(url, { method, body })
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function removeComputation(computation: Computation) {
  const url = `${baseUrl}computations/${computation.uuid}`
  const method = 'DELETE'
  const request = new Request(url, { method })
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    return json
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function loadComputations(): Promise<
  { data: Computation[]; error?: never } | { error: unknown; data?: never }
> {
  const url = `${baseUrl}computations`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export const defaultPopulatedKpi: PopulatedKpi = {
  name: '',
  description: '',
  computationId: '',
  aggregationId: '',
  computation: {},
  aggregation: {},
}

export async function loadAggregations(): Promise<
  { data: PopulatedKpi[]; error?: never } | { error: unknown; data?: never }
> {
  const url = `${baseUrl}aggregations`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function loadKpis(): Promise<
  { data: PopulatedKpi[]; error?: never } | { error: unknown; data?: never }
> {
  const url = `${baseUrl}kpis`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function saveKpi(kpi: Populated_Kpi) {
  const _kpi: PopulatedKpi = structuredClone(kpi)
  delete _kpi.computation
  delete _kpi.aggregation
  const url = _kpi.uuid ? `${baseUrl}kpi/${_kpi.uuid}` : `${baseUrl}kpi/new`
  const method = _kpi.uuid ? 'PUT' : 'POST'
  const body = JSON.stringify(_kpi)
  const request = new Request(url, { method, body })
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function removeKpi(kpi: PopulatedKpi) {
  const url = `${baseUrl}kpi/${kpi.uuid}`
  const method = 'DELETE'
  const request = new Request(url, { method })
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    const json = await response.json()
    return json
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}

export async function loadResults(): Promise<
  { data: Result[]; error?: never } | { error: unknown; data?: never }
> {
  const url = `${baseUrl}results`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error.message)
    return { error: error.message }
  }
}
