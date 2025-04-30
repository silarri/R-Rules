import React from 'react';
import {
    StyleSheet,  TouchableOpacity, Alert,  ScrollView 
} from 'react-native';
import {
     Text, Item, View, Input, CheckBox, Icon, Label
} from 'native-base';

import DateTimePicker from 'react-native-modal-datetime-picker';

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";



/**
 * CalendarBasedContextRule: displays the fields for creating a calendar-based context rule.
 * It is used by addContextRule.js and it has not the type field define here.
 */
export default class WeatherContextRule extends React.Component{
    constructor(props){
        super(props);

        // Start values for days of week checkbox
        let weatherStatus = [{key: "Clear", checked: false}, 
                    {key: "Clouds",checked: false}, 
                    {key: "Drizzle", checked: false}, 
                    {key: "Fog", checked: false}, 
                    {key: "Rain", checked: false}, 
                    {key: "Snow", checked: false}, 
                    {key: "Thunderstorm", checked: false}]

        this.state = {
            name: "",
            checkWeather: weatherStatus,
            minTemp: "",
            maxTemp: ""
        }
    }

    onChangeName(value){
        this.setState({
            name: value
        })
    }

    onPressCheckBox(item){
        console.log("onPressCheckBox");
        let weather = this.state.checkWeather;
        weather[item].checked = !weather[item].checked;

        this.setState({
            checkWeather: weather
        })
    }

    onChangeMinTemp(value){
        this.setState({
            minTemp: value
        })
    }

    onChangeMaxTemp(value){
        this.setState({
            maxTemp: value
        })
    }
    
    onPressSaveButton = () => {
        console.log("onPressSaveButton");
        
        let n = this.state.name;
        let minTemp = this.state.minTemp;
        let maxTemp = this.state.maxTemp;
        let weather = this.state.checkWeather;

        let n2 = n;

        let checked = weather.some(element => element.checked);


        // Check if all fields are ok
        if(n == "" || minTemp == "" || maxTemp == ""){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");

        }else if(n.includes(" ")){
            // Name can't contain spaces
            Alert.alert("Warning","Name field can't contain spaces.");

        }
        else if(n2.replace(/[^0-9]/g,"").length == n.length){
            // Name must contain one letter
            Alert.alert("Warning", "Name field must contain at least one letter.")

        }else if(!(/[a-zA-Z]/).test(n[0])){
            // First character of name must be a letter (siddhi fail)
            Alert.alert("Warning", "First character of name field must be a letter.")

        }else if(!checked){
            // User has not selected any weather status
            Alert.alert("Warning", "You must select at least one day of the weather status.")

        }else if(Number(minTemp) >= Number(maxTemp)){
            // Min temp must be smaller than max temp
            Alert.alert("Warning", "MinTemp field must be smaller than maxTemp.")
        }
        else{

            // Fields are ok
            let existByName = Schemas.existsByNameContextRule(n);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.storeWeatherContextRule(n,weather, Number(minTemp), Number(maxTemp));

                //CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
        
    }

    renderWeatherStatus(i){
        return (
            <View style={styles.item}>
                <CheckBox style={{marginRight: '12%'}}
                    checked={this.state.checkWeather[i].checked} onPress={() => this.onPressCheckBox(i)}/>
                <Text style={{fontSize: 18}}>{this.state.checkWeather[i].key}</Text>
            </View>
        )
    }

    render(){
        return(
            <View >
                <ScrollView>
                <Text style={styles.txt}>Name:</Text>
                <Item underline style={styles.refresh}>
                    {this.state.name == "" ? 
                        <Input  placeholder="Insert name"
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />
                    :
                    <Input  value={this.state.name}
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />}
                    
                </Item>
                <Text style={[styles.txt]}>Select the weather cases you want:</Text>
                <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                    <View style={[styles.container]}>
                        <View style={{flex: 0.5}}>
                            {this.renderWeatherStatus(0)}
                            {this.renderWeatherStatus(1)}
                            {this.renderWeatherStatus(2)}
                            {this.renderWeatherStatus(3)}
                        </View>
                        <View style={{flex: 0.5}}>
                            {this.renderWeatherStatus(4)}
                            {this.renderWeatherStatus(5)}
                            {this.renderWeatherStatus(6)}
                        </View>
                    </View>       
                </Item>
                <Text style={[styles.txt, {marginRight:'5%'}]}>Select temperature range:</Text>
                <Item style={[styles.refresh,styles.row]}>
                    <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>Min temp:</Label>
                    <View style= {{width: 60}}>
                        {this.state.minTemp == "" ? 
                            <Input  maxLength={2}
                                placeholder="5"
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMinTemp.bind(this)} />
                            :
                            <Input  maxLength={2}
                                value = {this.state.minTemp}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMinTemp.bind(this)} />
                    }
                    </View>
                    <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>ºC</Label>
                </Item>
                <Item style={[styles.refresh,styles.row]}>
                    <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>Max temp:</Label>
                    <View style= {{width: 60}}>
                        {this.state.maxTemp == "" ? 
                            <Input  maxLength={2}
                                placeholder="5"
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMaxTemp.bind(this)} />
                            :
                            <Input  maxLength={2}
                                value = {this.state.maxTemp}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMaxTemp.bind(this)} />
                    }
                    </View>
                    <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>ºC</Label>
                </Item>
                <View
                    style={[styles.refresh, {alignSelf:'flex-end'}]}>
                    <TouchableOpacity 
                        onPress={this.onPressSaveButton} >
                        <View style={styles.save}>
                            <Text style={styles.saveText}>
                                Save
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    txt: {
        marginTop: '5%',
        marginBottom: '3%',
        marginLeft: '6%',
        fontSize: 18,
        color: 'black'
    },
    txtTime: {
        marginTop: '5%',
        marginBottom: '5%',
        fontSize: 18,
        color: 'black'
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    },
    refreshButton: {
        marginLeft: '10%',
        marginRight: '6%',
        justifyContent: 'flex-end',
    },
    pickDate: {
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#d3d3d3'
    },
    pickDateText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 18
    },
    save: {
        marginTop: 25,
        marginBottom: 25,
        width: 100,
        height: 40,
        marginRight: '6%',
        marginBottom: '10%',
        backgroundColor: '#03A9F4',
        elevation: 8,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    saveText: {
        fontSize: 18,
        color: 'white'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: '5%'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '10%'
    },
    tempText: {
        marginTop: '5%',
        marginBottom: '3%',
        fontSize: 18,
        color: 'black'
    },
    row: {
        flexDirection: 'row',
        flex:1,
        alignItems: 'center'
    }
 });