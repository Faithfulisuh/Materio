import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";

const Category = ({
  category,
  categoryId,
  categoryName,
  handlePress,
  handleLongPress,
  otherStyles,
}) => {
  return (
    <TouchableOpacity
      key={category}
      onPress={handlePress}
      onLongPress={handleLongPress}
      className="border-l-4 border-solid border-black bg-white p-3 mb-4 w-full h-14"
      style={otherStyles}
    >
      <Text className="text-xl font-psemibold text-myblue">{categoryName}</Text>
    </TouchableOpacity>
  );
};
export default Category;
