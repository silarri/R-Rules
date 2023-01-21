import React from 'react';
import {
    StyleSheet,  TouchableOpacity, Alert,  ScrollView 
} from 'react-native';
import {
     Text, Item, View, Input,  Picker, 
} from 'native-base';

import DateTimePicker from 'react-native-modal-datetime-picker';

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

import * as ExternalServers from '../../external-servers/external-requests.json';

/**
 * CalendarBasedContextRule: displays the fields for creating a calendar-based context rule.
 * It is used by addContextRule.js and it has not the type field define here.
 */
export default class ServerBasedContextRule extends React.Component{
    constructor(props){
        super(props);

        measurements = [{key: "co2", value: "CO2 (ppm)"},
                        {key: "humidity", value: "Humidity (%)"},
                        {key: "temperature", value: "Temperature (ºC)"},
        ];

        signs = [{key:"less", value:">"},
                {key:"equal", value:"="},
                {key:"greater", value:"<"}]

        this.state = {
            name: "",
            server: "default1",
            measurement: "default2",
            comparator: "default3",
            value: "",
        }
    }

    onChangeName(value){
        this.setState({
            name: value
        })
    }


    onServerChange(value) {
        // UI
        this.setState({
            server: value
        });
    }

    onMeasurementChange  (value) {
        // UI
        this.setState({
            measurement: value
        });
    }

    onComparatorChange(value) {
        // UI
        this.setState({
            comparator: value
        });
    }
    
    onChangeValue(value){
        this.setState({
            value: value,
        });
    }
    
    onPressSaveButton = () => {
        console.log("onPressSaveButton");
        const name = this.state.name;
        const comparator = this.state.comparator;
        const measurement = this.state.measurement;
        const server = this.state.server;
        const value = this.state.value;
        let nameCopy = name;

        // Check if all fields are ok
        if(name === "" || value == "" || comparator === "default2" || measurement === "default3" || server === "default1"){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");

        }else if(name.includes(" ")){
            // Name can't contain spaces
            Alert.alert("Warning","Name field can't contain spaces.");

        }
        else if(nameCopy.replace(/[^0-9]/g,"").length === name.length){
            // Name must contain one letter
            Alert.alert("Warning", "Name field must contain at least one letter.")

        }else if(!(/[a-zA-Z]/).test(name[0])){
            // First character of name must be a letter (siddhi fail)
            Alert.alert("Warning", "First character of name field must be a letter.")

        }else{

            // Fields are ok
            let existByName = Schemas.existsByNameContextRule(name);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.storeServerBasedContextRule(name, server, measurement, comparator, parseFloat(value));

                //CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
        
    }

    renderServersList = () => {
        return ExternalServers.list.map((server) => {
          return <Picker.Item label={server.name} value={server.name.toLowerCase()} key={server.name} />
        })
    }

    renderSingsList = () => {
        return signs.map((sign) => {
            return <Picker.Item label={sign.value} value={sign.value} key={sign.name}/>
        })
    }

    renderMeasurementsList = () => {
        return measurements.map((m) => {
            return <Picker.Item label={m.value} value={m.key} key={m.name}/>
        })
    }

    render(){
        return(
            <View >
                <ScrollView>
                <Text key="nametxt" style={styles.txt}>Name:</Text>
                <Item key="name" underline style={styles.refresh}>
                    {this.state.name == "" ? 
                        <Input  placeholder="Insert name"
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />
                    :
                    <Input  value={this.state.name}
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />}
                    
                </Item>
                <Text key="servertxt" style={[styles.txt]}>Select the external server you want:</Text>
                <Item key="serverpicker" underline style={styles.refresh}>
                    <Picker 
                        mode = 'dropdown'
                        selectedValue = {this.state.server}
                        onValueChange={this.onServerChange.bind(this)}>
                        <Item label="Pick server" value="default1" />
                        {this.renderServersList()}
                    </Picker>
                </Item>
                <Text key="pickerstxt" style={[styles.txt]}>Select the measurement and sign:</Text>
                <Item key="pickers" style={[styles.refresh]}>
                    <Picker key="measurementpicker"
                        style={[styles.measurement]}
                        mode = 'dropdown'
                        selectedValue = {this.state.measurement}
                        onValueChange={this.onMeasurementChange.bind(this)}>
                            <Item label="Measurement" value="default2" />
                        {this.renderMeasurementsList()}
                    </Picker>
                    <Picker 
                        key="comparatorpicker"
                        style={[styles.sign]}
                        mode = 'dropdown'
                        selectedValue = {this.state.comparator}
                        onValueChange={this.onComparatorChange.bind(this)}>
                            <Item label="Comparator" value="default3" />
                        {this.renderSingsList()}
                    </Picker>
                    
                </Item>
                <Text key="valuetxt" style={[styles.txt]}>Intoduce value to compare:</Text>
                <Item key="valueinput" underline style={styles.refresh}>
                    {this.state.value == "" ? 
                        <Input  placeholder="Example: 37"
                            maxLength={30}
                            onChangeText={this.onChangeValue.bind(this)} />
                    :
                    <Input  value={this.state.value}
                            maxLength={30}
                            onChangeText={this.onChangeValue.bind(this)} />}
                    
                </Item>
                <View
                    key="button"
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
    measure:{
        width:'50%'
    },
    sign:{
        width:'20%'
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
        alignItems: 'center',
        width:'100%'
    },
    measurement: {
        width: '55%',
    },
    sign: {
        width: '45%'
    }
 });