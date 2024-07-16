import { useState, useCallback, useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import './App.css'
import type { Aggregation, Computation } from 'types'
import { Results } from './widgets/Results'
import { Kpis } from './widgets/Kpis'
import { Computations } from './widgets/Computations'
import * as Api from '@/services/api-service'

function App() {
  const { toast } = useToast()

  const [shouldRefresh, setShouldRefresh] = useState({
    variables: true,
    computations: true,
    aggregations: true,
    kpis: true,
    results: true,
  })

  const [variables, setVariables] = useState<Variable[]>([])
  const [computations, setComputations] = useState<Computation[]>([])
  const [aggregation, setAggregation] = useState<Aggregation>([])
  const [kpis, setKpis] = useState<PopulatedKpi[]>([])
  const [results, setResults] = useState<Result[]>([])

  const loadVariables = useCallback(async () => {
    const { data, error } = await Api.loadVariables()
    if (data) {
      setVariables(data)
    } else if (error) {
      toast({
        title: 'Error loading variables',
      })
    }
  }, [toast])

  const loadComputations = useCallback(async () => {
    const { data, error } = await Api.loadComputations()
    if (data) {
      setComputations(data)
    } else if (error) {
      toast({
        title: 'Error loading computations',
      })
    }
  }, [toast])

  const loadAggregations = useCallback(async () => {
    const { data, error } = await Api.loadAggregations()
    if (data) {
      setAggregation(data)
    } else if (error) {
      toast({
        title: 'Error loading aggregations',
      })
    }
  }, [toast])

  const loadKpis = useCallback(async () => {
    const { data, error } = await Api.loadKpis()
    if (data) {
      setKpis(data)
    } else if (error) {
      toast({
        title: 'Error loading kpis',
      })
    }
  }, [toast])

  const loadResults = useCallback(async () => {
    const { data, error } = await Api.loadResults()
    if (data) {
      setResults(data)
    } else if (error) {
      toast({
        title: 'Error loading results',
      })
    }
  }, [toast])

  useEffect(() => {
    const map = {
      variables: loadVariables,
      computations: loadComputations,
      aggregations: loadAggregations,
      kpis: loadKpis,
      results: loadResults,
    }

    Object.keys(shouldRefresh)
      .filter((key) => shouldRefresh[key])
      .forEach((key) => {
        setShouldRefresh((value) => ({ ...value, [key]: false }))
        map[key]()
      })
  }, [
    loadVariables,
    loadComputations,
    loadAggregations,
    loadKpis,
    loadResults,
    shouldRefresh,
  ])

  return (
    <>
      <h1 className="text-xl mb-8">KPI Builder</h1>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="computations">Computations</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Results
            results={results}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
        </TabsContent>

        <TabsContent value="kpis">
          <Kpis
            computations={computations}
            aggregation={aggregation}
            kpis={kpis}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
        </TabsContent>

        <TabsContent value="computations">
          <Computations
            computations={computations}
            variables={variables}
            shouldRefresh={shouldRefresh}
            setShouldRefresh={setShouldRefresh}
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </>
  )
}

export default App
