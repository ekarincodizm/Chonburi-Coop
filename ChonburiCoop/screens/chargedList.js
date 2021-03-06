import React, { Component } from 'react'
import { 
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native'
import { Card, Header, Icon } from 'react-native-elements'
import formatMoney from 'accounting-js/lib/formatMoney.js'

export default class chargedList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list_data: [],
      total_bal:[],
      month: new Date().getMonth(),
      year: new Date().getFullYear()+543,
    }
  }

  componentDidMount() {
    ssid = 'ssid=' + this.props.navigation.state.params.id_user
    tab = '&tab=10'
    url = 'http://www.chtsc.com/check_loan/get_data/php2json.php?' + ssid + tab;
    fetch(
      url,
      {
          method: 'get',
      }
    )
    .then(response => response.json())
    .then((responseJson) => {
      this.setState({ list_data: responseJson })
      console.log(responseJson)
      let total = 0
      for ( let i = 0; i < responseJson.length; i++){
        total += responseJson[i].printciple_bal*1
      }
      this.setState({total_bal: total})
      console.log(total)
    })
    .catch((error) => { console.log(error) })
  }

  render() {
    let monthThai = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤษจิกายน","ธันวาคม"]
    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <TouchableOpacity
              style={{ flexDirection: 'row' }}
              onPress={() => {this.props.navigation.navigate('HomeScreen',  {id_user: this.props.navigation.state.params.id_user })}}
            >
              <Icon 
                name='home' 
                color='#fff'
              />
            </TouchableOpacity>
          }        
          centerComponent={{ 
            text: 'รายการเรียกเก็บ เดือน ' + monthThai[this.state.month] + " " + this.state.year, 
            style: { color: '#fff', fontSize: 16 } 
          }}
          backgroundColor='#248f24'
      />
        <View style={{ padding: 10, backgroundColor: '#003300', alignItems: 'center'}}>
          <Text style={{color: '#fff', fontSize: 18}}>รวม { formatMoney(this.state.total_bal, {symbol: "บาท",  format: "%v %s" }) }</Text>
        </View>
        <ScrollView style={{ marginBottom: 10, padding: 10 }} >
            {
              this.state.list_data.map(( itemCharged, i ) => (
                <View 
                    key={i} 
                    style={styles.listItem}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '70%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 25, color: '#003300', fontWeight: 'bold' }}>
                        { itemCharged.detail }
                      </Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: 'bold' }}>งวดที่: { itemCharged.seq_no }</Text>                       
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                    <View style={{ width: '33.33%', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold' }}>เงินต้น</Text>
                      <Text style={{ color: '#555' }}>{ formatMoney(itemCharged.install_amt*1, { symbol: "บาท",  format: "%v %s" }) }</Text>
                    </View>
                    <View style={{ width: '33.33%', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold' }}>ดอกเบี้ย</Text>
                      <Text style={{ color: '#555' }}>{ formatMoney(itemCharged.int_amt*1, { symbol: "",  format: "%v %s" }) }</Text>
                    </View>
                    <View style={{ width: '33.33%', alignItems: 'center', justifyContent: 'center' }} >
                      <Text style={{ fontWeight: 'bold' }}>รวม</Text>
                      <Text style={{ color: '#555' }}>{ formatMoney(itemCharged.printciple_bal*1, { symbol: "บาท",  format: "%v %s" })}</Text>
                    </View>
                  </View>
                </View>

              ))
            }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6ffe6'
  },
  listItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});
