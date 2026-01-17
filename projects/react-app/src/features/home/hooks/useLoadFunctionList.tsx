import { useState, useEffect } from "react";

export default function useLoadFunctionList(): string[] {
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const response = await fetch(
        "../../../../resources/local-app-data/functions.json",
      );
      const data = await response.json();
      setFunctions(data.functionsToApply);
    }
    fetchData();
  }, []);

  return functions.map((stringInArray: string): string => {
    return stringInArray.replace(/\s/g, "");
  });
}
