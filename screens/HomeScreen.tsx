import React from 'react';
import { View, Text, Button } from 'react-native';
import CompanyList from '../components/CompanyList/CompanyList';

const HomeScreen: React.FC = ({ navigation }:any) => {
  return (
    <View>
      <CompanyList/>

      
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
    </View>
  );
};



export default HomeScreen;
