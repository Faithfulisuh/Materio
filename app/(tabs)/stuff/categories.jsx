import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useNavigation } from "expo-router"; // Correct import for router
import TopComponent from "../../../components/TopComponent";
import SearchInput from "../../../components/SearchInput";
import Category from "../../../components/CategoryTab";
import { AddSheet } from "../../../components/BottomSheet";
import {
  fetchAllCategories,
  fetchAllMaterials,
  fetchAllActivities,
  insertActivity,
} from "../../../utility/sqlite";
import { useSQLiteContext } from "expo-sqlite";
import EmptyState from "../../../components/EmptyState";

const Categories = () => {
  const db = useSQLiteContext();
  const [category, setCategory] = useState([]);
  const [material, setMaterial] = useState([]);
  const [activity, setActivity] = useState([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleMarking, setToggleMarking] = useState(false);
  const [enableMarking, setMarking] = useState(false);
  const [markedItems, setMarkedItems] = useState([]);
  const [markedCategory, setMarkedCategory] = useState([]);
  const [otherStyles, setOtherStyles] = useState({});
  const router = useRouter();
  const navigation = useNavigation();

  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const handleSearch = async (query) => {
    if (query) {
      const results = await searchDatabase(query);
      setSearchSuggestions(results);
      console.log("Results", results);
    } else {
      setSearchSuggestions([]);
    }
  };

  const fetchAllDummyCategories = async (query) => {
    const filteredCategories = category.filter((cat) =>
      cat.category.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered Categories:", filteredCategories); // Log filtered categories
    return filteredCategories;
  };

  const fetchAllDummyMaterials = async (query) => {
    const filteredMaterials = material.filter((mat) =>
      mat.material.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered Materials:", filteredMaterials); // Log filtered materials
    return filteredMaterials;
  };

  const fetchAllDummyActivities = async (query) => {
    const filteredActivities = activity.filter((act) =>
      act.activity.toLowerCase().includes(query.toLowerCase())
    );
    console.log("Filtered Activities:", filteredActivities); // Log filtered activities
    return filteredActivities;
  };

  const searchDatabase = async (query) => {
    const categories = await fetchAllDummyCategories(query); // Modify to fetch based on query
    const materials = await fetchAllDummyMaterials(query); // Modify to fetch based on query
    const activities = await fetchAllDummyActivities(query); // New function to fetch activities

    // Combine results
    const combinedResults = [
      ...categories.map((cat) => ({
        id: cat.id,
        name: cat.category,
        navigate: () => handleNavigation(cat.id),
      })),
      ...materials.map((mat) => ({
        category_id: mat.id,
        name: mat.name,
        navigate: () => handleNavigation(mat.id),
      })),
      ...activities.map((act) => ({
        id: act.id,
        name: act.material_name,
        navigate: () => handleNavigation(act.id),
      })),
    ];

    return combinedResults;
  };

  useEffect(() => {
    if (markedItems.length === 0) {
      setMarking(false);
    }
    fetchData();
  }, [markedItems]);

  const handleNavigation = (id) => {
    navigation.navigate("[id]", { id });
  };

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const categoriesData = await fetchAllCategories();
      const materialsData = await fetchAllMaterials();
      const activitiesData = await fetchAllActivities();

      setCategory(categoriesData);
      setMaterial(materialsData);
      setActivity(activitiesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const deleteFunction = async () => {
    setMarking(true); // Set marking state to true while deleting
    try {
      for (const id of markedItems) {
        // Fetch the category name before deletion
        const categoryToDelete = category.find((cat) => cat.id === id);
        if (categoryToDelete) {
          // Delete the category and its associated materials
          await db.runAsync(`DELETE FROM Categories WHERE id = ?;`, [id]);
          await db.runAsync(`DELETE FROM Materials WHERE category_id = ?;`, [
            id,
          ]);

          // Insert activity for the deleted category
          await insertActivity(
            "Deleted",
            `${categoryToDelete.category} category`
          );
        }
      }
      // Clear marked items and refresh the category list
      setMarkedItems([]);
      setMarkedCategory([]);
      await fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setMarking(false); // Reset marking state
    }
  };

  // Update the handleToggleMarking function to correctly manage markedCategory
  const handleToggleMarking = (id, category) => {
    setToggleMarking(!toggleMarking);

    // Toggle the marking state for the item
    setMarkedItems((prevMarkedItems) => {
      if (prevMarkedItems.includes(id)) {
        return prevMarkedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevMarkedItems, id];
      }
    });

    // Manage markedCategory based on the category name
    setMarkedCategory((prevMarkedCategory) => {
      if (prevMarkedCategory.includes(category)) {
        return prevMarkedCategory.filter(
          (itemCategory) => itemCategory !== category
        );
      } else {
        return [...prevMarkedCategory, category];
      }
    });
  };

  const handleLongPressing = (id, category) => {
    // Mark the item first
    handleToggleMarking(id, category);
    // Set marking mode to true
    setMarking(true);
  };

  const handlePressing = (id, category) => {
    if (enableMarking == false) {
      return handleNavigation(id);
    } else {
      return handleToggleMarking(id, category);
    }
  };

  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <View>
        <TopComponent
          title="Categories"
          buttonTitle="Delete"
          handlePress={deleteFunction}
        />
        {/* <SearchInput
          title="Categories"
          onSearch={handleSearch}
          suggestions={searchSuggestions}
        /> */}
      </View>
      <FlatList
        data={category}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id}>
            <Category
              categoryName={item.category}
              otherStyles={
                markedItems.includes(item.id)
                  ? { backgroundColor: "#DDDDDD" }
                  : {}
              }
              handlePress={() => handlePressing(item.id, item.category)}
              handleLongPress={() => handleLongPressing(item.id, item.category)}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No categories in your inventory"
            subtitle="Create a category by tapping on 'Add new category' below"
          />
        )}
        ListFooterComponent={
          <View>
            <TouchableOpacity className="flex-row justify-end">
              <View className="w-4 h-4"></View>
              <TouchableOpacity
                onPress={() => setBottomSheetOpen(!bottomSheetOpen)}
              >
                <Text className="text-lg font-psemibold text-myred">
                  + Add new category
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        }
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        windowSize={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(setCategory, setRefreshing)}
          />
        }
      />
      {bottomSheetOpen && (
        <AddSheet
          title={"Categories"}
          onClose={() => setBottomSheetOpen(!bottomSheetOpen)}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;
