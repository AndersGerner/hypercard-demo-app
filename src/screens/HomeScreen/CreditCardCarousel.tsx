import React, { useCallback, useRef, Dispatch, SetStateAction } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewToken,
} from "react-native";
import { AspectImage, RemoteImage, Touchable } from "components/atoms";
import { FlipCard, FlipSide } from "components/molecules/FlipCard";
import { AddNewCard } from "components/molecules/AddNewCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeTabStackNavigatorParamList } from "navigation/HomeTabStackNavigator";
import { Stack } from "tamagui";
import { UserAccountCreditCard, useCardVisibility } from "./hooks";
import { CARD_IMAGE_ASPECT_RATIO, CARD_IMAGE_WIDTH, styles } from "./styles";
import {
  CardNumbers,
  LoadingPlaceholder as CardNumbersLoadingPlaceholder,
} from "./CardNumbers";

type CreditCardCarouselProps = {
  cards: UserAccountCreditCard[];
  onCardPress: () => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  navigation: NativeStackNavigationProp<HomeTabStackNavigatorParamList, "HomeScreen">;
};

const CreditCardCarousel = ({
  cards,
  onCardPress,
  onScroll,
  setActiveIndex,
  navigation,
}: CreditCardCarouselProps) => {
  const {
    isFrontOfCardVisible,
    handleFlipCard,
    maybePrimaryCardData,
    loading: isPrimaryCardDataLoading,
  } = useCardVisibility(navigation);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const lastVisibleItem = viewableItems[viewableItems.length - 1];

        if (lastVisibleItem.index !== null) {
          setActiveIndex(lastVisibleItem.index);
        }
      }
    },
  );

  const renderActiveCard = useCallback(
    ({ item }: { item: UserAccountCreditCard }) => (
      <Touchable onPress={handleFlipCard} pressStyle={undefined}>
        {item.cardArt ? (
          <FlipCard
            style={styles.flipCard}
            side={isFrontOfCardVisible ? FlipSide.FRONT : FlipSide.BACK}
            front={
              <RemoteImage
                width={CARD_IMAGE_WIDTH}
                aspectRatio={CARD_IMAGE_ASPECT_RATIO}
                uri={item.cardArt.frontImageUrl}
              />
            }
            back={
              <Stack>
                <RemoteImage
                  width={CARD_IMAGE_WIDTH}
                  aspectRatio={CARD_IMAGE_ASPECT_RATIO}
                  uri={item.cardArt.backImageUrl}
                />
                {isPrimaryCardDataLoading ? (
                  <CardNumbersLoadingPlaceholder />
                ) : (
                  <CardNumbers
                    formattedCardNumber={maybePrimaryCardData?.formattedCardNumber}
                    formattedExpirationDate={
                      maybePrimaryCardData?.formattedExpirationDate
                    }
                    cvv={maybePrimaryCardData?.cvv}
                  />
                )}
              </Stack>
            }
          />
        ) : (
          <AspectImage imageName={"default-hypercard"} width={CARD_IMAGE_WIDTH} />
        )}
      </Touchable>
    ),
    [
      handleFlipCard,
      isFrontOfCardVisible,
      isPrimaryCardDataLoading,
      maybePrimaryCardData?.cvv,
      maybePrimaryCardData?.formattedCardNumber,
      maybePrimaryCardData?.formattedExpirationDate,
    ],
  );

  return (
    <FlatList
      data={cards}
      renderItem={renderActiveCard}
      horizontal={true}
      onScroll={onScroll}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={<AddNewCard style={styles.flipCard} onPress={onCardPress} />}
      decelerationRate={"fast"}
      snapToInterval={CARD_IMAGE_WIDTH + 20}
      snapToAlignment={"start"}
      getItemLayout={(_, index) => ({
        length: CARD_IMAGE_WIDTH,
        offset: CARD_IMAGE_WIDTH * index,
        index,
      })}
      contentContainerStyle={styles.carousel}
      onViewableItemsChanged={onViewableItemsChanged.current}
      viewabilityConfig={viewabilityConfig.current}
    />
  );
};

export { CreditCardCarousel };
export type { CreditCardCarouselProps };
