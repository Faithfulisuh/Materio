import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <View className="my-10">
        <Text className="text-6xl font-pextrabold text-myblue text-center">
          Materio
        </Text>
      </View>
      <View>
        <TouchableOpacity
          className="tabBox"
          onPress={() => router.push("/stuff/categories")}
        >
          <Text className="text-xl font-psemibold">Categories</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="tabBox"
          onPress={() => router.push("/stuff/othersections")}
        >
          <Text className="text-xl font-psemibold">Other sections</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Home;
