import React, { useEffect, useState, useCallback , useRef } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Linking, Platform, Alert, ScrollView, PermissionsAndroid, AppState} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector, useDispatch } from 'react-redux';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from '@react-native-community/geolocation';
import { setLocation, setLocationPermissionStatus,setLocationEnabled } from '../../../redux/slices/userLocationSlice';
import { GoogleMapsKey } from "@env";
import { setCameraPermissionStatus } from '../../../redux/slices/cameraStatusSlice';
import { useIsFocused } from '@react-navigation/native';
const EnableLocationScreen = ({route,navigation}) => {
const appState = useRef(AppState.currentState);
const [appStateVisible, setAppStateVisible] = useState(appState.current);
const [locationPermission, setLocationPermissionEnabled] = useState(false)
    
  const [fetchLocation, setFetchLocation] = useState(false);
  const focused = useIsFocused()
  const message = route.params?.message;
  const dispatch = useDispatch();
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  ) 
  
  const locationEnabledd = useSelector((state)=>state.userLocation.locationEnabled)
  const locationPermissionStatus = useSelector((state)=>state.userLocation.locationPermissionStatus)

  console.log("EnableLocationScreen",locationEnabledd, locationPermissionStatus)
  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings().then(() => { });
    } else {
      Linking.openURL('app-settings:');
    }
  };

  const getLocationPermission = async () => {
    console.log("LocationServicesDialogBox")

    if (Platform.OS === 'ios') {
      Alert.alert(
        'GPS Disabled',
        'Please enable GPS/Location to use this feature. You can open it from the top sliding setting menu of your phone or from the setting section of your phone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Platform.OS === 'android' ? Linking.openSettings() : Linking.openURL('app-settings:') },
        ],
        { cancelable: false }
      );
    } else if (Platform.OS === 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2 style='color: #0af13e'>Use Location ?</h2>tibcon wants to change your device settings:<br/><br/>Enable location to use the application.<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true,
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: true,
        providerListener: false,
        style: {
          backgroundColor: "#DDDDDD",
          positiveButtonTextColor: 'white',
          positiveButtonBackgroundColor: "#298d7b",
          negativeButtonTextColor: 'white',
          negativeButtonBackgroundColor: '#ba5f5f',
        }
      }).then(success => {
        // handleCameraPermissions();
        
        // props.locationStatus(true);
        dispatch(setLocationPermissionStatus(true))
        dispatch(setLocationEnabled(true))
        setTimeout(() => {
        navigation.replace('QrCodeScanner')
            
        }, 800);
      }).catch(error => {
        // Handle error if needed
        // navigation.replace('QrCodeScanner')

        console.log("error",error)
      });
    }
  };

 

  const getLocation = useCallback(() => {
    console.log("getlocationFunction")
    Geolocation.getCurrentPosition(
      (res) => {
        const lat = res.coords.latitude;
        const lon = res.coords.longitude;
        const locationJson = {
          lat: lat || "N/A",
          lon: lon || "N/A",
        };

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;

        fetch(url)
          .then(response => response.json())
          .then(json => {
            if (json.status === "OK") {
              const formattedAddress = json?.results[0]?.formatted_address;
              locationJson.address = formattedAddress || "N/A";
              const addressComponent = json?.results[0]?.address_components;

              addressComponent.forEach(component => {
                if (component.types.includes("postal_code")) {
                  locationJson.postcode = component.long_name;
                } else if (component.types.includes("country")) {
                  locationJson.country = component.long_name;
                } else if (component.types.includes("administrative_area_level_1")) {
                  locationJson.state = component.long_name;
                } else if (component.types.includes("administrative_area_level_3")) {
                  locationJson.district = component.long_name;
                } else if (component.types.includes("locality")) {
                  locationJson.city = component.long_name;
                }
              });

              dispatch(setLocation(locationJson));
              dispatch(setLocationPermissionStatus(true))
            dispatch(setLocationEnabled(true))

              setTimeout(() => {
              navigation.replace('QrCodeScanner')
                
              }, 500);
            //   props.locationStatus(true);
            //   handleCameraPermissions();
            }
          })
          .catch(error => console.error("Error fetching location data: ", error));
      },
      (error) => {
        if (error.code === 1) {
          Alert.alert(
            "Alert",
            "To scan a QR code, the Tibcon app must have access permissions. Please grant access to the location.",
            [
              { text: "NO", onPress: () => { 
                // props.locationStatus(true); 
                 } },
              { text: "Yes", onPress: () => { openSettings(); } },
            ],
            { cancelable: false }
          );
        } else if (error.code === 2) {
          getLocationPermission();
        } else {
        //   props.locationStatus(true);
        }
      }
    );
  }, [fetchLocation]);

  
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
       
            // handleCameraPermissions()
        
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);
  
  useEffect(() => {
    
    getLocation();
  
}, [focused]);

 

  return (
    <ScrollView contentContainerStyle={{ height: '100%', width: '100%' }}>
      <View style={styles.container}>
        <PoppinsTextMedium style={styles.message} content={message}></PoppinsTextMedium>
        <Image resizeMode='contain' style={styles.image} source={require('../../../assets/images/deviceLocation.png')}></Image>

        {!locationEnabledd && !locationPermissionStatus &&  <PoppinsTextMedium style={{color:'black',fontSize:22,fontWeight:'700'}} content="Checking Location Access"></PoppinsTextMedium>}
        {locationEnabledd && locationPermissionStatus && <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:22,fontWeight:'700'}} content="Location Access Granted"></PoppinsTextMedium>}

        {!locationEnabledd && !locationPermissionStatus && <TouchableOpacity
          onPress={() => getLocation()}
          style={[styles.button, { backgroundColor: ternaryThemeColor }]}
        >
          <PoppinsTextMedium style={{...styles.buttonText,color:'white'}} content="Enable Device Location"></PoppinsTextMedium>
        </TouchableOpacity>}
        {!locationEnabledd && !locationPermissionStatus &&<TouchableOpacity
          onPress={() => {
            // props.locationStatus(true)
            // handleCameraPermissions()
            setTimeout(() => {
            navigation.replace('QrCodeScanner')

            }, 800);
        } }
          style={{...styles.button, ...styles.buttonOutline, borderColor: ternaryThemeColor }}
        >
          <PoppinsTextMedium style={{...styles.buttonText, color: ternaryThemeColor }} content="Continue Without Location"></PoppinsTextMedium>
        </TouchableOpacity>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  message: {
    color: 'black',
    fontSize: 22,
    marginBottom: 60,
    width: '80%',
    fontWeight: '600',
  },
  image: {
    height: '30%',
    width: '80%',
  },
  button: {
    height: 60,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 140,
  },
  buttonText: {
   
    fontSize: 19,
  },
  buttonOutline: {
    borderWidth: 1,
    marginTop: 16,
  },
});

export default EnableLocationScreen;
