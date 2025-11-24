import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: { front_default: string };
  height: number;
  weight: number;
  types: { type: { name: string } }[];
}

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=100").then((response) => response.json()).then(async (data) => {
      const detailedPokemons: PokemonDetails[] = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );
      setPokemons(detailedPokemons);
    }).catch((error) => console.log(error));
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
      {pokemons.map((pokemon) => (
        <View
          key={pokemon.id}
          style={{
            backgroundColor: "#f2f2f2",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Pokémon Image */}
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={{ width: 80, height: 80, marginRight: 16 }}
          />

          {/* Pokémon Info */}
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold", textTransform: "capitalize" }}>
              {pokemon.name}
            </Text>
            <Text>Height: {pokemon.height}</Text>
            <Text>Weight: {pokemon.weight}</Text>

            <Text>
              Type:{" "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
