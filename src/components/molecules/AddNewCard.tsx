import { StyleSheet, View, ViewStyle } from "react-native";
import { Caption, Icon, Touchable } from "components/atoms";
import { getSpaceValue } from "theme/utils";
import { Spacer } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { TextButton } from "./buttons";

interface AddNewCardProps {
  style?: ViewStyle;
  onPress: () => void;
}

const AddNewCard = ({ style, onPress }: AddNewCardProps) => (
  <LinearGradient
    style={[style, styles.container]}
    colors={["#000", "#333"]}
    start={{ x: 0.5, y: 0.5 }}
    end={{ x: 1, y: 0 }}
  >
    <View style={styles.content}>
      <Touchable onPress={onPress}>
        <View style={styles.iconAndButtonContainer}>
          <Icon iconName={"search"} tintColor={"white50"} width={getSpaceValue(8)} />
          <Spacer size={15} />
          <TextButton>
            <Caption>{"New virtual card"}</Caption>
          </TextButton>
        </View>
      </Touchable>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconAndButtonContainer: {
    alignItems: "center",
  },
});

export { AddNewCard };
