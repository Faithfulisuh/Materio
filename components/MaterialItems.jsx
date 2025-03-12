import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const MaterialItem = ({
  material,
  handlePress,
  handleLongPress,
  title,
  quantity,
}) => {
  return (
    <TouchableOpacity
      key={material}
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="border-l-4 border-solid border-black bg-white p-3 mb-4 w-full h-14 flex-row justify-between"
    >
      <View className="overflow-hidden w-[90%] flex-wrap">
        <Text className="text-xl font-psemibold text-myblue">{title}</Text>
      </View>
      <View>
        <Text className="text-xl font-pbold text-gray">{quantity}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MaterialItem;
