import { View, Text, TextInput } from "react-native";
import React from "react";
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  key,
}) => {
  return (
    <View
      style={otherStyles}
      className="my-3 w-full h-16 px-3 bg-gray-200 rounded-2xl items-center flex-row space-x-4"
    >
      <TextInput
        className="flex-1 text-black font-psemibold text-base"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default FormField;
