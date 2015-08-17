'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var TimerMixin = require('react-timer-mixin');

var iconTimeLine = require('image!timeline_small');
var iconTmeet = require('image!tmitter_icon_small');
var iconAccount = require('image!account_small');

var serverAddress = '192.168.115.112:8000';

var Tmitter = React.createClass({
  statics: {
    title: '<Tmitter>',
    description: 'Tab-based navigation.',
  },

  displayName: 'Tmitter',

  mixins: [TimerMixin],
  componentDidMount: function() {
    this.setInterval(
      () => { 
        var me = this;
        fetch('http://' + serverAddress + '/posts', {
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(function(response) {
          var newTimeLineArray = JSON.parse(response._bodyText);
          me.setState({timeLineArray: newTimeLineArray});
        });
      },
      500
    );
  },

  getInitialState: function() {
   return {
      selectedTab: 'timeLine',
      tmeetMessage: '',
      timeLineArray: [],
      userName: 'yuuki',
      passWord: 'abc',
      passWordConfirm: 'abc',
      registered: false,
    };
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  _renderTimeLine: function(color: string) {
    var lines = this.state.timeLineArray.map(function (timeLine) {
      return (
        <Text key={timeLine.Id} style={styles.timeLineRow}>
          <Text style={styles.timeLineName}>{timeLine.user_name + '\n'}</Text>
          <Text style={styles.timeLineMessage}>{'  ' + timeLine.message}</Text>
        </Text>
      );
    });
    
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
         {lines}
      </View>
    );
  },

  _onPressTmeet: function() {

    var me = this;
    fetch('http://' + serverAddress + '/posts', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: this.state.userName,
        message: this.state.tmeetMessage == '' ? 'なにもかいていません。' : this.state.tmeetMessage,
        url: ''
      }),
    }).then(function(response) {
      me.setState({tmeetMessage: ''});
    });
  
  },

  _renderTmeet: function(color: string) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>Tmeet</Text>

        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, multiline: true, maxLength: 140}}
          onChangeText={(text) => this.setState({tmeetMessage: text})}
          value={this.state.tmeetMessage}
        />

        <TouchableHighlight onPress={this._onPressTmeet}>
           <Text style={styles.tmeetText}>Post</Text>
        </TouchableHighlight>

      </View>
    );
  },

  _onPressRegister: function() {

    var me = this;
    fetch('http://' + serverAddress + '/users', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: this.state.userName,
        password: this.state.passWord,
        password_confirm: this.state.passWordConfirm,
        url: ''
      }),
    }).then(function(response) {
        me.setState({registered: true});
    });
  
  },

 _renderAccount: function(color: string) {
    
    var msgReg = '';
    if (this.state.registered) {
      msgReg = 'Registered';
     }
    
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>Account</Text>

        <Text style={styles.itemName}>User ID</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, multiline: true, maxLength: 32}}
          onChangeText={(text) => this.setState({userName: text})}
          value={this.state.userName}
        />
        
        <Text style={styles.itemName}>Password</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, multiline: true, maxLength: 32}}
          onChangeText={(text) => this.setState({passWord: text})}
          value={this.state.passWord}
        />

        <Text style={styles.itemName}>Password confirm</Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1, multiline: true, maxLength: 32}}
          onChangeText={(text) => this.setState({passWordConfirm: text})}
          value={this.state.passWordConfirm}
        />
        
        <TouchableHighlight onPress={this._onPressRegister}>
           <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        <Text style={styles.registered}>{msgReg}</Text>

      </View>
    );
  },

  render: function() {
    return (
      <TabBarIOS
        tintColor="white"
        barTintColor="orange">
        <TabBarIOS.Item
          icon={iconTimeLine}
          title="time line"
          selected={this.state.selectedTab === 'timeLine'}
          onPress={() => {
            this.setState({
              selectedTab: 'timeLine',
            });
          }}>
        {this._renderTimeLine('#414A8C')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={iconTmeet}
          title="tmeet"
          selected={this.state.selectedTab === 'tmeet'}
          onPress={() => {
            this.setState({
              selectedTab: 'tmeet',
            });
          }}>
          {this._renderTmeet('#AA4444')}
        </TabBarIOS.Item>
        <TabBarIOS.Item
          icon={iconAccount}
          title="account"
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          {this._renderAccount('#21551C')}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  },

});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 24,
    color: 'white',
    margin: 30,
  },
  buttonText: {
    fontSize: 24,
    color: 'lightgray',
    margin: 30,
  },
  tmeetText: {
    textAlign: 'right',
    fontSize: 24,
    color: 'lightgray',
    margin: 30,
  },
  timeLineRow: {
    lineHeight: 40,
  },
  timeLineName: {
    textAlign: 'left',
    color: 'yellow',
    margin: 8,
  },
  timeLineMessage: {
    color: 'orange',
    margin: 16,
  },
  itemName: {
    flex: 1,
    color: 'cyan',
    margin: 16,
  },
  registered: {
    color: 'red',
    margin: 16,
  },
  image: {
    width: 32,
    height: 32,
  },


});

module.exports = Tmitter;

AppRegistry.registerComponent('Tmitter', () => Tmitter);
