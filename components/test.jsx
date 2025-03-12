import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ title }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <View className="my-3 w-full h-16 px-3 bg-mygray rounded-2xl items-center flex-row space-x-4">
      <TextInput
        className="flex-1 text-white font-pregular text-base"
        value={query}
        placeholder={`Search ${title}`}
        placeholderTextColor="#000"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
