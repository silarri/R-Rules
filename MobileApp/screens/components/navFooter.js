import React from 'react';
import {
    StyleSheet
} from 'react-native';
import {
    Button, Icon,
    Footer, FooterTab
} from 'native-base';


class NavFooter extends React.Component {
    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            tab: null,
        }
    }

    // Set active tab
    componentWillMount() {
        this.setState({
            tab: this.props.tab
        });
    }

    // Click on Footer
    onPressFooter(data) {
        if (data == 'Default') {
            this.props.navigation.navigate("Home");  
        } else {
            this.props.navigation.navigate(data); 
        }
    }

    render() {
        return (
            <Footer style={styles.footer}>
                <FooterTab>
                    <Button active={(this.state.tab == "Default")} onPress={() => this.onPressFooter('Default')}>
                        <Icon name="home" />
                    </Button>
                    <Button active={(this.state.tab == "Saved")} onPress={() => this.onPressFooter('Saved')}>
                        <Icon name="star" />
                    </Button>
                    <Button active={(this.state.tab == "Historic")} onPress={() => this.onPressFooter('Historic')}>
                        <Icon name="clock" />
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: 'white',
    }
});

export default NavFooter