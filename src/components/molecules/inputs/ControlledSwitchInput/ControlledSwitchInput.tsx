import { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useController, UseControllerProps } from "react-hook-form";
import { BaseToggle, Label } from "components/atoms";
import { FormInputProps } from "../FormInput";

type ControlledSwitchInputProps = UseControllerProps & {
  labelText?: string;
} & Omit<FormInputProps, "onValueChange" | "value">;

const ControlledSwitchInput = ({
  name,
  rules,
  defaultValue,
  labelText,
  ...switchProps
}: ControlledSwitchInputProps) => {
  const {
    field: { onChange, value },
  } = useController({ name, rules, defaultValue });

  const handleOnChange = useCallback(
    (newValue: boolean) => {
      onChange(newValue);
    },
    [onChange],
  );

  return (
    <View style={styles.container}>
      {labelText && <Label style={styles.label}>{labelText}</Label>}
      <BaseToggle {...switchProps} checked={value} onCheckedChange={handleOnChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "white",
  },
});

export { ControlledSwitchInput };
export type { ControlledSwitchInputProps };
