import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ImageBackground,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';
import { Provider, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useHeaderHeight } from '@react-navigation/elements';

// --- INÍCIO DAS MODIFICAÇÕES ---

// 1. Importe o seu image_map.js
// ATENÇÃO: Ajuste o caminho '../utils/image_map' para onde você salvou o seu arquivo image_map.js
import pokemonImageMap from '../../assets/image_map';

// --- FIM DAS MODIFICAÇÕES ---

import pokemonEggsData from '../data/pokemonEggs.json';

function EggSelectorScreen() {
  const headerHeight = useHeaderHeight();

  const initialEggType = Object.keys(pokemonEggsData)[0];

  const [selectedEggType, setSelectedEggType] = useState(initialEggType);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (selectedEggType && pokemonEggsData[selectedEggType]) {
      setDisplayedPokemon(pokemonEggsData[selectedEggType]);
    } else {
      setDisplayedPokemon([]);
    }
  }, [selectedEggType]);

  // Renderiza cada card de Pokémon
  const renderPokemonCard = ({ item }) => (
    <TouchableOpacity style={styles.pokemonCard}>
      {/* --- INÍCIO DA MODIFICAÇÃO DA IMAGEM --- */}
      <Image
        // Acessa a imagem do mapa usando o ID do Pokémon como string
        // Certifique-se de que cada item em pokemonEggsData[selectedEggType]
        // tenha uma propriedade 'id' que corresponda às chaves numéricas no image_map.js
        source={pokemonImageMap[item.image.toString()]}
        style={styles.pokemonImage}
        // O `onError` para imagens locais carregadas via `require` é raramente necessário.
        // Se a referência em `image_map.js` estiver incorreta ou a imagem não existir,
        // o React Native Bundler (Metro) geralmente avisará durante a compilação
        // ou causará um erro em tempo de execução.
      />
      {/* --- FIM DA MODIFICAÇÃO DA IMAGEM --- */}
      <Text style={styles.pokemonName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Provider>
      <ImageBackground
        source={require('../../assets/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.scrollViewContent}
          contentContainerStyle={[
            styles.contentContainer,
          ]}
        >
          <Text style={styles.sectionTitle}>Selecione o tipo de Ovo Pokémon</Text>
          <View style={styles.pickerContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setMenuVisible(true)}
                  style={styles.dropdownButton}
                >
                  <Text style={styles.dropdownButtonText}>{selectedEggType || 'Selecione um tipo de ovo...'}</Text>
                  <Icon name="menu-down" size={24} color="#ffffffff" />
                </TouchableOpacity>
              }
              style={styles.menuDropdown}
            >
              {Object.keys(pokemonEggsData).map((key) => (
                <Menu.Item
                  key={key}
                  onPress={() => {
                    setSelectedEggType(key);
                    setMenuVisible(false);
                  }}
                  title={key}
                />
              ))}
            </Menu>
          </View>

          {displayedPokemon.length > 0 ? (
            <FlatList
              data={displayedPokemon}
              renderItem={renderPokemonCard}
              keyExtractor={(item, index) => item.name + index}
              numColumns={3}
              contentContainerStyle={styles.pokemonGrid}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noPokemonText}>Selecione um tipo de ovo para ver os Pokémon.</Text>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    // paddingTop agora é definido dinamicamente no componente
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    marginTop: 0,
    width: '100%',
    textAlign: 'left',
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 15,
    height: 60,
    width: '100%',
  },
  dropdownButtonText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  menuDropdown: {
    width: Dimensions.get('window').width * 0.9,
    maxWidth: 400,
    top: 100,
  },
  pokemonGrid: {
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  pokemonCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.79)',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    width: (Dimensions.get('window').width - 35 - (8 * 2 * 3)) / 3,
    aspectRatio: 0.8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
    marginBottom: -15
  },
  pokemonName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noPokemonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default EggSelectorScreen;