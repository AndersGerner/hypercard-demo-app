import { StyleSheet } from "react-native";
import { ScreenContainer, ScreenSubContainer } from "components/atoms";
import { ScrollView, Spacer } from "tamagui";
import { AddNewCardForm } from "components/organisms/forms/AddNewCardForm";

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
  },
});

const AddNewCardScreen = () => {
  const onSuccessHandler = () => alert("Card created successfully");

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ScreenSubContainer paddingVertical={"$6"}>
          <Spacer size={"$6"} />
          <AddNewCardForm onSuccess={onSuccessHandler} />
        </ScreenSubContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

export { AddNewCardScreen };
