import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import TopComponent from "../../components/TopComponent";
import { useSQLiteContext } from "expo-sqlite";
import { fetchAllActivities } from "../../utility/sqlite";
import moment from "moment";
import EmptyState from "../../components/EmptyState";

const History = () => {
  const db = useSQLiteContext();
  const [activityLogs, setActivityLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const activities = await fetchAllActivities();
      console.log("Fetched Activities Data:", activities); // Log the fetched data

      setActivityLogs(
        activities.map((log) => ({
          ...log,
          formattedTime: moment
            .utc(log.timestamp)
            .local()
            .format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const clearTable = async () => {
    await db.runAsync(`DELETE FROM Activities;`);
    await fetchData();
  };

  return (
    <SafeAreaView className="px-4 bg-white flex-1">
      <View>
        <TopComponent
          title="Activities"
          buttonTitle="Clear"
          handlePress={() => clearTable()}
        />
        {/* <SearchInput title="Categories" /> */}
      </View>
      <FlatList
        data={activityLogs}
        renderItem={({ item }) => (
          <View className="p-3 rounded-[20px] mb-4 w-full flex-row justify-between">
            <View className="border-myred w-5 h-5 border-solid rounded-md border-4 justify-center items-center "></View>
            <Text className="text-xl font-psemibold mx-2">
              <Text className="text-xl font-pbold">{item.action}</Text>:{" "}
              <Text className="text-xl font-pextrabold text-secondary">
                {item.material_quantity}
              </Text>{" "}
              {item.material_name} on {item.formattedTime}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="History tab is empty"
            subtitle="Pull to refresh if you've added a category or a new stock"
          />
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={10} // Adjust this based on your data and desired performance
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }
      />
    </SafeAreaView>
  );
};

export default History;
