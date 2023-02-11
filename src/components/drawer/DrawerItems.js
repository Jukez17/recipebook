import React from 'react'
import { Text } from 'react-native'
import DeviceInfo from "react-native-device-info"
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
  } from '@react-navigation/drawer';
import Colors from '../../styles/Colors';

const appVersion = DeviceInfo.getVersion()
  
const DrawerItems = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label='Settings' onPress={() => {}} />
        <Text style={{color: Colors.black, fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{appVersion}</Text>
      </DrawerContentScrollView>
    );
  }

  export default DrawerItems