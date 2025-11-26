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
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonDetails = await res.json();

            return pokemonDetails;
          })
        );
      setPokemons(detailedPokemons);
    }).catch((error) => console.log(error));
  }, []);

  return (
    <ScrollView style={{ padding: 16 }}>
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {pokemons.map((pokemon) => (
        <View
          key={pokemon.id}
          style={{
            width: "48%", // 2-column responsive grid
            backgroundColor: "#f2f2f2",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          {/* Pokémon Image */}
          <Image
            source={{ uri: pokemon.sprites.front_default }}
            style={{ width: 90, height: 90, marginBottom: 8 }}
            resizeMode="contain"
          />

          {/* Pokémon Info */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textTransform: "capitalize",
              marginBottom: 4,
            }}
          >
            {pokemon.name}
          </Text>

          <Text style={{ fontSize: 12 }}>Height: {pokemon.height}</Text>
          <Text style={{ fontSize: 12 }}>Weight: {pokemon.weight}</Text>

          <Text style={{ fontSize: 12, marginTop: 4 }}>
            Type: {pokemon.types.map((t) => t.type.name).join(", ")}
          </Text>
        </View>
      ))}
    </View>
  </ScrollView>
  );
}
