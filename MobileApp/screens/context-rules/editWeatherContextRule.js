import React from 'react';
import {
    StyleSheet,  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
     Text, Item, View, Input,Container, CheckBox, Label
} from 'native-base';


import DateTimePicker from 'react-native-modal-datetime-picker';

import NavFooter from "../components/navFooter";

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp"


/**
 * EditTimeBasedContextRuleScreen: allows you to view or edit the information in a time-based 
 * context rule.
 * First you view the information. If you want to edit the rule, you can press the edit button.
 */
export default class EditWeatherContextRuleScreen extends React.Component{
    constructor(props){
        super(props);

        let weather = this.loadWeather();
        this.state = {
            contextRule: this.props.navigation.state.params.contextRule,
            name: this.props.navigation.state.params.contextRule.name,
            checkWeather: weather,
            minTemp: this.props.navigation.state.params.contextRule.minTemp,
            maxTemp: this.props.navigation.state.params.contextRule.maxTemp,
            edit: false
        }
    }

    // Transform realm data to javascript array (for editing array)
    loadWeather(){
        let weather = this.props.navigation.state.params.contextRule.weatherStatus;
        weather = weather.map(element => ( {"key": element.key, "checked":element.checked}));
        return weather;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.state.params.contextRule.name,
        };
    };

    onChangeName(value){
        this.setState({
            name: value
        })
    }

    onPressCheckBox(item){
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

    onPressEditButton = () => {
        this.setState({
            edit: true,
        })
    }

    onPressSaveButton = () => {
        console.log("onPressSaveButton");
        let id= this.state.contextRule.id;

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
            let existByName = Schemas.existsByNameContextRuleAndId(id,n);
            if(existByName){
                // Check if exist a rule with that name
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.updateWeatherContextRule(id,n,weather, Number(minTemp), Number(maxTemp));

                CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
            }
        }
        
    }


    renderWeatherStatus(i){
        return (
            <View style={styles.item}>
                <CheckBox disabled={!this.state.edit}
                    style={{marginRight: '12%'}}
                    checked={this.state.checkWeather[i].checked} onPress={() => this.onPressCheckBox(i)}/>
                <Text style={{fontSize: 18}}>{this.state.checkWeather[i].key}</Text>
            </View>
        )
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

                    <Text style={[styles.txt]}>Select the weather cases you want:</Text>
                    <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                        <View style={[styles.containerWeather]}>
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
                            <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.minTemp.toString()}
                                maxLength={2}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMinTemp.bind(this)} />
                        
                        </View>
                        <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>ºC</Label>
                    </Item>
                    <Item style={[styles.refresh,styles.row]}>
                        <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>Max temp:</Label>
                        <View style= {{width: 60}}>
                            <Input editable={false}
                                maxLength={2}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.maxTemp.toString()}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeMaxTemp.bind(this)} />
                        </View>
                        <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>ºC</Label>
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
                    <Text style={[styles.txt]}>Select the weather cases you want:</Text>
                    <Item style={{ marginLeft: '5%', marginRight: '5%'}}>
                        <View style={[styles.containerWeather]}>
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
                                <Input  editable={true}
                                    maxLength={2}
                                    placeholder="5"
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeMinTemp.bind(this)} />
                                :
                                <Input editable={true}
                                    maxLength={2}
                                    value = {this.state.minTemp.toString()}
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
                                <Input  editable={true}
                                    maxLength={2}
                                    placeholder="5"
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeMaxTemp.bind(this)} />
                                :
                                <Input editable={true}
                                    maxLength={2}
                                    value = {this.state.maxTemp.toString()}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeMaxTemp.bind(this)} />
                            }
                        </View>
                        <Label style={{marginRight:'5%', marginLeft: '2%', color: 'black'}}>ºC</Label>
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
    container: {
        backgroundColor: '#fff'
    },
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
    }
 });