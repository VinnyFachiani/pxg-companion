import 'react-native-gesture-handler';
import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native'; // Adicionado ImageBackground
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context'; // Adicionado SafeAreaView

function CustomDrawerContent(props) {
  return (
    // ImageBackground será o contêiner principal para a imagem de fundo do drawer
    <ImageBackground
      source={require('../../assets/bgdrawer.jpg')} // <-- COLOQUE O CAMINHO PARA SUA IMAGEM DE FUNDO DO DRAWER AQUI!
      style={styles.backgroundImage}
      resizeMode="cover" // 'cover', 'contain', 'stretch' - escolha o melhor para sua imagem
    >
      {/* Overlay escuro opcional para melhorar a legibilidade do texto sobre a imagem */}
      <View style={styles.overlay} /> 

      {/* SafeAreaView para garantir que o conteúdo não fique sob a barra de status/notch */}
      <SafeAreaView style={styles.safeArea}>
        {/* SUA IMAGEM AQUI (Logo no topo do drawer) */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')} // <-- **MUDE ESTE CAMINHO** para o da sua imagem!
            style={styles.logo}
          />
        </View>
        {/* ITENS PADRÃO DO DRAWER ABAIXO DA IMAGEM */}
        <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cobre toda a imagem de fundo
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor preta com 50% de opacidade (ajuste conforme necessário)
  },
  safeArea: {
    flex: 1,
    // O backgroundColor aqui deve ser transparente para ver a imagem de fundo
    backgroundColor: 'transparent', 
  },
  header: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Transparente para ver o background da imagem
  },
  logo: {
    marginTop: '10%',
    marginBottom: '-25%',
    width: 300,
    height: 50,
    resizeMode: 'contain',
  },
  scrollContent: {
    // Estilo para a área rolável dos itens do menu, se precisar de algo específico
    // O padding superior pode ser ajustado aqui se a logo precisar de mais espaço
  }
});

export default CustomDrawerContent;
