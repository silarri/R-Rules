import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';

// DB
const Realm = require('realm');
import * as Schemas from "../../realmSchemas/schema";

// EMs
import * as Communication from "../../em/fetch";
const { SiddhiClientModule } = NativeModules;
import * as CreateSiddhiApp from "../../siddhi/createSiddhiApp";

export default class FBLoginButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
    }
  }

  //Create response callback.
  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error.toString());
    } else {
      // console.log(JSON.stringify(result));

      let user = {
        name: result.name,
        token: result.id,
        provider: 'FACEBOOK'
      };
      console.log('Login done: going to create user');
      Schemas.replaceUser(user);
      // Loggeamos al usuario
      Communication.registerUser();
      console.log('Login done: user created');

      // Start Siddhi and app 
      SiddhiClientModule.connect();
      CreateSiddhiApp.createSiddhiApp();
      console.log("Sidhi app started when login");
    }
  }

  _onLogOut() {
    console.log("ON LOG OUT");
    Schemas.removeUsers();
    SiddhiClientModule.stopApp();
    // Go to login
    this.props.navigation.navigate('Loading');
  }

  render() {
    return (
      <LoginButton
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("Login failed with error: " + error.message);
            } else if (result.isCancelled) {
              console.log("Login was cancelled");
            } else {

              // Everything was all right
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  let accessToken = data.accessToken;

                  // Create a graph request asking for user information with a callback to handle the response.
                  let infoRequest = new GraphRequest(
                    '/me',
                    {
                      accessToken: accessToken,
                      parameters: {
                        fields: {
                          string: 'name'
                        }
                      }
                    },
                    this._responseInfoCallback,
                  );
                  new GraphRequestManager().addRequest(infoRequest).start();
                  // Navigate to Home
                  this.props.navigation.navigate('Home');
                });


            }
          }
        }
        onLogoutFinished={() => this._onLogOut()} />
    );
  }
};

module.exports = FBLoginButton;