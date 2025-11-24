import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=100").then((response) => response.json()).then((data) => {
      setPokemons(data.results)
    }).catch((error) => console.log(error));
  }, []);

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}><Text>{pokemon.name}</Text></View>
      ))}
    </ScrollView>
  );
}
