import { Hono, Context } from 'hono'
import { cors } from 'hono/cors'
import {
  AggregationFn,
  aggregationsFns,
  type Aggregation,
  type Computation,
  type PopulatedKpi,
} from '../types.ts'
import { variables } from './data.ts'
import * as Db from './db.ts'
import { calculate } from './pipeline.ts'

const db = await Deno.openKv('./main.db')

const app = new Hono()

app.use('*', cors())

app.get('/variables', (context: Context) => {
  return context.json({ data: variables })
})

app.get('/computations', async (context: Context) => {
  const computations: Computation[] = await Db.loadComputations(db)
  return context.json({ data: computations })
})

app.post('/computations/new', async (context: Context) => {
  const body = await context.req.json()
  const computation = Db.createComputation(db, body)
  return context.json({ data: computation })
})

app.put('/computations/:uuid', async (context: Context) => {
  const body = await context.req.json()
  const computation = Db.updateComputation(db, body)
  return context.json({ data: computation })
})

app.delete('/computations/:uuid', async (context: Context) => {
  const uuid = context.req.param('uuid')
  await Db.deleteComputation(db, uuid)
  return context.json({ data: {} })
})

app.get('/aggregations', (context: Context) => {
  const data: Aggregation[] = aggregationsFns.map((fn: AggregationFn) => ({
    fn,
  }))
  return context.json({ data })
})

app.get('/kpis', async (context: Context) => {
  await db.delete(['kpis', '2a05e220-463a-481c-9e7f-47f1610482ca'])
  return context.json({ data: await Db.readPopulatedKpis(db) })
})

app.post('/kpi/new', async (context: Context) => {
  const body = await context.req.json()
  const kpi = Db.createKpi(db, body)
  return context.json({ data: kpi })
})

app.put('/kpi/:uuid', async (context: Context) => {
  const body = await context.req.json()
  const kpi = Db.updateKpi(db, body)
  return context.json({ data: kpi })
})

app.delete('/kpi/:uuid', async (context: Context) => {
  const uuid = context.req.param('uuid')
  await Db.deleteKpi(db, uuid)
  return context.json({ data: {} })
})

app.get('/results', async (context: Context) => {
  const kpis: PopulatedKpi[] = (await Db.readPopulatedKpis(db)).filter(
    (el) => el.computation
  )
  const results = kpis.map(calculate)
  return context.json({ data: results })
})

Deno.serve(app.fetch)
