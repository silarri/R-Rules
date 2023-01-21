import React from 'react';
import {
    StyleSheet,  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
     Text, Item, View, Input,Container, CheckBox, Label,  Picker, 
} from 'native-base';


import DateTimePicker from 'react-native-modal-datetime-picker';

import NavFooter from "../components/navFooter";

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp"

import * as ExternalServers from '../../external-servers/external-requests.json';


/**
 * EditTimeBasedContextRuleScreen: allows you to view or edit the information in a time-based 
 * context rule.
 * First you view the information. If you want to edit the rule, you can press the edit button.
 */
export default class EditServerBasedContextRuleScreen extends React.Component{
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
            contextRule: this.props.navigation.state.params.contextRule,
            name: this.props.navigation.state.params.contextRule.name,
            server: this.props.navigation.state.params.contextRule.server,
            measurement: this.props.navigation.state.params.contextRule.measurement,
            comparator: this.props.navigation.state.params.contextRule.comparator,
            value: this.props.navigation.state.params.contextRule.value.toString(),
            edit: false
        }
    }

    // Transform realm data to javascript array (for editing array)
   

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.contextRule.name,
        };
    };

    renderServersList = () => {
        return ExternalServers.list.map((server) => {
          return <Picker.Item label={server.name} value={server.name.toLowerCase()} key={server.name} />
        })
    };

    renderSingsList = () => {
        return signs.map((sign) => {
            return <Picker.Item label={sign.value} value={sign.value} key={sign.name}/>
        })
    };

    renderMeasurementsList = () => {
        return measurements.map((m) => {
            return <Picker.Item label={m.value} value={m.key} key={m.name}/>
        })
    };

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

    onPressEditButton = () => {
        this.setState({
            edit: true,
        })
    }

    onPressSaveButton = () => {
        console.log("onPressSaveButton");
        const id= this.state.contextRule.id;

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
            let existByName = Schemas.existsByNameContextRuleAndId(id,name);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.updateServerBasedContextRule(id,name,server, measurement, comparator, parseFloat(value));

                CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
        
    }


   

    // View context rule info
    viewScreen(){
        return(
            <Container style={styles.container}>
                 <ScrollView>
                    <Text style={styles.txtUp}>You are viewing the information of the context rule. </Text>
                    <Text style={styles.txt}>Type:</Text>
                    <Item underline style={styles.refresh}>
                        <Input  editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.contextRule.type}/>
                    </Item>
                    <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.name}/>
                    </Item>
                    <Text key="servertxt" style={[styles.txt]}>Select the external server you want:</Text>
                <Item key="serverpicker" underline style={styles.refresh}>
                    <Picker 
                        editable={false}
                        enabled={false}
                        mode = 'dropdown'
                        selectedValue = {this.state.server}
                        onValueChange={this.onServerChange.bind(this)}>
                        <Item label="Pick server" value="default1" />
                        {this.renderServersList()}
                    </Picker>
                </Item>
                <Text key="pickerstxt" style={[styles.txt]}>Select the measurement and sign:</Text>
                <Item key="pickers" style={[styles.refresh]}>
                    <Picker editable={false}
                    enabled={false}
                        key="measurementpicker"
                        style={[styles.measurement]}
                        mode = 'dropdown'
                        selectedValue = {this.state.measurement}
                        onValueChange={this.onMeasurementChange.bind(this)}>
                            <Item label="Measurement" value="default2" />
                        {this.renderMeasurementsList()}
                    </Picker>
                    <Picker 
                        editable={false}
                        enabled={false}
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
                    
                    <Input  editable={false}
                            value={this.state.value}
                            maxLength={30}
                            onChangeText={this.onChangeValue.bind(this)} />
                    
                </Item>

                    
                    <View style={[styles.refresh, {alignSelf:'flex-end'}]}>
                        <TouchableOpacity 
                            onPress={this.onPressEditButton} >
                            <View style={styles.save}>
                                <Text style={styles.saveText}>
                                    Edit
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <NavFooter navigation={this.props.navigation} tab={"AddContextRule"} />
           </Container>
        )
    }

    // Edit context rule info
    editScreen(){
        return(
            <Container style={styles.container}>
                 <ScrollView>
                     <Text style={styles.txtUp}>You can edit the context-rule.</Text>
                    <Text style={styles.txt}>Type:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='#000000'
                                placeholder={this.state.contextRule.type}
                                onChangeText={this.onChangeName.bind(this)} />
                    </Item>
                    <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={true}
                                maxLength={30}
                                value={this.state.name}
                                onChangeText={this.onChangeName.bind(this)} />
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
                    <View style={[styles.refresh, {alignSelf:'flex-end'}]}>
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
                <NavFooter navigation={this.props.navigation} tab={"AddContextRule"} />
           </Container>
        )
    }

    render(){
        return(
            !this.state.edit ? this.viewScreen()
            : this.editScreen()
        )
    }
}

const styles = StyleSheet.create({
    txtUp: {
        marginTop: '2%',
        marginHorizontal: '6%',
        fontSize: 16,
        color: 'dimgrey'
    },
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
    containerWeather: {
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
    },
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