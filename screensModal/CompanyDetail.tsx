// import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { jobData } from "../mock/JobData";
import CardJobs from "../components/CardJobs";
import { companyData } from "../mock/CompanyData";
type InfoLineProps = {
  icon: string; 
  text: string; 
};
export default function CompanyDetail({route,navigation}:any) {
  const { id, companyDetail } = route.params;
  // const parsedId = Array.isArray(id) ? id[0] : id;
  // const parsedCompanyData = Array.isArray(companyDetail)
  //   ? companyDetail[0]
  //   : companyDetail;
  // const company:Company = parsedCompanyData ? JSON.parse(parsedCompanyData) : null;

  useEffect(() => {
    // Cập nhật options của màn hình và truyền companyData vào header
    navigation.setOptions({
      // header: () => <MainHeader company={companyData} />
    });
  }, [navigation, companyData]);
  const company:Company= JSON.parse(companyDetail);
  const [selectedTab, setSelectedTab] = useState("about");
  const joblistinCompany=jobData.filter((item)=> item.companyId === company.id)

  const renderContent = () => {
    if (selectedTab === "about") {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            {company?.overview?.description || "Description not available"}
          </Text>
        </View>
      );
    // } else if (selectedTab === "news") {
    //   return (
    //     <View style={styles.card}>
    //       <Text style={styles.cardTitle}>News</Text>
    //       <Text style={styles.paragraph}>
    //         Latest news and updates related to the company will appear here.
    //       </Text>
    //     </View>
    //   );
    } else if (selectedTab === "opening") {
      return (
        <View style={styles.card}>
            {joblistinCompany.map((job) => {
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
      
      );
    }
  };

  const InfoLine = ({ icon, text }:InfoLineProps) => (
    <View style={styles.line}>
      <Icon name={icon} size={30} color="#808080" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.main}>
        {company ? (
          <View>
            <Image
              source={{ uri: company.image }}
              style={styles.img}
              resizeMode="cover"
            />
            <View style={styles.main1}>
              <View style={styles.main2}>
                <Image
                  source={{ uri: company.image }}
                  style={styles.img1}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.title}>{company.name}</Text>
              <View style={styles.skillList}>
                {company?.jobs?.map((job, jobIndex) =>
                  job?.tags?.map((tag, tagIndex) => (
                    <TouchableOpacity
                      key={`${jobIndex}-${tagIndex}`}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>{tag}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <View style={{paddingHorizontal:15,width:'100%',marginTop:10}}>
                <TouchableOpacity style={styles.follow}>
                   <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10}}>
                    <Text style={{color:'#FF4500',fontSize:20,lineHeight:30}}>Follow</Text>
                    <Icon name="notifications-none" size={20} style={{marginTop:2}} color="#FF4500" />
                   </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionTitle}>Information</Text>
              <InfoLine icon="language" text="http" />
              <InfoLine icon="location-on" text={company.location} />
              <View style={styles.line2}>
                <InfoLine icon="group" text="123" />
                <InfoLine icon="work" text={`${company?.jobs?.length} jobs`} />
              </View>
              <View style={styles.tagList}>
                <Icon name="star" size={30} color="#808080" />
                <View style={styles.tagContainer}>
                  {company?.jobs?.map((item, jobIndex) => (
                    <>
                      {item?.tags?.map((tag, tagIndex) => (
                        <Text style={styles.tagText} key={tagIndex}>
                          {tag},
                        </Text>
                      ))}
                    </>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "about" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("about")}
              >
                <Text
                  style={
                    selectedTab === "about"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  About
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.tab, selectedTab === "news" && styles.activeTab]}
                onPress={() => setSelectedTab("news")}
              >
                <Text
                  style={
                    selectedTab === "news"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  News
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === "opening" && styles.activeTab,
                ]}
                onPress={() => setSelectedTab("opening")}
              >
                <Text
                  style={
                    selectedTab === "opening"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Opening
                </Text>
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {company?.jobs?.length || 0}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {renderContent()}
          </View>
        ) : (
          <Text>No company data available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 20,
  },
  main: {
    flexDirection: "column",
    width: "100%",
    position: "relative",
  },
  img: {
    width: "100%",
    height: 200,
  },
  main1: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingBottom: 20,
    elevation: 5,
  },
  main2: {
    position: "relative",
    top: -50,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#dedede",
  },
  img1: {
    height: 150,
    width: 150,
    opacity: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FF4500",
    lineHeight: 30,
    marginBottom: 10,
  },
  skillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#dedede",
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#6c6c6c",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  content: {
    marginTop: 50,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 5,
  },
  line: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginTop: 20,
    backgroundColor: "white",
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  notificationBadge: {
    backgroundColor: "red",
    borderRadius: 10,
    position: "absolute",
    right: -10,
    top: -5,
    paddingHorizontal: 6,
  },
  notificationText: {
    color: "white",
    fontSize: 12,
  },
  card: {
    borderRadius: 8,
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  line2: {
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 30,
  },
  tagList: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagContainer: {
    width: "100%",
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    justifyContent:'flex-start',
    gap:5,
    flexShrink: 1,
  },
  tagText: {
    flexDirection: "row",
    fontSize: 15,
    lineHeight: 20,
  },
  follow:{
    borderWidth:1,
    borderColor:"#FF4500",
    paddingVertical:10,
    textAlign:'center',
    alignItems:'center',
    color:'#FF4500',
    width:'100%'
  }
});
