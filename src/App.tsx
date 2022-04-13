import React, { useEffect, useState } from 'react';
import './App.css';
import Autocomplete from './components/Autocomplete';

type ApiItemResult = {
  name: string
}

function App() {

  const [pokemonList, setPokemonList] = useState<ApiItemResult[]>([]);

  // The ideal should be that the API could provide a search with a query string
  // But, since there is no such endpoint, we will load the pokemon list and search among them
  useEffect(() => {
    const getPokemonList = async () => {
      const apiResults = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then(res => res.json());
      setPokemonList(apiResults.results.sort((i1: ApiItemResult, i2: ApiItemResult) => i1.name.localeCompare(i2.name)))
    }

    getPokemonList();
  }, []);

  return (
    <div className="main">
      <h1>Welcome to the Pokemon Search!</h1>
      <h3>Type to search among the 151 original pokemon</h3>
      <br/>
      <Autocomplete
        // If our API searched by the query string, this method should call the api with the query.
        loadOptions={(query: string) => Promise.resolve(
          pokemonList
            .filter((item: ApiItemResult) => item.name.toUpperCase().includes(query.toUpperCase()))
            // Since pokeapi doesn't return some identifier, let's use the name as Id.
            .map((item: ApiItemResult) => ({
              id: item.name,
              label: item.name.toUpperCase()
            }))
          )}
      />
    </div>
  );
}

export default App;
