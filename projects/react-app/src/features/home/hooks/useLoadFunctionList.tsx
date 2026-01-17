/* eslint-disable no-extra-boolean-cast */
import { useState, useEffect } from 'react'
import { Constants } from '../../shared/utils/constants'

export default function useLoadFunctionList(): string[] {
  const [functions, setFunctions] = useState([])

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await fetch('../../../../resources/local-app-data/functions.json')
      if (response.ok){
        const data = await response.json()
        setFunctions(data.functionsToApply)
      } else {
        setFunctions(Constants.defaultFunctionlist)
      }
    }
    fetchData()
  }, [])

  return functions.map((stringInArray: string): string => {
    return stringInArray.replace(/\s/g, '')
  })
}
