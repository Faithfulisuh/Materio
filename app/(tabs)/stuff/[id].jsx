import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

import TopComponent from "../../../components/TopComponent";
import SearchInput from "../../../components/SearchInput";
import MaterialItem from "../../../components/MaterialItems";
import { fetchAllMaterials, insertActivity } from "../../../utility/sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { AddSheet } from "../../../components/BottomSheet";
import EmptyState from "../../../components/EmptyState";

const Materials = () => {
  const db = useSQLiteContext();
  const [material, setMaterial] = useState([]);
  const [category, setCategory] = useState([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [extendWindow, setExtendWindow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [num, setNum] = useState("");
  const { id } = useLocalSearchParams();
  const route = useRoute();
  const title = "Materials";

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const materialData = await fetchAllMaterials(id, title);
      console.log("Fetched Material Data:", materialData); // Log the fetched data
      setMaterial(materialData);

      await db.withTransactionAsync(async () => {
        const categoryResults = await db.getAllAsync(
          `SELECT * FROM Categories WHERE id = ?;`,
          [id]
        );
        setCategory(categoryResults[0] || null); // Get the first item or set to null if empty
      });
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const showItem = (Id) => {
    if (extendWindow === Id) {
      setExtendWindow(false);
    } else {
      setExtendWindow(Id);
    }
  };

  const increaseQuantity = async (
    newQuantity,
    oldQuantity,
    selectedId,
    name,
    category
  ) => {
    if (!newQuantity) {
      console.log(newQuantity);
      console.error("Enter a value.");
      return;
    } else {
      setExtendWindow(!extendWindow);
      const ans = parseInt(newQuantity) + parseInt(oldQuantity);
      await db.runAsync(`UPDATE Materials SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);
      insertActivity("Added", name, newQuantity, category);
      await fetchData();
      setNum("");
    }
  };

  const decreaseQuantity = async (
    newQuantity,
    oldQuantity,
    selectedId,
    name,
    category
  ) => {
    if (!newQuantity) {
      console.error("Enter a value.");
      return;
    } else if (newQuantity > oldQuantity) {
      console.error("This value is greater than the current quantity!");
      return;
    } else {
      setExtendWindow(!extendWindow);
      const ans = parseInt(oldQuantity) - parseInt(newQuantity);
      await db.runAsync(`UPDATE Materials SET quantity = ? WHERE id = ?;`, [
        ans,
        selectedId,
      ]);
      insertActivity("Removed", name, newQuantity, category);
      await fetchData();
      setNum("");
    }
  };

  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      {category && (
        <>
          <View>
            <TopComponent
              title={`${category.category}`}
              buttonTitle="Delete"
              otherStyles={{ backgroundColor: "#FF3E41" }}
            />
            {/* <SearchInput title={`${category.category}`} /> */}
          </View>
          <FlatList
            data={material}
            renderItem={({ item }) => (
              <TouchableOpacity key={item.id}>
                <MaterialItem
                  handlePress={() => showItem(item.id)}
                  title={item.name}
                  quantity={item.quantity}
                />
                {extendWindow === item.id && (
                  <View className="flex-row justify-evenly">
                    <TextInput
                      value={num}
                      onChangeText={(e) => setNum(e)}
                      keyboardType="numeric"
                      className="bg-gray-200 rounded-3xl items-center font-psemibold text-base px-3 w-28 text-center"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        increaseQuantity(
                          num,
                          item.quantity,
                          item.id,
                          item.name,
                          category.category
                        )
                      }
                      className={
                        "bg-myred rounded-3xl h-15 w-24 justify-center items-center "
                      }
                    >
                      <Text className="text-white font-pbold text-xs">Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        decreaseQuantity(
                          num,
                          item.quantity,
                          item.id,
                          item.name,
                          category.category
                        )
                      }
                      className={
                        "bg-myred rounded-3xl h-15 w-24 justify-center items-center "
                      }
                    >
                      <Text className="text-white font-pbold text-xs">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <EmptyState
                title="This category is empty"
                subtitle="Add stocks by tapping on 'Add new stock' below"
              />
            )}
            ListFooterComponent={
              <TouchableOpacity
                className="my-4 flex-row justify-end"
                onPress={() => {
                  setBottomSheetOpen(!bottomSheetOpen);
                }}
              >
                <View className="w-4 h-4"></View>
                <Text className="text-lg font-psemibold text-myred">
                  + Add new stock
                </Text>
              </TouchableOpacity>
            }
            keyExtractor={(item) => item.id}
            initialNumToRender={10}
            windowSize={5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchData(setMaterial, setRefreshing)}
              />
            }
          />
          {bottomSheetOpen && (
            <AddSheet
              title={"Materials"}
              onClose={() => setBottomSheetOpen(!bottomSheetOpen)}
              categoryId={id}
              category={`${category.category}`}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Materials;
