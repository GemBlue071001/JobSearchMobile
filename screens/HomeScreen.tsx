import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import { jobData } from "../mock/JobData";
import CompanyCard from "../components/CompanyCard";
import CardJobs from "../components/CardJobs";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanies } from "../Services/CompanyService/GetCompanies";
import { GetJobPost } from "../Services/JobsPost/GetJobPosts";

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [showAllJobs, setShowAllJobs] = useState(false);
  const flatListRef = useRef<FlatList<any>>(null); // Chú ý kiểu dữ liệu
  const {
    data: Company,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useQuery({
    queryKey: ["Company"],
    queryFn: ({ signal }) => fetchCompanies({ signal: signal }),
    staleTime: 5000,
  });

  // Lấy danh sách công ty và tạo dữ liệu mở rộng cho hiệu ứng cuộn
  const Companiesdata = Company?.Companies;
  const extendedData = Companiesdata ? [...Companiesdata, ...Companiesdata] : [];
  // Xử lý sự kiện khi cuộn FlatList kết thúc
  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);
  
    if (Companiesdata && currentIndex >= Companiesdata.length && flatListRef.current) {
      const scrollToIndex = currentIndex % Companiesdata.length;
      flatListRef.current.scrollToIndex({
        index: scrollToIndex,
        animated: false,
      });
    }
  };
  const {
    data: JobPosts,
    isLoading: isJobLoading,
    isError: isJobError,
  } = useQuery({
    queryKey: ["JobPosts"],
    queryFn: ({ signal }) => GetJobPost({ signal: signal }),
    staleTime: 5000,
  });

  const JobPostsdata = JobPosts?.JobPosts;
  // Lấy danh sách công việc dựa trên trạng thái `showAllJobs`
  const displayedJobs = showAllJobs ? JobPostsdata : JobPostsdata?.slice(0, 4);

  // Lấy dữ liệu các công ty từ API thông qua React Query



  if (isCompanyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading companies...</Text>
      </View>
    );
  }

  // Hiển thị thông báo khi có lỗi trong quá trình tải dữ liệu
  if (isCompanyError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load companies. Please try again later.
        </Text>
      </View>
    );
  }

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
        initialNumToRender={5}
        windowSize={10}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <CompanyCard data={item} navigation={navigation} />
          </View>
        )}
      />
{/* 
      {Companiesdata?.map((item)=>
      <View>
         <CompanyCard data={item} navigation={navigation} />
      </View>)} */}

      <View style={styles.see}>
        <Text style={styles.heading}>Popular Jobs from many Companies</Text>
        <Text
          style={styles.heading1}
          onPress={() => setShowAllJobs(!showAllJobs)}
        >
          {showAllJobs ? "Show Less" : "View More"}
        </Text>
      </View>

      <View style={styles.jobdisplay}>
        {displayedJobs?.map((job) => {
          // Giả sử bạn vẫn có `companyData` (dữ liệu giả lập) để tìm công ty từ job
          const companys = Companiesdata?.find(
            (item) => item.id === job.companyId
          );
          return (
            <CardJobs
              key={job.id}
              data={job}
             
              company={companys}
              navigation={navigation}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
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
  },
});

export default HomeScreen;
