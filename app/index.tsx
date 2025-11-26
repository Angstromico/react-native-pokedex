import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = (currentOffset: number) => {
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/?limit=100&offset=${currentOffset}`)
      .then((response) => response.json())
      .then(async (data) => {
        const detailedPokemons: PokemonDetails[] = await Promise.all(
          data.results.map(async (pokemon: Pokemon) => {
            const res = await fetch(pokemon.url);
            const pokemonDetails = await res.json();
            return pokemonDetails;
          })
        );
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setPokemons(detailedPokemons);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPokemons(offset);
  }, [offset]);

  const handleNext = () => {
    setOffset((prev) => prev + 100);
  };

  const handlePrev = () => {
    if (offset >= 100) {
      setOffset((prev) => prev - 100);
    }
  };

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

      {loading ? (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#4caf50" />
          <Text style={{ marginTop: 10, color: "#666" }}>
            Loading Pokémon...
          </Text>
        </View>
      ) : (
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
      )}

      {/* Pagination Controls */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          marginBottom: 40,
        }}
      >
        <TouchableOpacity
          onPress={handlePrev}
          disabled={offset === 0 || loading}
          style={{
            backgroundColor: offset === 0 || loading ? "#ccc" : "#4caf50",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: 8,
            }}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#ccc" : "#4caf50",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginRight: 8,
            }}
          >
            Next
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
