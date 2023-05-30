import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Drawer } from 'react-native-paper';

function MenuEstudiante({navigation}){
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Revision" component={NotificationsScreen} />
                <Drawer.Screen name="Evaluaciones" component={NotificationsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}