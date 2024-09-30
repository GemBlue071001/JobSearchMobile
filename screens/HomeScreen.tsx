import React, { useRef, useState } from 'react';
import { View, Text, Button,StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Dimensions, FlatList } from 'react-native';
// import CompanyList from '../components/CompanyList/CompanyList';
import { companyData } from '../mock/CompanyData';
import { jobData } from '../mock/JobData';
import { ScrollView } from 'react-native';
import CompanyCard from '../components/CompanyCard';
import CardJobs from '../components/CardJobs';
const { width } = Dimensions.get("window");
const HomeScreen: React.FC = ({ navigation }:any) => {
  const [showAllJobs, setShowAllJobs] = useState(false); 
  const flatListRef = useRef<FlatList<Company>>(null);

  // Nhân đôi dữ liệu để tạo hiệu ứng cuộn
  const extendedData = [...companyData, ...companyData];

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);

    if (currentIndex >= companyData.length) {
      const scrollToIndex = currentIndex % companyData.length;
      flatListRef.current?.scrollToIndex({
        index: scrollToIndex,
        animated: false,
      });
    }
  };

  // Lấy danh sách công việc dựa trên trạng thái `showAllJobs`
  const displayedJobs = showAllJobs ? jobData : jobData.slice(0, 4);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Company for you</Text>
      <FlatList
        ref={flatListRef}
        data={extendedData}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        pagingEnabled
        renderItem={({ item }) => (
          <View style={{ width }}>
            <CompanyCard data={item} navigation={navigation} />
          </View>
        )}
      />

      <View style={styles.see}>
        <Text style={styles.heading}>Popular Jobs from many Companies</Text>
        <Text
          style={styles.heading1}
          onPress={() => setShowAllJobs(!showAllJobs)} // Cập nhật trạng thái khi người dùng nhấn vào "View More"
        >
          {showAllJobs ? "Show Less" : "View More"}
        </Text>
      </View>

      <View style={styles.jobdisplay}>
        {displayedJobs.map((job) => {
          const companys = companyData.find(
            (item) => item.id === job.companyId
          );
          return (
            <CardJobs
              key={job.id}
              data={job}
              img={job.companyImage}
              company={companys}
              navigation={navigation}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
  },
  heading1: {
    color: "blue",
    fontSize: 15,
    fontWeight: "400",
  },
  jobdisplay: {
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
  },
  see: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "none",
  },
});

export default HomeScreen;
