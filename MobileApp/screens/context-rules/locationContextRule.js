import React from 'react';
import {
    StyleSheet,  TouchableOpacity, Alert, TextInput
} from 'react-native';
import {
     Text, Item, View, Input
} from 'native-base';


// DB
import * as Schemas from "../../realmSchemas/schema";
import * as myPosition from "../../event/position"

/**
 * LocationContextRule: displays the fields for creating a location context rule.
 * It is used by addContextRule.js and it has not the type field define here.
 */
export default class LocationContextRule extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            name: "",
            latitude: "Latitude",
            longitude: "Longitude",
            locationError: ""
        }
    }

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


    onPressOk = () =>{
        
    }

    onPressSaveButton = () => {
        n = this.state.name;
        latitude = this.state.latitude;
        longitude = this.state.longitude;
        locationError = this.state.locationError;

        let n2 = n;

        if(n == "" || latitude == "" || longitude == "" || locationError == ""){
            // Some field is invalid
            Alert.alert("Warning","All fields must be completed");
        }else if(n.includes(" ")){
            Alert.alert("Warning","Name field can't contain spaces.");
        }else if(n2.replace(/[^0-9]/g,"").length == n.length){
            Alert.alert("Warning", "Name field must contain at least one letter.")
        }else if(!(/[a-zA-Z]/).test(n[0])){
            Alert.alert("Warning", "First character of name field must be a letter.")
        }
        else{

            // Check if already exists a context rule with that name
            let existByName = Schemas.existsByNameContextRule(n);
            if(existByName){
                Alert.alert("Warning", "There is already a context rule with that name. You must choose another one.");
            }else{
                Schemas.storeLocationContextRule(n, Number(latitude), Number(longitude), Number(locationError));

                Alert.alert("Success!",'Context rule saved', [{ text: "OK", 
                    onPress: () => this.props.navigation.navigate('Context_rules')}]);
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
  
    render(){
        return(
            <View >
                <Text style={styles.txt}>Name:</Text>
                <Item underline style={styles.refresh}>
                    {this.state.name == "" ? 
                        <Input placeholder="Insert name"
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />
                        :
                        <Input value={this.state.name}
                            maxLength={30}
                            onChangeText={this.onChangeName.bind(this)} />}
                    
                </Item>

                <Item underline style={[styles.refresh,{ flex: 1, flexDirection: 'column'}]}>
                    <View style={styles.row}> 
                        <Text style={[styles.gpsText, {flex: 0.45}]}>GPS latitude:</Text>
                        <Item style= {{flex: 0.54}}>
                            {this.state.latitude=="Latitude" ? 
                                <Input  
                                    maxLength={17}
                                    placeholder={this.state.latitude}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLatitude.bind(this)} />
                                : 
                                <Input 
                                    maxLength={17} 
                                    value={this.state.latitude}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLatitude.bind(this)} />}
                                
                            
                        </Item>
                    </View>
                    <View style={[styles.row, { marginBottom: 10}]}> 
                        <Text style={[styles.gpsText, {flex: 0.45}]}>GPS longitude:</Text>
                        <Item style= {{flex: 0.54}}>
                        {this.state.longitude=="Longitude" ? 
                                <Input  placeholder={this.state.longitude}
                                    maxLength={17}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLongitude.bind(this)} />
                                : 
                                <Input  
                                    value={this.state.longitude}
                                    maxLength={17}
                                    keyboardType = 'numeric'
                                    onChangeText={this.onChangeLongitude.bind(this)} />}
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
                        {this.state.locationError == "" ? 
                            <Input  maxLength={6}
                                placeholder="Distance"
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeLocationError.bind(this)} />
                            :
                            <Input  maxLength={6}
                                value = {this.state.locationError}
                                keyboardType = 'numeric'
                                onChangeText={this.onChangeLocationError.bind(this)} />
                    }
                        
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
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
