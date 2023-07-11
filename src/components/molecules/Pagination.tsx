import React from "react";
import { View, StyleSheet } from "react-native";

interface PaginationProps {
  data: any[];
  activeIndex: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, activeIndex }) =>
  data.length > 1 ? (
    <View style={styles.container}>
      {data.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i === activeIndex ? "grey" : "transparent" },
          ]}
        />
      ))}
    </View>
  ) : null;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
});

export { Pagination };
