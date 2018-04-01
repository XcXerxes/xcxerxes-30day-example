import React from 'react';
import { TouchableHighlight, DeviceEventEmitter, Image, ScrollView, StatusBar, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import IconFA from 'react-native-vector-icons/FontAwesome'
import Swiper from 'react-native-swiper'
import Day1 from './views/Day1'
import { Utils } from './views/Utils'

import dayConfig from './views/Utils/day.conf'


class Main extends React.Component {
  constructor() {
    super()
    this.days = dayConfig
  }
  _jumpToDay = index => {
    this.props.navigation.navigate('Day1')
  }
  render() {
    const boxs = this.days.map((item, index) => {
      console.log(item)
      return (
        <TouchableHighlight key={index} onPress={() => this._jumpToDay(index)} style={[styles.touchBox, index%3 === 2 ? styles.touchBox2 : styles.touchBox1]} >
          <View style={styles.boxContainer}>
            <Text>Day{index + 1}</Text>
            {item.isFA ? <IconFA size={item.size} name={item.icon} color={item.color} /> : <Icon name={item.icon} size={item.size} color={item.color} />}
          </View>
        </TouchableHighlight>
      )
    })
    return (
      <ScrollView style={styles.mainView} >
        <Swiper height={150} showsButtons={false} autoplay={true}>
          <TouchableHighlight onPress={() => this._jumpToDay(0)} >
            <View>
              <Image source={require('./views/img/day1.png')} />
              <Text>Day1: Timer</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this._jumpToDay(1)} >
            <View>
              <Image source={require('./views/img/day2.png')} />
              <Text>Day2: Weather</Text>
            </View>
          </TouchableHighlight>
        </Swiper>
        <View>
          {boxs}
        </View>
      </ScrollView>
    );
  }
}

// 初始化StackNavigator
const App = StackNavigator({
  // 将TabNavigator包裹在StackNavigator里面可以保证跳转页面的时候隐藏tabbar
  Main: {
    screen: Main,
  },
  Day1: {
    screen: Day1
  }
}, {

  });
export default App



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {

  },
  touchBox: {
    width: Utils.size.width/3 - .33334,
    height: Utils.size.height/3,
    backgroundColor: '#fff'
  },
  touchBox1: {
    borderBottomWidth: Utils.pixel,
    borderBottomColor: '#ccc',
    borderRightWidth: Utils.pixel,
    borderRightColor: '#ccc'
  },
  touchBox2: {
    borderTopWidth: Utils.pixel,
    borderTopColor: '#ccc',
    borderLeftWidth: Utils.pixel,
    borderLeftColor: '#ccc'
  },
  boxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: Utils.size.width / 3,
    height: Utils.size.height / 3
  }
});
