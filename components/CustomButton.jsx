import { Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  otherStyles,
  textSyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-myred rounded-xl min-h-[58px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      style={{ otherStyles }}
    >
      <Text className={`text-white font-psemibold text-lg ${textSyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
