import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import FormField from "./FormField";
import CustomButton from "./CustomButton";
import {
  insertCategory,
  insertMaterial,
  insertActivity,
} from "../utility/sqlite";
import CustomKeyboardView from "./CustomKeyboardView";

export const AddSheet = ({ title, onClose, categoryId, category }) => {
  // ref
  const bottomSheetRef = useRef(null);
  //states for formfield and others
  const [inputNumber, setInputNumber] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [categoryInputValues, setCategoryInputValues] = useState([]);
  const [materialInputValues, setMaterialInputValues] = useState([
    { name: "", quantity: "" },
  ]);

  const handleGenerateInputs = () => {
    const count = parseInt(inputNumber);
    if (!isNaN(count) && count > 0) {
      setInputCount(count);
      setCategoryInputValues(new Array(count).fill(""));
      setMaterialInputValues(new Array(count).fill({ name: "", quantity: "" }));
    } else {
      setInputCount(0);
      console.log("Please enter a valid positive number");
    }
  };

  const handleInputChange = (text, index, title, field) => {
    if (title === "Categories") {
      const values = [...categoryInputValues];
      values[index] = text;
      setCategoryInputValues(values);
    } else if (title === "Materials") {
      const values = [...materialInputValues];
      if (field === "name") {
        values[index] = { ...values[index], name: text }; // Create a new object for the specific index
      } else if (field === "quantity") {
        values[index] = { ...values[index], quantity: text }; // Create a new object for the specific index
      }
      setMaterialInputValues(values);
    }
  };

  const handleInputdisplay = (title) => {
    if (title === "Categories") {
      return Array.from({ length: inputCount }, (_, index) => (
        <View
          key={index}
          className="my-3 w-full h-16 px-3 bg-white rounded-2xl focus:border-black-200 items-center flex-row space-x-4"
        >
          <TextInput
            className="flex-1 text-black font-psemibold text-base focus:border-black"
            placeholder={`${title} ${index + 1}`}
            value={categoryInputValues[index]}
            onChangeText={(text) => handleInputChange(text, index, title)}
          />
        </View>
      ));
    } else if (title === "Materials") {
      return Array.from({ length: inputCount }, (_, index) => (
        <View key={index}>
          <View className="my-3 w-full h-16 px-3 bg-white rounded-2xl focus:border-black-200 items-center flex-row space-x-4">
            <TextInput
              className="flex-1 text-black font-psemibold text-base focus:border-black"
              placeholder={`Material Name ${index + 1}`}
              value={materialInputValues[index].name}
              onChangeText={(text) =>
                handleInputChange(text, index, title, "name")
              }
            />
          </View>
          <View className="my-3 w-full h-16 px-3 bg-white rounded-2xl focus:border-black-200 items-center flex-row space-x-4">
            <TextInput
              className="flex-1 text-black font-psemibold text-base focus:border-black"
              placeholder={`Quantity ${index + 1}`}
              value={materialInputValues[index].quantity}
              keyboardType="numeric"
              onChangeText={(text) =>
                handleInputChange(text, index, title, "quantity")
              }
            />
          </View>
          <View className="my-4 w-full h-1 bg-black"></View>
        </View>
      ));
    }
  };
  // renders
  return (
    <BottomSheet
      snapPoints={["60%"]}
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      onClose={onClose}
      // handleStyle={}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView className="flex-1 p-1 items-center bg-mygray rounded-s-3xl">
        <Text className="mb-7 text-xl font-pbold m-5">Add new {title}</Text>
        <CustomKeyboardView className="flex-1">
          <Text className="text-lg font-pregular">
            How many {title} would you like to add?
          </Text>
          <View className="flex-row gap-6 items-center">
            <FormField
              keyboardType={"numeric"}
              value={inputNumber}
              handleChangeText={setInputNumber}
              otherStyles={{ flex: 1, backgroundColor: "white" }}
            />
            <TouchableOpacity
              onPress={handleGenerateInputs}
              className="flex-1 rounded-3xl bg-myblue w-28 h-16 items-center justify-center px-2"
            >
              <Text className="text-xl font-psemibold text-white">OK</Text>
            </TouchableOpacity>
          </View>
          <View className="my-4 w-full h-1 bg-mygray"></View>
          {handleInputdisplay(title)}
          <CustomButton
            title={`Add ${title}`}
            handlePress={async () => {
              try {
                if (title === "Categories") {
                  for (const value of categoryInputValues) {
                    if (value && value.trim() !== "") {
                      await insertCategory(value); // Insert each category
                      await insertActivity("Added", `${value} in category`);
                    }
                  }
                } else if (title === "Materials") {
                  for (const material of materialInputValues) {
                    if (
                      material.name &&
                      material.name.trim() !== "" &&
                      material.quantity &&
                      material.quantity.trim() !== ""
                    ) {
                      await insertMaterial(
                        material.name,
                        material.quantity,
                        categoryId
                      ); // Adjust parameters as needed
                      await insertActivity(
                        "Added",
                        `${material.name} in ${category}`,
                        material.quantity,
                        category
                      );
                    }
                  }
                }
                setInputNumber([]);
                setCategoryInputValues([]);
                setMaterialInputValues([{ name: "", quantity: "" }]);
                setInputCount([]);
              } catch (error) {
                console.error("Error inserting data:", error);
              }
            }}
            containerStyles="w-full mt-7"
          />
        </CustomKeyboardView>
      </BottomSheetView>
    </BottomSheet>
  );
};
