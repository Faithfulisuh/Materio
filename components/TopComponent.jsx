import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const TopComponent = ({ title, buttonTitle, otherStyles, handlePress }) => {
  return (
    <View className="my-5 px-1 items-center flex-row justify-between">
      <Text className="text-2xl font-pblack">{title}</Text>
      <TouchableOpacity
        className="rounded-3xl bg-myblue w-32 h-14 items-center justify-center px-2"
        style={otherStyles}
        onPress={handlePress}
      >
        <Text className="text-xl font-pbold text-white">{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TopComponent;
