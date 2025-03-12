import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FormField from "./FormField";
import CustomButton from "./CustomButton";

const InputLogic = ({ title }) => {
  const [inputNumber, setInputNumber] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [textInputs, setTextInputs] = useState([]);
  const [inputValues, setInputValues] = useState([]);

  const handleGenerateInputs = () => {
    const count = parseInt(inputNumber);
    if (!isNaN(count) && count > 0) {
      setInputCount(count);
      setInputValues(new Array(count).fill(""));
    } else {
      setInputCount(0);
      console.log("Please enter a valid positive number");
    }
  };

  const handleInputChange = (text, index) => {
    const values = [...inputValues];
    values[index] = text;
    setInputValues(values);
  };

  return (
    <View style={styles.container}>
      <Text className="text-lg font-pregular">
        How many {title} would you like to add?
      </Text>
      <View className="flex-row gap-6 items-center">
        <FormField
          keyboardType={"numeric"}
          value={inputNumber}
          handleChangeText={setInputNumber}
          otherStyles={{ width: 100 }}
        />
        <TouchableOpacity
          onPress={handleGenerateInputs}
          className="rounded-3xl bg-myblue w-28 h-16 items-center justify-center px-2"
        >
          <Text className="text-xl font-psemibold text-white">OK</Text>
        </TouchableOpacity>
      </View>
      <View className="my-4 w-full h-1 bg-mygray"></View>
      {Array.from({ length: inputCount }, (_, index) => (
        <View
          key={index}
          className="my-3 w-full h-16 px-3 bg-gray-200 rounded-2xl focus:border-black-200 items-center flex-row space-x-4"
        >
          <TextInput
            className="flex-1 text-black font-psemibold text-base"
            placeholder={`${title} ${index + 1}`}
            value={inputValues[index]}
            onChangeText={(text) => handleInputChange(text, index)}
          />
        </View>
      ))}
      <CustomButton
        title={`Add ${title}`}
        handlePress={() =>
          console.log(`Input Values: ${JSON.stringify(inputValues)}`)
        }
        containerStyles="w-full mt-7"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 3,
    alignItems: "center",
  },
});

export default InputLogic;
