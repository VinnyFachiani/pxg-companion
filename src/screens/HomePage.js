import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ImageBackground // <--- IMPORTE ImageBackground
} from 'react-native';
import { BlurView } from 'expo-blur';

// ... (todas as suas constantes como HORIZONTAL_PADDING, CARD_WIDTH, CARD_HEIGHT, cardData) ...
const { width } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_VERTICAL_MARGIN = 10;
const CARD_WIDTH = width - (HORIZONTAL_PADDING * 2);
const CARD_HEIGHT = 70;

const cardData = [
  { id: '1', title: 'Calculadora de Boost', image: require('../../assets/calculadoraBoost.png'), screen: 'CalcBoost' },
  { id: '2', title: 'Box Pokémon', image: require('../../assets/calculadoraBoost.png'), screen: 'BoxPokemon' },
  { id: '3', title: 'Respawn', image: require('../../assets/calculadoraBoost.png'), screen: 'Respawns' },
  { id: '4', title: 'Em breve', image: require('../../assets/calculadoraBoost.png'), screen: '' },
  { id: '5', title: 'Em breve', image: require('../../assets/calculadoraBoost.png'), screen: '' },
  { id: '6', title: 'Em breve', image: require('../../assets/calculadoraBoost.png'), screen: '' },
];


function HomeScreen({ navigation }) {
  const renderCardItem = ({ item }) => (
    <TouchableOpacity
      style={styles.glassCard}
      onPress={() => {
        if (navigation && navigation.navigate && item.screen) {
          navigation.navigate(item.screen);
        } else {
          console.warn(`Tela '${item.screen}' não encontrada ou navegação inválida.`);
        }
      }}
    >
      <Image source={item.image} style={styles.cardBackgroundImage} />
      <BlurView
        intensity={25}
        tint="dark"
        style={styles.blurOverlay}
      >
        <View style={styles.cardContentContainer}>
          <Text style={styles.glassCardText}>{item.title}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    // <View style={styles.container}> // <--- REMOVA ESTA LINHA OU AJUSTE-A
    <ImageBackground // <--- USE ImageBackground AQUI
      source={require('../../assets/bg.jpg')} // <--- CAMINHO PARA SUA IMAGEM DE FUNDO
      style={styles.backgroundImage} // <--- APLIQUE O ESTILO PARA A IMAGEM DE FUNDO
      resizeMode="cover" // <--- 'cover', 'contain', 'stretch' - Escolha o melhor para sua imagem
    >
      <FlatList
        data={cardData}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
    // </View> // <--- REMOVA ESTA LINHA OU AJUSTE-A
  );
}

const styles = StyleSheet.create({
  // ... (seus estilos existentes para glassCard, cardBackgroundImage, blurOverlay, cardContentContainer, glassCardText) ...

  // --- NOVO ESTILO PARA A IMAGEM DE FUNDO DA TELA ---
  backgroundImage: {
    flex: 1, // Faz a imagem de fundo preencher toda a tela
    width: '100%',
    height: '100%',
    justifyContent: 'center', // Opcional: Centraliza o conteúdo verticalmente dentro da imagem de fundo
    alignItems: 'center',     // Opcional: Centraliza o conteúdo horizontalmente dentro da imagem de fundo
  },
  // O estilo 'container' original pode ser removido ou alterado se 'backgroundImage' o substituir completamente.
  // Se o container original tinha backgroundColor: '#000000ff', ele agora é substituído pela imagem.
  container: {
    // Pode remover este estilo ou deixá-lo vazio se a ImageBackground for o elemento principal
    // Ou, se você quiser um overlay de cor por cima da imagem de fundo, pode adicionar aqui:
    // flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)', // Exemplo de overlay escuro sobre a imagem
  },


  // Seus estilos existentes para os cards:
  glassCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    marginVertical: CARD_VERTICAL_MARGIN,
    overflow: 'hidden',
    opacity: 0.9,
  },
  cardBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCardText: {
    color: '#ffffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  listContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 20,
    // Se a imagem de fundo tiver um conteúdo muito claro, pode ser necessário um overlay aqui
    // backgroundColor: 'rgba(0,0,0,0.3)', // Exemplo de overlay escuro para a lista
  },
});

export default HomeScreen;