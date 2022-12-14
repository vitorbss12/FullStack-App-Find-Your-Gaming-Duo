import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameParams } from '../../@types/navigation';
import { Entypo } from '@expo/vector-icons';

import { styles } from './styles';
import { THEME } from '../../theme';
import LogoImg from '../../assets/logo-nlw-esports.png';

import { Background } from '../../components/Background';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

export function Games() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordSelected, setDiscordSelected] = useState<string>('');

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.100.13:3000/discord/ads/${adsId}`) // Laptop
      .then(response => response.json())
      .then(data => setDiscordSelected(data));
  }

  useEffect(() => {
    // fetch(`http://192.168.1.109:3000/ads/game/${game.id}`)  Desktop
    fetch(`http://192.168.100.13:3000/ads/game/${game.id}`) // Laptop
      .then(response => response.json())
      .then(data => setDuos(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              size={20}
              color={THEME.COLORS.CAPTION_300}
            />
          </TouchableOpacity>
          <Image
            source={LogoImg}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar"
        />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => getDiscordUser(item.id)}
            />
          )}
          style={styles.containerList}
          horizontal
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContainer ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Nenhum duo encontrado
            </Text>
          )}
        />

        <DuoMatch
          discord={discordSelected}
          visible={discordSelected.length > 0}
          onClose={() => setDiscordSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}