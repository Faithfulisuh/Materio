// SearchInput.jsx
import React from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';

const SearchInput = ({ title, onSearch, suggestions = [] }) => {
			console.log("Suggestions: ", suggestions);

  return (
  	<View>
    <View className="my-3 w-full h-16 px-3 bg-mygray rounded-2xl ">
      <TextInput
      	className="flex-1 text-black font-pregular text-base"
        placeholder={`Search ${title}`}
        placeholderTextColor="#000"
        onChangeText={onSearch}
      />
    </View>
      {suggestions.length > 0 && (
      	<View className= "absolute w-full bg-top white-16 rounded-3xl">
        <FlatList
          data={suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity className= "flex-row items-center border-0 p-3 px-4 mb-1 border-b-2 border-b-mygray" onPress={() => item.navigate()}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          style={{ maxHeight: 200, borderWidth: 1 }}
        />
      	</View>
      )}
  	</View>
  );
};

export default SearchInput;
