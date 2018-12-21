import React, {Component} from 'react';
import {Button, StyleSheet,  View,Text, ActivityIndicator, FlatList,Image,Alert,TouchableOpacity,AsyncStorage,Animated} from 'react-native';
import {StackNavigator,} from 'react-navigation';
import { List, ListItem } from 'react-native-elements';
import data from  './data.json';



class HomeScreen extends React.Component{
    static navigationOptions = {
        title: 'Pradžios ekranas',


    };

    constructor() {
        super();

        this.state = {
            dataSource: [],
            isLoading: true,
            result:''

        };
    }


    renderItem = ({item}) => {
        const  { navigate } = this.props.navigation;

        return (

            <View style={styles.box}>
                <Image style={{width: 200, height: 401}}
                       source={{uri: item.image}}/>
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 30}}>
                        {item.name}
                    </Text>
                    <Text style={{fontWeight: 'bold', fontSize: 20, justifyContent: 'space-between'}}>
                        {item.author}
                    </Text>
                    <Text style={{justifyContent: 'space-between'}}>
                        {item.about}
                    </Text>
                    <Image style={{width: 10, height: 10}}
                    />

                    <TouchableOpacity style={styles.button} onPress={ ()=> navigate('Profile',{id: item.id, image: item.image, author: item.author, about: item.about, name: item.name,

                    })}>
                        <Text style={{justifyContent: 'space-between', fontSize: 20 }}> Žymėti kaip skaityta</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    };


    componentDidMount() {
        return fetch('https://api.myjson.com/bins/m8tfi')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    dataSource: responseJson.Knygos,
                    isLoading: false,

                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }


    render(){

        const {navigate} = this.props.navigation;
        return (
            this.state.isLoading
                ?
                <View style={{flex: 1, justifyContent: 'center', align: 'center'}}>
                    <ActivityIndicator size={100} color="#330066" animating/>
                </View>:    <View>




                        <TouchableOpacity style={styles.button}>
                            <Text style={{border: 5, borderColor: 'black', fontSize: 20}}
                                  onPress={() => navigate('Books', {
                                      name: this.state.name,
                                      author: this.state.author,

                                  })}>Filtruoti knygas
                            </Text>
                        </TouchableOpacity>



                <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
            />

                </View>

        );
    }
    onClick() {
    }
}

class ProfileScreen extends React.Component {

    static navigationOptions = {
        title: 'Perskaitytos knygos',
        navigationOption: {
            textAlign: 'center',
            justifyContent: 'center',

        }
    };

    componentWillMount() {
        this.onSave();

        this.displayData();
    }

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.navigation.state.params.id,
            image: this.props.navigation.state.params.image,
            author: this.props.navigation.state.params.author,
            about: this.props.navigation.state.params.about,
            name: this.props.navigation.state.params.name,

        };

    }

    onSave = async () => {
        const nameStored = this.state.name;
        const authorStored = this.state.author;
        try {
            let data = await AsyncStorage.getItem(nameStored);
            let data2 = await AsyncStorage.getItem(authorStored);
            AsyncStorage.setItem(nameStored, data += JSON.stringify(this.state.name));
            AsyncStorage.setItem(authorStored, data2 += JSON.stringify(this.state.author));
        } catch (error) {
            Alert.alert('Klaida', 'Yra problemu saugojant duomenis');
        }
    };

    displayData = async () => {
        const nameStored = this.state.name;
        const authorStored = this.state.author;
        try {
            const storedName = await AsyncStorage.getItem(nameStored);
            const storedAuth = await AsyncStorage.getItem(authorStored);
            this.setState({storedName});
            this.setState({storedAuth});

        } catch (error) {
            Alert("klaida")
        }

    };

    render() {
        const {navigate} = this.props.navigation;
        const {storedName} = this.state;
        const {storedAuth} = this.state;

        return (
            <View style={styles.container}>

                <View style={styles.container}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{border: 5, borderColor: 'black', fontSize: 20}}
                              onPress={() => navigate('AllBooks', {
                                  name: this.state.name,
                                  author: this.state.author,

                              })}>Visos Perskaitytos knygos
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.box}>


                        <View>

                            <Text style={{fontSize: 30, color: '#2da839'}}> Ši knyga „ <Text
                                style={{fontWeight: 'bold'}}>{this.state.name} </Text> “ perskaityta </Text>

                        </View>


                    </View>
                </View>
            </View>

        );
    }
}
class BooksScreen extends React.Component {

    static navigationOptions = {
        title: 'Perskaitytos knygos',
        navigationOption: {
            textAlign: 'center',
            justifyContent: 'center',

        }
    };

    componentWillMount() {

        this.displayData();

    }

    constructor(props) {
        super(props);
        const {params} = this.props.navigation.state;
        this.state = {

            author: params.author,
            name: params.name,


        };

    }


    displayData = async () => {
        const {params} = this.props.navigation.state;
        const nameStored = this.state.name;
        const authorStored = this.state.author;
        let answer = this.state.name;
        try {

            const storedName = await AsyncStorage.getItem(nameStored);
            const storedAuth = await AsyncStorage.getItem(authorStored);
            this.setState({answer});
            this.setState({storedName});
            this.setState({storedAuth});

        } catch (error) {
            Alert("klaida")
        }

    };


