import { useCallback, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ScreenSubContainer,
  BaseKeyboardAvoidingView,
  ScreenContainer,
  Body2,
} from "components/atoms";
import { PrimaryButton } from "components/molecules";
import { GetAccountDetailsForHomeDocument } from "services/graphql/generated";
import { useDisableGoBackOnValueTruthiness } from "navigation/hooks";
import { getColorValue } from "theme/utils";
import { useApolloClient } from "@apollo/client";
import { useLayoutAnimationOnChange } from "utils";
import { Spacer } from "tamagui";
import { Form, FormProps } from "../Form";

type AddNewCardFormProps = {
  onSuccess: () => void;
};

const schema = z.object({
  cardholderName: z.string().min(1),
  monthlyLimit: z.number().min(1),
  autoCancellation: z.boolean(),
});

type Schema = z.infer<typeof schema>;

const AddNewCardForm = ({ onSuccess }: AddNewCardFormProps) => {
  const client = useApolloClient();
  const methods = useForm<Schema>({
    mode: "onChange",
    delayError: 2000, // delay errors for 2 seconds onChangeText
    resolver: zodResolver(schema),
  });

  //Mock variables for demo purposes
  const loading = false;
  const error = undefined;

  //TODO - Add error handling when a mutation for creating a card is created.
  /* const error = useMemo(
    () => !!graphqlError || data?.createACHPaymentMethod.__typename?.includes("Error"),
    [data, graphqlError],
  ); */

  useLayoutAnimationOnChange(loading);

  const fieldConfigurations = useMemo(
    (): FormProps<Schema>["fieldConfigurations"] => ({
      cardholderName: {
        autoFocus: true,
        autoFocusType: "after-navigation",
        component: "ControlledFormInput",
        labelText: "Cardholder Name",
        name: "cardholderName",
        placeholder: "John doe",
        autoCorrect: false,
        spellCheck: false,
      },
      monthlyLimit: {
        labelText: "Monthly Limit",
        component: "ControlledFormInput",
        name: "monthlyLimit",
        placeholder: "20.000",
        autoCorrect: false,
        spellCheck: false,
      },
      autoCancellation: {
        labelText: "Auto Cancelation",
        component: "ControlledSwitchInput",
        name: "autoCancellation",
        placeholder: "Checking | Savings",
      },
    }),
    [],
  );

  const handleAddNewCardMethod = useCallback(
    async ({ cardholderName, monthlyLimit, autoCancellation }: Schema) => {
      console.log(
        "🚀 ~ file: AddNewCardForm.tsx:93 ~ { cardholderName, monthlyLimit, autoCancellation }:",
        { cardholderName, monthlyLimit, autoCancellation },
      );
      const result: boolean = await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });

      if (result) {
        try {
          await client.refetchQueries({
            include: [GetAccountDetailsForHomeDocument],
          });
        } catch {
          // TODO improve what happens when ach method has been added but we fail to refetch payment methods
        } finally {
          onSuccess();
        }
      }
    },
    [client, onSuccess],
  );

  const isValid = methods.formState.isValid;

  useDisableGoBackOnValueTruthiness(loading);

  return (
    <>
      <ScreenContainer>
        <BaseKeyboardAvoidingView>
          <ScrollView keyboardShouldPersistTaps={"handled"}>
            <ScreenSubContainer flex={1} paddingTop={"$6"}>
              <Form methods={methods} fieldConfigurations={fieldConfigurations} />
            </ScreenSubContainer>
          </ScrollView>
        </BaseKeyboardAvoidingView>
        <Spacer size={"$6"} />
        <ScreenSubContainer paddingBottom={"$6"}>
          {error ? (
            <Body2 paddingBottom={"$4"} color={"$error"}>
              {"Unable to create new card. Please try again."}
            </Body2>
          ) : null}
          <PrimaryButton
            onPress={methods.handleSubmit(handleAddNewCardMethod)}
            disabled={!isValid || loading}
          >
            {loading ? (
              <ActivityIndicator size={"small"} color={getColorValue("black")} />
            ) : (
              "Create card"
            )}
          </PrimaryButton>
        </ScreenSubContainer>
      </ScreenContainer>
    </>
  );
};

export { AddNewCardForm };
