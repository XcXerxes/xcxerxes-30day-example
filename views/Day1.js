import React,{Component} from 'react'
import { Platform, ListView, StyleSheet, StatusBar, Text, TouchableHighlight, View} from 'react-native'

class WatchFace extends Component {
  static propTypes = {
    sectionTime: React.PropTypes.string.isRequired,
    totalTime: React.PropTypes.string.isRequired
  }
  render () {
    return (
      <View>
        <Text>{this.props.sectionTime}</Text>
        <Text>{this.props.totalTime}</Text>
      </View>
    )
  }
}

class WatchControl extends Component {
  static propTypes = {
    stopWatch: React.PropTypes.func.isRequired,
    clearRecord: React.PropTypes.func.isRequired,
    startWatch: React.PropTypes.func.isRequired,
    addRecord: React.PropTypes.func.isRequired
  }
}
