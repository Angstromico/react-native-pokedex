import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface PokemonDetails {
  id: number
  name: string
  sprites: { front_default: string }
  height: number
  weight: number
  types: { type: { name: string } }[]
  cries: { latest: string; legacy: string }
  stats: { base_stat: number; stat: { name: string } }[]
  abilities: { ability: { name: string }; is_hidden: boolean }[]
}

interface PokemonModalProps {
  visible: boolean
  pokemon: PokemonDetails | null
  onClose: () => void
}

export default function PokemonModal({
  visible,
  pokemon,
  onClose,
}: PokemonModalProps) {
  if (!pokemon) return null

  const playSound = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri })
      await sound.playAsync()
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name='close' size={28} color='#333' />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>{pokemon.name}</Text>
              <View style={styles.idContainer}>
                <Text style={styles.idText}>
                  #{pokemon.id.toString().padStart(3, '0')}
                </Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={{ uri: pokemon.sprites.front_default }}
                style={styles.image}
                resizeMode='contain'
              />
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => playSound(pokemon.cries.latest)}
              >
                <Ionicons name='volume-high' size={24} color='white' />
              </TouchableOpacity>
            </View>

            <View style={styles.typesContainer}>
              {pokemon.types.map((t, index) => (
                <View key={index} style={styles.typeBadge}>
                  <Text style={styles.typeText}>{t.type.name}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.row}>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons
                    name='weight'
                    size={20}
                    color='#666'
                  />
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
                </View>
                <View style={styles.infoItem}>
                  <MaterialCommunityIcons name='ruler' size={20} color='#666' />
                  <Text style={styles.infoLabel}>Height</Text>
                  <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Base Stats</Text>
              {pokemon.stats.map((stat, index) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>
                    {stat.stat.name.replace('-', ' ')}
                  </Text>
                  <Text style={styles.statValue}>{stat.base_stat}</Text>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.min(stat.base_stat, 100)}%`,
                          backgroundColor:
                            stat.base_stat > 50 ? '#4caf50' : '#ff9800',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Abilities</Text>
              <View style={styles.abilitiesContainer}>
                {pokemon.abilities.map((ability, index) => (
                  <View key={index} style={styles.abilityBadge}>
                    <Text style={styles.abilityText}>
                      {ability.ability.name.replace('-', ' ')}
                    </Text>
                    {ability.is_hidden && (
                      <Text style={styles.hiddenText}>(Hidden)</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#333',
  },
  idContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  idText: {
    color: '#666',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 25,
    elevation: 3,
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  typeBadge: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statName: {
    width: 100,
    textTransform: 'capitalize',
    color: '#666',
    fontSize: 14,
  },
  statValue: {
    width: 30,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 10,
    fontSize: 14,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityBadge: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  abilityText: {
    textTransform: 'capitalize',
    color: '#333',
  },
  hiddenText: {
    fontSize: 10,
    color: '#888',
    marginLeft: 4,
    fontStyle: 'italic',
  },
})
