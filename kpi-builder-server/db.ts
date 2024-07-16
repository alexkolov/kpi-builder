import { Computation, Kpi, PopulatedKpi } from '../types.ts'

export async function createComputation(db: Deno.Kv, body: Computation) {
  const uuid = crypto.randomUUID()
  const computation = { ...structuredClone(body), uuid }
  await db.set(['computations', uuid], computation)
  return computation
}

export async function updateComputation(db: Deno.Kv, body: Computation) {
  const uuid: string = body.uuid!
  await db.set(['computations', uuid], body)
}

export async function deleteComputation(db: Deno.Kv, uuid: string) {
  const kpiEntries = db.list<Kpi>({ prefix: ['kpis'] })

  for await (const entry of kpiEntries) {
    if (entry.value.computationId === uuid) {
      const kpiUuid = entry.key[1] as string
      const item = await db.get(['kpis', kpiUuid])
      const newItem = { ...item.value!, computationId: undefined }
      await db.set(['kpis', kpiUuid], newItem)
    }
  }

  return db.delete(['computations', uuid])
}

export async function loadComputations(db: Deno.Kv): Promise<Computation[]> {
  const entries = db.list({ prefix: ['computations'] })
  const computations: Computation[] = []
  for await (const entry of entries) {
    computations.push(entry.value as Computation)
  }
  return computations
}

export async function readKpi(db: Deno.Kv, uuid: string): Promise<Kpi | null> {
  const result = await db.get<Kpi>(['kpis', uuid])
  return result.value
}

export async function readPopulatedKpis(db: Deno.Kv): Promise<PopulatedKpi[]> {
  const entries = db.list<Kpi>({ prefix: ['kpis'] })

  const kpis: PopulatedKpi[] = []
  for await (const entry of entries) {
    let computation
    if (entry.value.computationId) {
      const computationEntry = await db.get<Computation>([
        'computations',
        entry.value.computationId,
      ])
      computation = computationEntry.value ?? undefined
    }

    const kpiUuid = entry.key[1] as string
    const aggregation = { fn: entry.value.aggregationId }
    const kpi = { ...entry.value, uuid: kpiUuid, computation, aggregation }
    kpis.push(kpi)
  }

  return kpis
}

export async function createKpi(db: Deno.Kv, body: Kpi) {
  const uuid = crypto.randomUUID()
  const kpi = { ...structuredClone(body), uuid }
  await db.set(['kpis', uuid], kpi)
  return kpi
}

export async function updateKpi(
  db: Deno.Kv,
  body: Kpi & { computation: unknown; aggregation: unknown }
) {
  const kpi = structuredClone(body)
  delete kpi.computation
  delete kpi.aggregation
  const uuid: string = kpi.uuid!
  await db.set(['kpis', uuid], kpi)
}

export function deleteKpi(db: Deno.Kv, uuid: string) {
  return db.delete(['kpis', uuid])
}
