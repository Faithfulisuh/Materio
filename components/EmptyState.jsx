import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="font-psemibold text-xl text-center text-gray-900">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-center text-gray-500 m-5">
        {subtitle}
      </Text>
    </View>
  );
};

export default EmptyState;