    render() {

        return (
            <View style={styles.container}>


                <View style={styles.box}>


                    <List style={styles.containerInside}>
                        {

                            <Text style={styles.ratingText}> Pavadinimas : {this.state.name} {'\n'}Autorius
                                : {this.state.author} </Text>

                        }
                        {
                            data.Knygos.map((u) =>
                                <Text style={styles.ratingText}>Pavadinimas : {u.name} {'\n'}Autorius
                                    : {u.author} {'\n'}
                                </Text>)
                        }


                    </List>

                </View>
            </View>

        );
    }
}
    class Books extends React.Component {

        static navigationOptions = {
            title: 'Knygu filtravimas',


        };

        constructor() {
            super();

            this.state = {
                dataSource: [],
                isLoading: true,
                result:''

            };
        }


        renderItem = ({item}) => {
            const  { navigate } = this.props.navigation;

            return (

                <View style={styles.box}>
                    <Image style={{width: 200, height: 401}}
                           source={{uri: item.image}}/>
                    <View>
                        <Text style={{fontWeight: 'bold', fontSize: 30}}>
                            {item.name}
                        </Text>
                        <Text style={{fontWeight: 'bold', fontSize: 20, justifyContent: 'space-between'}}>
                            {item.author}
                        </Text>
                        <Text style={{justifyContent: 'space-between'}}>
                            {item.about}
                        </Text>
                        <Image style={{width: 10, height: 10}}
                        />


                    </View>
                </View>
            )
        };


        componentDidMount() {
            return fetch('https://api.myjson.com/bins/1d0onq')
                .then((response) => response.json())
                .then((responseJson) => {

                    this.setState({
                        dataSource: responseJson.Knygos,
                        isLoading: false,

                    }, function () {

                    });

                })
                .catch((error) => {
                    console.error(error);
                });
        }


        render(){

            const {navigate} = this.props.navigation;
            return (
                this.state.isLoading
                    ?
                    <View style={{flex: 1, justifyContent: 'center', align: 'center'}}>
                        <ActivityIndicator size={100} color="#330066" animating/>
                    </View>:    <View>

                        <TouchableOpacity style={styles.button}>
                            <Text style={{border: 1, borderColor: 'black', fontSize: 20}}
                                  onPress={() => {
                                      return fetch('https://api.myjson.com/bins/m8tfi')
                                          .then((response) => response.json())
                                          .then((responseJson) => {

                                              this.setState({
                                                  dataSource: responseJson.Knygos,
                                                  isLoading: false,

                                              }, function () {

                                              });

                                          })
                                          .catch((error) => {
                                              console.error(error);
                                          });



                                  }}>Visos knygos
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.button}>
                            <Text style={{border: 5, borderColor: 'black', fontSize: 20}}
                                  onPress={() => {
                                          return fetch('https://api.myjson.com/bins/h6tqe?fbclid=IwAR0yRsIZ9v3GgAzCTUWgb-Lp6CeJJzmfSNE741aGBixSIy2Upwd4CLyRXfg')
                                              .then((response) => response.json())
                                              .then((responseJson) => {

                                                  this.setState({
                                                      dataSource: responseJson.Knygos,
                                                      isLoading: false,

                                                  }, function () {

                                                  });

                                              })
                                              .catch((error) => {
                                                  console.error(error);
                                              });



                                  }}>Fantastikos knygos
                            </Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.button}>
                            <Text style={{border: 5, borderColor: 'black', fontSize: 20}}
                                  onPress={() => {
                                      return fetch('https://api.myjson.com/bins/aeahq')
                                          .then((response) => response.json())
                                          .then((responseJson) => {

                                              this.setState({
                                                  dataSource: responseJson.Knygos,
                                                  isLoading: false,

                                              }, function () {

                                              });

                                          })
                                          .catch((error) => {
                                              console.error(error);
                                          });



                                  }}>Jaunimo knygos
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text style={{border: 5, borderColor: 'black', fontSize: 20}}
                                  onPress={() => {
                                      return fetch('https://api.myjson.com/bins/17spj2')
                                          .then((response) => response.json())
                                          .then((responseJson) => {

                                              this.setState({
                                                  dataSource: responseJson.Knygos,
                                                  isLoading: false,

                                              }, function () {

                                              });

                                          })
                                          .catch((error) => {
                                              console.error(error);
                                          });



                                  }}>Mokslinės knygos
                            </Text>
                        </TouchableOpacity>


                        <FlatList
                            data={this.state.dataSource}
                            renderItem={this.renderItem}
                        />

                    </View>

            );
        }

    }
class FadeInView extends React.Component {
    state = {
        fadeAim: new Animated.Value(0),  // Initial value for opacity: 0
    };

    componentDidMount() {
        Animated.timing(                  // Animate over time
            this.state.fadeAim,            // The animated value to drive
            {
                toValue: 1,                   // Animate to opacity: 1 (opaque)
                duration: 10000,              // Make it take a while
            }
        ).start();                        // Starts the animation
    }

    render() {
        let { fadeAim } = this.state;

        return (
            <Animated.View                 // Special animatable View
                style={{
                    ...this.props.style,
                    opacity: fadeAim,         // Bind opacity to animated value
                }}
            >
                {this.props.children}
            </Animated.View>
        );
    }
}





const NavigationApp = StackNavigator({
    Home: {screen: HomeScreen},
    Profile: {screen: ProfileScreen},
    AllBooks: {screen: BooksScreen},
    Books: {screen: Books},


});
export default class App extends Component<Props> {
    render() {
        return <NavigationApp />;

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        paddingHorizontal: 0,
    },
    containerInside: {
        padding: 10,
        height: 300,
        width: 500,

    },
    SearchBar:{
        height: 30,
        width: 500,
        borderWidth: 2,
        borderColor: '#000000',

    },
    button: {
        alignItems: 'center',
        backgroundColor: '#a86b75',
        padding: 5,

    },
    ratingText: {
        paddingLeft: 10,
        padding: 10,
        color: 'grey'
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        padding: 25,
        bottom: 10,
        borderWidth: 2,
        borderTopColor: '#F5FCFF',
        borderLeftColor: '#F5FCFF',
        borderRightColor: '#F5FCFF',
        borderBottomColor: 'red',

    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },

});