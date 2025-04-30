import React from 'react';
import {
    StyleSheet,  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import {
     Text, Item, View, Input,Container
} from 'native-base';

import NavFooter from "../components/navFooter";

// DB
import * as Schemas from "../../realmSchemas/schema";
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

import * as myPosition from "../../event/position";

/**
 * EditLocationContextRuleScreen: allows you to view or edit the information in a location context rule.
 * First you view the information. If you want to edit the rule, you can press the edit button.
 */
export default class EditLocationContextRuleScreen extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            contextRule: this.props.navigation.state.params.contextRule,
            name: this.props.navigation.state.params.contextRule.name,
            latitude: this.props.navigation.state.params.contextRule.gpsLatitude,
            longitude: this.props.navigation.state.params.contextRule.gpsLongitude,
            locationError:this.props.navigation.state.params.contextRule.locationError,
            edit: false
        }
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

    onChangeLatitude(value){
        this.setState({
            latitude: value
        })
    }

    onChangeLongitude(value){
        this.setState({
            longitude: value
        })
    }

    onChangeLocationError(value){
        this.setState({
            locationError: value
        })
    }

    onPressEditButton = () => {
        console.log("Edit press");
        this.setState({
            edit: true,
        })
    }

    onPressSaveButton = () => {
        console.log("Save pressed");
        let n = this.state.name;
        let latitude = this.state.latitude;
        let longitude = this.state.longitude;
        let locationError = this.state.locationError;
        let id = this.state.contextRule.id;

        if(n == "" || latitude == "" || longitude == "" || locationError == ""){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");
        }else{
            let n2 = n;
            // Check if already exists a context rule with that name
            let existByName = Schemas.existsByNameContextRuleAndId(id,n);
            if(existByName){
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else if(n.includes(" ")){
                Alert.alert("Warning","Name field can't contain spaces.");
            }
            else if(n2.replace(/[^0-9]/g,"").length == n.length){
                Alert.alert("Warning", "Name field must contain at least one letter.")
            }else if(!(/[a-zA-Z]/).test(n[0])){
                Alert.alert("Warning", "First character of name field must be a letter.")
            }
            else{
                Schemas.updateLocationContextRule(id,n,Number(latitude),Number(longitude),Number(locationError));
               
                CreateSiddhiApp.createSiddhiApp();

                Alert.alert('Success!','Context rule updated');
                this.setState({
                    edit: false,
                });
            }
        }
    }

    getLocation = () => {
        console.log("get");
        myPosition._getLocationAsyncForRules().then(coordinates => { 
            let c = coordinates.split(',');
            console.log("ARRAY:");
            console.log(c);
            this.setState({
                longitude: c[0],
                latitude: c[1]
            });
        });
    
    }

    // View context rule info
    viewScreen(){
        return(
            <Container style={styles.container}>
                 <ScrollView>
                    <Text style={styles.txtUp}>You are viewing the information of the context rule. </Text>
                    <Text style={styles.txt}>Type:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.contextRule.type}/>
                    </Item>
                    <Text style={styles.txt}>Name:</Text>
                    <Item underline style={styles.refresh}>
                        <Input editable={false}
                                placeholderTextColor='dimgrey'
                                placeholder={this.state.name}/>
                    </Item>

                    <Item underline style={[styles.refresh,{ flex: 1, flexDirection: 'column'}]}>
                        <View style={ styles.row}> 
                            <Text style={[styles.gpsText, {flex: 0.45}]}>GPS latitude:</Text>
                            <Item style= {{flex: 0.54}}>
                                <Input  editable={false}
                                        maxLength={16}
                                        placeholderTextColor='dimgrey'
                                        placeholder={this.state.latitude.toString()}
                                        keyboardType = 'numeric'/>
                            </Item>
                        </View>
                        <View style={[styles.row, { marginBottom: 10}]}> 
                            <Text style={[styles.gpsText, {flex: 0.45}]}>GPS longitude:</Text>
                            <Item style= {{flex: 0.54}}>
                                <Input  editable={false}
                                        maxLength={16}
                                        placeholderTextColor='dimgrey'
                                        placeholder={this.state.longitude.toString()}
                                        keyboardType = 'numeric'/>
                            </Item>
                        </View>
                    </Item>

                    <Text style={styles.txt}>Allow location error:</Text>
                    <Item underline style={[styles.refresh,styles.row]}>
                        <View style= {{flex: 0.40}}>
                            <Input  editable={false}
                                    placeholderTextColor='dimgrey'
                                    placeholder={this.state.locationError.toString()}
                                    keyboardType = 'numeric' />
                        </View>
                        <Text style={[styles.gpsText, {flex: 0.60}]}>meters</Text>
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

                    <Item underline style={[styles.refresh,{ flex: 1, flexDirection: 'column'}]}>
                        <View style={ styles.row}> 
                            <Text style={[styles.gpsText, {flex: 0.45}]}>GPS latitude:</Text>
                            <Item style= {{flex: 0.54}}>
                                <Input  
                                    maxLength={17}
                                    value={this.state.latitude.toString()}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLatitude.bind(this)} />
                            </Item>
                        </View>
                        <View style={[styles.row, { marginBottom: 10}]}> 
                            <Text style={[styles.gpsText, {flex: 0.45}]}>GPS longitude:</Text>
                            <Item style= {{flex: 0.54}}>
                            <Input  
                                maxLength={17}
                                value={this.state.longitude.toString()}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeLongitude.bind(this)} />
                            </Item>
                        </View>
                        <View style={{ alignSelf: 'stretch' }}>
                            <TouchableOpacity style={[styles.gpsButton,{ alignSelf: 'stretch' }]}
                                onPress={this.getLocation} >
                                <Text style={styles.saveText}>
                                    Get current GPS location
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Item>

                    <Text style={styles.txt}>Allow location error:</Text>
                    <Item underline style={[styles.refresh,styles.row]}>
                        <View style= {{flex: 0.40}}>
                            <Input  editable={true}
                                    maxLength={6}
                                    value={this.state.locationError.toString()}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLocationError.bind(this)} />
                        </View>
                        <Text style={[styles.gpsText, {flex: 0.60}]}>meters</Text>
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
        marginTop: '2%',
        marginBottom: '3%',
        marginLeft: '6%',
        fontSize: 18,
        color: 'black'
    },
    gpsText: {
        marginTop: '5%',
        marginBottom: '3%',
        fontSize: 18,
        color: 'black'
    },
    refresh: {
        marginLeft: '6%',
        marginRight: '6%',
        justifyContent: 'flex-start',
    },
    row: {
        flex: 1, 
        flexDirection: 'row',
        marginTop: 10,
    },
    gpsButton: {
        height: 40,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: '#778899',
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
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
    }
 });