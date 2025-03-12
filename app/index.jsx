import { ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full h-[95vh] justify-center items-center px-5">
          {/*<Image source={icons.icon} className="w-96 h-12" resizeMode="cover" />*/}
          <Text className="text-6xl font-pextrabold text-myblue">MateriO</Text>
          <Text className="text-xs font-pregular text-black-200 text-center">
            Manage your Inventory
          </Text>
          <CustomButton
            title="Proceed"
            handlePress={() => router.push("/stuff/home")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#fff" style="dark" />
    </SafeAreaView>
  );
}
