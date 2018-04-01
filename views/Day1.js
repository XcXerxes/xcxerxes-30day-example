import React,{Component} from 'react'
import { Platform, ListView, StyleSheet, StatusBar, Text, TouchableHighlight, View} from 'react-native'
import {Utils} from './Utils'

class WatchFace extends Component {
  render () {
    return (
      <View style={styles.watchFaceContainer}>
        <Text style={styles.sectionTime}>{this.props.sectionTime}</Text>
        <Text style={styles.totalTime}>{this.props.totalTime}</Text>
      </View>
    )
  }
}

class WatchControl extends Component {
  constructor () {
    super()
    this.state = {
      watchOn: false,
      startBtnText: '启动',
      startBtnColor: '#60B644',
      stopBtnText: '计次',
      underlayColor: '#fff'
    }
  }
  _startWatch = () => {
    if (!this.state.watchOn) {
      this.props.startWatch()
      this.setState({
        watchOn: true,
        startBtnText: '停止',
        startBtnColor: '#ff0044',
        stopBtnText: '计次',
        underlayColor: '#eee'
      })
    } else {
      this.props.stopWatch()
      this.setState({
        watchOn: false,
        startBtnText: '启动',
        startBtnColor: '#60B644',
        stopBtnText: '复位',
        underlayColor: '#eee'
      })
    }
  }
  _addRecord = () => {
    if (this.state.watchOn) {
      this.props.addRecord()
    } else {
      this.props.clearRecord()
      this.setState({
        stopBtnText: '计次'
      })
    }
  }
  render () {
    return (
      <View style={styles.watchControlContainer}>
        <View style={styles.btnStopContainer}>
          <TouchableHighlight style={styles.btnControlItem} underlayColor={this.state.underlayColor} onPress={this._addRecord}>
            <Text style={[styles.btnText, styles.btnStopText]}>{this.state.stopBtnText}</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.btnStartContainer}>
          <TouchableHighlight style={styles.btnControlItem} underlayColor='#eee' onPress={this._startWatch} >
            <Text style={styles.btnText}>{this.state.startBtnText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

class WatchRecord extends Component {
  render () {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    let theDataSource = ds.cloneWithRows(this.props.record)
    return (
      <ListView style={styles.recordList}
        dataSource={theDataSource}
        renderRow={rowData => 
          <View style={styles.recordItem}>
            <Text style={styles.recordItemTitle}>{rowData.title}</Text>
            <View>
              <Text style={styles.recordItemTime}>{rowData.time}</Text>
            </View>
          </View>
        }
      >
        
      </ListView>
    )
  }
}

export default class Day1 extends Component {
  constructor () {
    super()
    this.state = {
      stopWatch: false,
      resetWatch: true,
      intialTime: 0,
      currentTime: 0,
      recordTime: 0,
      timeAccumulation: 0,
      totalTime: '00:00.00',
      sectionTime: '00:00.00',
      recordCounter: 0,
      record: [
        {title: '', time: ''},
        {title: '', time: ''},
        {title: '', time: ''},
        {title: '', time: ''},
        {title: '', time: ''},
        {title: '', time: ''}
      ]
    }
  }
  componentWillUnmount() {
    this._stopWatch();
    this._clearRecord();
  }

  componentDidMount() {
    if(Platform.OS === "ios"){
      StatusBar.setBarStyle(0);
    }
  }

  _startWatch() {
    if (this.state.resetWatch) {
      this.setState({
        stopWatch: false,
        resetWatch: false,
        timeAccumulation:0,
        initialTime: (new Date()).getTime()
      })
    }else{
      this.setState({
        stopWatch: false,
        initialTime: (new Date()).getTime()
      })
    }
    let milSecond, second, minute, countingTime, secmilSecond, secsecond, secminute, seccountingTime;
    let interval = setInterval(
        () => { 
          this.setState({
            currentTime: (new Date()).getTime()
          })
          countingTime = this.state.timeAccumulation + this.state.currentTime - this.state.initialTime;
          minute = Math.floor(countingTime/(60*1000));
          second = Math.floor((countingTime-6000*minute)/1000);
          milSecond = Math.floor((countingTime%1000)/10);
          seccountingTime = countingTime - this.state.recordTime;
          secminute = Math.floor(seccountingTime/(60*1000));
          secsecond = Math.floor((seccountingTime-6000*secminute)/1000);
          secmilSecond = Math.floor((seccountingTime%1000)/10);
          this.setState({
            totalTime: (minute<10? "0"+minute:minute)+":"+(second<10? "0"+second:second)+"."+(milSecond<10? "0"+milSecond:milSecond),
            sectionTime: (secminute<10? "0"+secminute:secminute)+":"+(secsecond<10? "0"+secsecond:secsecond)+"."+(secmilSecond<10? "0"+secmilSecond:secmilSecond),
          })
          if (this.state.stopWatch) {
            this.setState({
              timeAccumulation: countingTime 
            })
            clearInterval(interval)
          };
        },10);
  }

  _stopWatch() {
    this.setState({
      stopWatch: true
    })
  }

  _addRecord() {
    let {recordCounter, record} = this.state;
    recordCounter++;
    if (recordCounter<8) {
      record.pop();
    }
    record.unshift({title:"计次"+recordCounter,time:this.state.sectionTime});
    this.setState({
      recordTime: this.state.timeAccumulation + this.state.currentTime - this.state.initialTime,
      recordCounter: recordCounter,
      record: record
    })
    //use refs to call functions within other sub component
    //can force to update the states
    // this.refs.record._updateData();
  }

  _clearRecord() {
    this.setState({
      stopWatch: false,
      resetWatch: true,
      intialTime: 0,
      currentTime:0,
      recordTime:0,
      timeAccumulation:0,
      totalTime: "00:00.00",
      sectionTime: "00:00.00",
      recordCounter: 0,
      record:[
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""},
        {title:"",time:""}
      ],
     });
  }
  render () {
    return (
      <View style={styles.watchContainer}>
        <WatchFace totalTime={this.state.totalTime} sectionTime={this.state.sectionTime}></WatchFace>
        <WatchControl addRecord={()=>this._addRecord()} clearRecord={()=>this._clearRecord()} startWatch={()=>this._startWatch()} stopWatch={()=>this._stopWatch()}></WatchControl>
        <WatchRecord record={this.state.record}></WatchRecord>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  watchFaceContainer: {
    width: Utils.size.width,
    paddingTop: 35,
    paddingBottom: 30,
    paddingLeft: 30,
    backgroundColor: '#fff',
  },
  sectionTime: {
    fontSize: 20,
    fontWeight: '100',
    paddingRight: 30,
    color: '#555',
    position: 'absolute',
    left: Utils.size.width - 140,
    top: 15
  },
  totalTime: {
    fontSize: Utils.size.width === 375 ? 70 : 60,
    color: '#222',
    paddingLeft: 20
  },
  watchControlContainer: {
    width: Utils.size.width,
    height: 100,
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 0
  },
  btnStopContainer: {
    flex: 1,
    alignItems: 'flex-start'
  },
  btnStartContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  btnControlItem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  btnStopText: {
    color: '#555'
  },
  watchContainer: {
    alignItems: 'center',
    backgroundColor: '#f3f3f3'
  },
  recordList: {
    marginTop: 30,
    width: Utils.size.width,
    height: Utils.size.height - 300,
    paddingLeft: 30,
    paddingRight: 30
  },
  recordItem: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  recordItemTitle: {
    backgroundColor: 'transparent',
    color: '#777'
  },
  recordItemTime: {
    backgroundColor: 'transparent',
    color: '#222'
  }
})
