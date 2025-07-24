import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  ImageBackground, // Para o background da tela
  Platform,
  StatusBar, // Para ajustar o padding no Android
  Dimensions // Certifique-se de que Dimensions está importado
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Para o dropdown
import { useHeaderHeight } from '@react-navigation/elements'; // Para pegar a altura do header

// Importa os dados dos Pokémon Eggs (simulando um arquivo JSON)
// Certifique-se de que este caminho está correto para o seu arquivo pokemonEggs.json
import pokemonEggsData from '../data/pokemonEggs.json';

function EggSelectorScreen() {
  const headerHeight = useHeaderHeight(); // Pega a altura do cabeçalho
  
  // Obtém a primeira chave do JSON para definir o valor inicial do Picker
  const initialEggType = Object.keys(pokemonEggsData)[0];

  const [selectedEggType, setSelectedEggType] = useState(initialEggType);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);

  // Atualiza a lista de Pokémon exibidos quando o tipo de ovo selecionado muda
  useEffect(() => {
    if (selectedEggType && pokemonEggsData[selectedEggType]) {
      setDisplayedPokemon(pokemonEggsData[selectedEggType]);
    } else {
      setDisplayedPokemon([]); // Limpa se não houver dados para o tipo selecionado
    }
  }, [selectedEggType]);

  // Renderiza cada card de Pokémon
  const renderPokemonCard = ({ item }) => (
    <TouchableOpacity style={styles.pokemonCard}>
      {/* A imagem do Pokémon. Suporta GIFs e PNGs via URL. */}
      {/* Se o GIF estiver estático, verifique o tamanho do arquivo e as dimensões do GIF. */}
      <Image source={{ uri: item.image }} style={styles.pokemonImage} />
      <Text style={styles.pokemonName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      // <-- CAMINHO PARA SUA IMAGEM DE FUNDO DA TELA -->
      // Exemplo: require('../../assets/background_egg_screen.png')
      source={require('../../assets/bg.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover" // Garante que a imagem de fundo cubra toda a área
    >
      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={[
          styles.contentContainer,
        ]}
      >
        <Text style={styles.sectionTitle}>Selecione o tipo de Ovo Pokémon</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedEggType}
            onValueChange={(itemValue) => setSelectedEggType(itemValue)}
            style={styles.picker}
            itemStyle={Platform.OS === 'ios' ? styles.pickerItem : null} // itemStyle é para iOS
          >
            {/* Mapeia as chaves do JSON para criar os itens do Picker (dropdown) */}
            {Object.keys(pokemonEggsData).map((key) => (
              <Picker.Item key={key} label={key} value={key} />
            ))}
          </Picker>
        </View>

        {/* FlatList para exibir os cards de Pokémon */}
        {displayedPokemon.length > 0 ? (
          <FlatList
            data={displayedPokemon}
            renderItem={renderPokemonCard}
            keyExtractor={(item, index) => item.name + index} // Usar nome + índice para key, pois nomes podem se repetir
            numColumns={3} // <-- ALTERADO PARA 3 COLUNAS
            contentContainerStyle={styles.pokemonGrid}
            scrollEnabled={false} // Desabilita o scroll da FlatList para que o ScrollView pai cuide disso
          />
        ) : (
          <Text style={styles.noPokemonText}>Selecione um tipo de ovo para ver os Pokémon.</Text>
        )}
        
        <View style={{ height: 50 }} /> {/* Espaçamento extra no final para scroll */}
      </ScrollView>
    </ImageBackground>
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
    paddingHorizontal: 20, // Mantém padding horizontal
    paddingBottom: 20,    // Mantém padding inferior
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    // paddingTop é definido dinamicamente no componente
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Cor do texto para contraste com o background
    marginBottom: 15,
    marginTop: 0, // Removido o margin top fixo para que fique mais próximo do topo
    width: '100%',
    textAlign: 'left',
  },
  pickerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo translúcido para o Picker
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 1)',
    marginBottom: 20,
    width: '100%',
    overflow: 'hidden', // Garante que o borderRadius seja respeitado
  },
  picker: {
    color: '#ffffff', // Cor do texto do Picker
    height: 60,
    width: '100%',
  },
  pickerItem: {
    color: '#ffffffff', // Cor do texto dos itens do Picker (apenas para iOS)
  },
  pokemonGrid: {
    justifyContent: 'space-around', // Espaço entre os cards
  },
  pokemonCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.79)', // Fundo translúcido para o card
    borderRadius: 25,
    padding: 10, // Padding interno do card para dar espaço à imagem
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8, // Margem entre os cards
    // Largura para 3 colunas: (Largura da tela - (Margens laterais do grid + Margens entre cards)) / Número de colunas
    // 20 (paddingHorizontal do contentContainer) * 2 = 40
    // 8 (margin do pokemonCard) * 2 (por card) * 3 (colunas) = 48
    // (width - 40 - 48) / 3 = (width - 88) / 3
    width: (Dimensions.get('window').width - 35 - (8 * 2 * 3)) / 3, // Recalculado para 3 colunas
    aspectRatio: 0.8, // Garante que o card seja quadrado
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonImage: {
    width: '90%', // Imagem ocupa 90% da largura do card
    height: '90%', // Imagem ocupa 90% da altura do card
    resizeMode: 'contain', // Garante que a imagem caiba sem cortar
    marginBottom: -15
  },
  pokemonName: {
    color: '#fff',
    fontSize: 15, // Fonte um pouco menor para caber melhor
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
