import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  cries: { latest: string; legacy: string };
}

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=100")
      .then((response) => response.json())
      .then(async (data) => {
        const detailedPokemons: PokemonDetails[] = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonDetails = await res.json();
            return pokemonDetails;
          })
        );
        setPokemons(detailedPokemons);
      })
      .catch((error) => console.log(error));
  }, []);

  const playSound = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* 🔥 Pokedex Title */}
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
          color: "#4caf50",
        }}
      >
        My Pokédex
      </Text>

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
              width: "48%",
              backgroundColor: "#e8f5e9", // Light green
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#4caf50", // Green border
              position: "relative",
            }}
          >
            {/* Pokeball Icon */}
            <MaterialCommunityIcons
              name="pokeball"
              size={24}
              color="#4caf50"
              style={{ position: "absolute", top: 8, left: 8 }}
            />

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

            {/* Play Button */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "#4caf50",
                padding: 8,
                borderRadius: 20,
              }}
              onPress={() => playSound(pokemon.cries.latest)}
            >
              <Ionicons name="play" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
