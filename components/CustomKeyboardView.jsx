import { KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const ios = Platform.OS == "ios";
const CustomKeyboardView = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;
