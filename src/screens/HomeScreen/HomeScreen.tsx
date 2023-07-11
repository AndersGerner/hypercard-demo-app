import { useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  Body1,
  Caption,
  Header1,
  ScreenContainer,
  ScreenSubContainer,
} from "components/atoms";
import { Spacer, Stack } from "tamagui";
import { HomeTabStackReactNavigationProps } from "navigation/HomeTabStackNavigator/types";
import { ErrorUI } from "components/molecules";
import { useTransactionsBottomSheetStore } from "services/zustand";
import { useLayoutAnimationOnChange } from "utils";
import { Pagination } from "../../components/molecules/Pagination";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { TransactionsBottomSheet } from "./TransactionsBottomSheet";
import { MakePaymentButton } from "./MakePaymentButton";
import { useAccountDetailsForHome } from "./hooks";
import { GlassVideo } from "./GlassVideo";
import { CreditCardCarousel } from "./CreditCardCarousel";

type HomeScreenProps = HomeTabStackReactNavigationProps<"HomeScreen">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { loading, error, refetch, cards } = useAccountDetailsForHome();

  const [isAddNewCardShowing, setIsAddNewCardShowing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCard = isAddNewCardShowing ? undefined : cards[activeIndex];

  const setHomeScreenContentY = useTransactionsBottomSheetStore(
    (state) => state.setHomeScreenContentY,
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const isScrollPositionAtEnd =
      event.nativeEvent.contentOffset.x + event.nativeEvent.layoutMeasurement.width >=
      event.nativeEvent.contentSize.width;

    setIsAddNewCardShowing(isScrollPositionAtEnd);
  };

  useLayoutAnimationOnChange(loading);

  return (
    <>
      <ScreenContainer>
        <GlassVideo />
        {loading ? (
          <LoadingPlaceholder />
        ) : error ? (
          <ScreenSubContainer flex={1} justifyContent={"center"} alignItems={"center"}>
            <ErrorUI
              bodyText={"We couldn't load your account information."}
              handleTryAgain={refetch}
            />
          </ScreenSubContainer>
        ) : (
          <>
            <ScreenSubContainer alignItems={"center"}>
              <Spacer size={"$4"} />
              <Caption color={"$white70"}>{"BALANCE"}</Caption>
              <Spacer size={"$2"} />
              <Header1 textAlign={"center"} color={"white"}>
                {activeCard ? activeCard.currentBalance : "0"}
              </Header1>
              <Spacer size={"$5"} />
              <Body1 color={"$white70"} fontWeight={"300"}>
                {`Credit limit: ${activeCard ? activeCard.creditLimit : "20.000"}`}
              </Body1>
              <Spacer size={"$6"} />
              <CreditCardCarousel
                cards={cards}
                onCardPress={() => navigation.navigate("AddNewCardScreen")}
                onScroll={handleScroll}
                setActiveIndex={setActiveIndex}
                navigation={navigation}
              />
              <Spacer size={"$2"} />
              <Pagination data={cards} activeIndex={activeIndex} />
              <Spacer size={"$2"} />
              {activeCard && (
                <MakePaymentButton
                  hasExistingPaymentMethods={activeCard.hasExistingPaymentMethods}
                />
              )}
              <Spacer size={"$6"} />
              <Stack onLayout={setHomeScreenContentY} />
            </ScreenSubContainer>
          </>
        )}
      </ScreenContainer>
      <TransactionsBottomSheet activeCard={activeCard} />
    </>
  );
};

export { HomeScreen };
