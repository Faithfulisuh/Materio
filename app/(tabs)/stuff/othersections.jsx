import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TopComponent from "../../../components/TopComponent";
import InputLogic from "../../../components/InputLogic";

const Othersections = () => {
  return (
    <SafeAreaView className="px-9">
      <TopComponent title="Other Sections" />
      <InputLogic title={"Categories"} />
    </SafeAreaView>
  );
};

export default Othersections;
