import React, { useMemo } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Spacer } from "tamagui";
import { typedValues } from "utils";
import {
  ControlledFormInput,
  ControlledFormInputProps,
  ControlledFormMultilineInput,
  ControlledFormMultilineInputProps,
  ControlledSwitchInput,
  ControlledSwitchInputProps,
} from "components/molecules/inputs";

type ValidInputValue = string | boolean | number;
type RequiredSchema = Record<string, ValidInputValue>;

type InputConfiguration<Schema, Name extends keyof Schema> = (
  | ControlledFormInputProps
  | ControlledFormMultilineInputProps
  | ControlledSwitchInputProps
) & {
  name: Name;
  component:
    | "ControlledFormInput"
    | "ControlledFormMultilineInput"
    | "ControlledSwitchInput";
};

type StandardFieldConfigurations<Schema extends RequiredSchema> = {
  [SpecificKey in keyof Schema]: InputConfiguration<Schema, SpecificKey>;
};

type FormProps<
  Schema extends RequiredSchema,
  FieldConfigurations = StandardFieldConfigurations<Schema>,
> = {
  fieldConfigurations: FieldConfigurations;
  methods: UseFormReturn<Schema>;
  submitButtonText?: string;
};

const Form = <
  Schema extends RequiredSchema,
  FieldConfigurations extends StandardFieldConfigurations<Schema>,
>({
  fieldConfigurations,
  methods,
}: FormProps<Schema, FieldConfigurations>) => {
  const inputPropsFromRecord = useMemo(
    () => typedValues(fieldConfigurations),
    [fieldConfigurations],
  );

  const getComponentToUse = (component: string) => {
    switch (component) {
      case "ControlledFormInput":
        return ControlledFormInput;
      case "ControlledFormMultilineInput":
        return ControlledFormMultilineInput;
      case "ControlledSwitchInput":
        return ControlledSwitchInput;
      default:
        return ControlledFormInput;
    }
  };

  return (
    <FormProvider {...methods}>
      {inputPropsFromRecord.map(
        ({ component, onFocus, onBlur, ...inputProps }, index, originalArray) => {
          const ComponentToUse = getComponentToUse(component);

          return (
            <React.Fragment key={inputProps.name}>
              <ComponentToUse {...inputProps} />
              {index !== originalArray.length - 1 ? <Spacer size={"$6"} /> : null}
            </React.Fragment>
          );
        },
      )}
    </FormProvider>
  );
};

export { Form };
export type { FormProps };
