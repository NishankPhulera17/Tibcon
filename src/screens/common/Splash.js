
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, PermissionsAndroid, Platform, Alert, Linking, BackHandler } from 'react-native';
import { useGetAppThemeDataMutation } from '../../apiServices/appTheme/AppThemeApi';
import { useSelector, useDispatch } from 'react-redux'
import { setPrimaryThemeColor, setSecondaryThemeColor, setIcon, setIconDrawer, setTernaryThemeColor, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions, setIsOnlineVeriification, setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile, setExtraFeatures } from '../../../redux/slices/appThemeSlice';
import { setManualApproval, setAutoApproval, setRegistrationRequired, setAppVersion } from '../../../redux/slices/appUserSlice';
import { setPointSharing } from '../../../redux/slices/pointSharingSlice';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppUserType, setAppUserName, setAppUserId, setUserData, setId } from '../../../redux/slices/appUserDataSlice';
import messaging from '@react-native-firebase/messaging';
import { setFcmToken } from '../../../redux/slices/fcmTokenSlice';
import { setAppUsers, setAppUsersData } from '../../../redux/slices/appUserSlice';
import { useGetAppUsersDataMutation } from '../../apiServices/appUsers/AppUsersApi';
import Geolocation from '@react-native-community/geolocation';
import InternetModal from '../../components/modals/InternetModal';
import ErrorModal from '../../components/modals/ErrorModal';
import { setLocation, setLocationEnabled } from '../../../redux/slices/userLocationSlice';
import { GoogleMapsKey } from "@env"
import { useCheckVersionSupportMutation } from '../../apiServices/minVersion/minVersionApi';
import VersionCheck from 'react-native-version-check';
import LocationPermission from '../../components/organisms/LocationPermission';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { useGetAppDashboardDataMutation } from '../../apiServices/dashboard/AppUserDashboardApi';
import { setDashboardData } from '../../../redux/slices/dashboardDataSlice';
import { useGetAppUserBannerDataMutation } from '../../apiServices/dashboard/AppUserBannerApi';
import { setBannerData } from '../../../redux/slices/dashboardDataSlice';
import { useGetWorkflowMutation } from '../../apiServices/workflow/GetWorkflowByTenant';
import { setProgram, setWorkflow, setIsGenuinityOnly } from '../../../redux/slices/appWorkflowSlice';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import { setWarrantyForm, setWarrantyFormId } from '../../../redux/slices/formSlice';
import { useFetchLegalsMutation } from '../../apiServices/fetchLegal/FetchLegalApi';
import { setPolicy, setTerms } from '../../../redux/slices/termsPolicySlice';
import { useGetAppMenuDataMutation } from '../../apiServices/dashboard/AppUserDashboardMenuAPi.js';
import { setDrawerData } from '../../../redux/slices/drawerDataSlice';
import * as Keychain from 'react-native-keychain';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { setLocationCheckVisited, setLocationPermissionStatus } from '../../../redux/slices/userLocationSlice';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import { useInternetSpeedContext } from '../../Contexts/useInternetSpeedContext';
import { setSlowNetwork } from '../../../redux/slices/internetSlice';


const Splash = ({ navigation }) => {
  const dispatch = useDispatch()
  const focused = useIsFocused()
  const [connected, setConnected] = useState(true)
  const [isSlowInternet, setIsSlowInternet] = useState(false)
  const [locationStatusChecked, setLocationCheckVisited] = useState(false)
  const [locationBoxEnabled, setLocationBoxEnabled] = useState(false)
  const[userList,setUserList] = useState();
  const [fetchLocation, setfetchLocation] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [parsedJsonValue, setParsedJsonValue] = useState()
  const [minVersionSupport, setMinVersionSupport] = useState(false)
  const [dashboardDataLoaded, setDashboardDataLoaded] = useState(false)
  const [error, setError] = useState(false);
  const [checkedForInAppUpdate, setCheckedForInAppUpdate] = useState(false)
  const registrationRequired = useSelector(state => state.appusers.registrationRequired)
  const manualApproval = useSelector(state => state.appusers.manualApproval)
  // const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null);
  // const [gotLoginData, setGotLoginData] = useState()
  const isConnected = useSelector(state => state.internet.isConnected);
  let currentVersion;
  if(isConnected?.isConnected)

  {
     currentVersion = VersionCheck.getCurrentVersion();
    console.log("current version check",currentVersion)
    try{
      dispatch(setAppVersion(currentVersion))
    }
    catch(e){
      console.log("error in dispatching app version")
    }


  }
  // const gifUri = Image.resolveAssetSource(require('../../../assets/gif/Tibcon.gif')).uri;
  // generating functions and constants for API use cases---------------------
  const [
    getAppTheme,
    {
      data: getAppThemeData,
      error: getAppThemeError,
      isLoading: getAppThemeIsLoading,
      isError: getAppThemeIsError,
    }
  ] = useGetAppThemeDataMutation();

  const [getWorkflowFunc, {
    data: getWorkflowData,
    error: getWorkflowError,
    isLoading: getWorkflowIsLoading,
    isError: getWorkflowIsError
  }] = useGetWorkflowMutation()

  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError
  }] = useGetFormMutation()

  const [getBannerFunc, {
    data: getBannerData,
    error: getBannerError,
    isLoading: getBannerIsLoading,
    isError: getBannerIsError
  }] = useGetAppUserBannerDataMutation()

  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();

  const [getAppMenuFunc, {
    data: getAppMenuData,
    error: getAppMenuError,
    isLoading: getAppMenuIsLoading,
    isError: getAppMenuIsError
  }] = useGetAppMenuDataMutation()


  const [getDashboardFunc, {
    data: getDashboardData,
    error: getDashboardError,
    isLoading: getDashboardIsLoading,
    isError: getDashboardIsError
  }] = useGetAppDashboardDataMutation()


  const [getTermsAndCondition, {
    data: getTermsData,
    error: getTermsError,
    isLoading: termsLoading,
    isError: termsIsError
  }] = useFetchLegalsMutation();

  const [
    getMinVersionSupportFunc,
    {
      data: getMinVersionSupportData,
      error: getMinVersionSupportError,
      isLoading: getMinVersionSupportIsLoading,
      isError: getMinVersionSupportIsError
    }
  ] = useCheckVersionSupportMutation()



  const [getPolicies, {
    data: getPolicyData,
    error: getPolicyError,
    isLoading: policyLoading,
    isError: policyIsError
  }] = useFetchLegalsMutation();


  
  

  useEffect(() => {
    getUsers();
    
    console.log("currentVersion",currentVersion)
    if(isConnected.isConnected)
    {

    currentVersion &&  getMinVersionSupportFunc(String(currentVersion))

      const fetchTerms = async () => {
        // const credentials = await Keychain.getGenericPassword();
        // const token = credentials.username;
        const params = {
          type: "term-and-condition"
        }
        getTermsAndCondition(params)
      }
      fetchTerms()
    
    
      const fetchPolicies = async () => {
        // const credentials = await Keychain.getGenericPassword();
        // const token = credentials.username;
        const params = {
          type: "privacy-policy"
        }
         getPolicies(params)
      }
      fetchPolicies()
    }
   
  }, [])
  
  
  useEffect(() => {
    if (getTermsData) {
      // console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
      try{

        dispatch(setTerms(getTermsData.body.data?.[0]?.files[0]))
      }
      catch(e)
      {
        console.log("error in dispatching terms")
      }
    }
    else if (getTermsError) {
      // console.log("gettermserror", getTermsError)
    }
  }, [getTermsData, getTermsError])


  const removerTokenData =async()=>{
    await AsyncStorage.removeItem('loginData');
    setShowLoading(false)
    navigation.navigate("SelectUser")
  } 


  useEffect(() => {
    if (getDashboardData) {
      // console.log("getDashboardData", getDashboardData)
      if(parsedJsonValue)
      {
        try{
          dispatch(setAppUserId(parsedJsonValue.user_type_id))
      dispatch(setAppUserName(parsedJsonValue.name))
      dispatch(setAppUserType(parsedJsonValue.user_type))
      dispatch(setUserData(parsedJsonValue))
      dispatch(setId(parsedJsonValue.id))
      dispatch(setDashboardData(getDashboardData?.body?.app_dashboard))
        }
        catch(e)
        {
          console.log("error in dispatching parsedJsonValue")
        }
      
      setShowLoading(false)
      
      parsedJsonValue && getAppMenuFunc(parsedJsonValue?.token)
      
      console.log("all data in one console",{getFormData,getAppMenuData,getDashboardData,getWorkflowData,getBannerData,minVersionSupport})
      }
      
      
      
       
      

    }
    else if (getDashboardError) {

      // console.log("getDashboardError", getDashboardError)
      if(getDashboardError?.status == 401 )
      {
        removerTokenData()
      }
    }
  }, [getDashboardData, getDashboardError])

  useEffect(() => {
    if (getAppMenuData) {
      // console.log("getAppMenuData", JSON.stringify(getAppMenuData))
      if(parsedJsonValue)
      {
        const tempDrawerData = getAppMenuData.body.filter((item) => {
          return item.user_type === parsedJsonValue.user_type
        })
        try{
        tempDrawerData &&  dispatch(setDrawerData(tempDrawerData[0]))
        }
        catch(e)
        {
          console.log("error in dispatching drawer data")
        }
      getFormData && minVersionSupport && getAppMenuData && getDashboardData && getWorkflowData && getBannerData && navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })

      }
      
    }
    else if (getAppMenuError) {

      // console.log("getAppMenuError", getAppMenuError)
    }
  }, [getAppMenuData, getAppMenuError])

  useEffect(() => {
    if (getPolicyData) {
      // console.log("getPolicyData123>>>>>>>>>>>>>>>>>>>", getPolicyData);
      try{
      dispatch(setPolicy(getPolicyData?.body?.data?.[0]?.files?.[0]))
      }
      catch(e)
      {
        console.log("error in dispatching policy data")
      }
    }
    else if (getPolicyError) {
      setError(true)
      setMessage(getPolicyError?.message)
      console.log("getPolicyError>>>>>>>>>>>>>>>", getPolicyError)
      if(getPolicyError?.status == 401 )
      {
        removerTokenData()
      }
    }
  }, [getPolicyData, getPolicyError])

  useEffect(() => {
    if (getFormData) {
      // console.log("getFormData", getFormData?.body)
      try{
        dispatch(setWarrantyForm(getFormData?.body?.template))
        dispatch(setWarrantyFormId(getFormData?.body?.form_template_id))
        parsedJsonValue && getDashboardFunc(parsedJsonValue?.token)
      }
      catch(e)
      {
        console.log("Error in dispatching warranty forms")
      }
     


    }
    else if(getFormError) {
      console.log("getFormError", getFormError)
      setError(true)
      setMessage("Can't fetch forms for warranty.")
    }
  }, [getFormData, getFormError])

  useEffect(() => {
    if (getWorkflowData) {
      if (getWorkflowData?.length === 1 && getWorkflowData[0] === "Genuinity") {
        try{
          
          dispatch(setIsGenuinityOnly())
        }
        catch(e)
        {
          console.log("error in dispatching genuinity")
        }
      }
      const removedWorkFlow = getWorkflowData?.body[0]?.program.filter((item, index) => {
        return item !== "Warranty"
      })
      // console.log("getWorkflowData", getWorkflowData)
      try{
        dispatch(setProgram(removedWorkFlow))
        dispatch(setWorkflow(getWorkflowData?.body[0]?.workflow_id))

      }
      catch(e)
      {
        console.log("error in dispatching workflow and program")
      }
      const form_type = "2"
        parsedJsonValue && getFormFunc({ form_type:form_type, token:parsedJsonValue?.token })

    }
    else if(getWorkflowError) {
      console.log("getWorkflowError",getWorkflowError)
      setError(true)
      setMessage("Oops something went wrong")
    }
  }, [getWorkflowData, getWorkflowError])


  useEffect(() => {
    if (getBannerData) {
      // console.log("getBannerData", getBannerData?.body)
      const images = Object.values(getBannerData?.body).map((item) => {
        return item.image[0]
      })
      try{

        dispatch(setBannerData(images))
      }
      catch(e)
      {
        console.log("error in dispatching banner data")
      }
      setShowLoading(false)
      parsedJsonValue && getWorkflowFunc({userId:parsedJsonValue?.user_type_id, token:parsedJsonValue?.token })
    }
    else if(getBannerError){
      setError(true)
      setMessage("Unable to fetch app banners")
      console.log("getBannerError",getBannerError)
      if(getBannerError?.status == 401 )
      {
        removerTokenData()
      }
    }
  }, [getBannerError, getBannerData])

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const { responseTime, loading } = useInternetSpeedContext();

  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };
  const getLocationPermission = async () => {

    if (Platform.OS == 'ios') {
      Alert.alert(
        'GPS Disabled',
        'Please enable GPS/Location to use this feature. You can open it from the top sliding setting menu of your phone or from the setting section of your phone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'Settings', onPress: () => Platform.OS == 'android' ? Linking.openSettings() : Linking.openURL('app-settings:') },
        ],
        { cancelable: false }
      );
    }
    if (Platform.OS == 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2 style='color: #0af13e'>Use Location ?</h2>Tibcon wants to change your device settings:<br/><br/>Enable location to use the application.<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
        preventBackClick: true, // true => To prevent the location services popup from closing when it is clicked back button
        providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
        style: {
          backgroundColor: "#DDDDDD",
          positiveButtonTextColor: 'white',
          positiveButtonBackgroundColor: "#298d7b",
          negativeButtonTextColor: 'white',
          negativeButtonBackgroundColor: '#ba5f5f',


        }
      }).then(function (success) {
        // setLocationCheckVisited(true)
        try{

          dispatch(setLocationEnabled(true))
        }
        catch(e)
        {
          console.log("error in dispatching location enabled")
        }
        setfetchLocation(true)
         // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
      }).catch((error) => {
        try{

          dispatch(setLocationEnabled(false))
        }
        catch(e)
        {
          console.log("error in dispatching")
        }
        setLocationCheckVisited(true)


        // getLocationPermission()
        // error.message => "disabled"
      });
    }

  }

  useEffect(() => {

    let lat = ''
    let lon = ''

    

    // if (__DEV__) {
    //   setLocationCheckVisited(true)
    // }

    
      try {
        Geolocation.getCurrentPosition((res) => {
          lat = res.coords.latitude
          lon = res.coords.longitude
          // getLocation(JSON.stringify(lat),JSON.stringify(lon))
          let locationJson = {

            lat: lat === undefined ? "N/A" : lat,
            lon: lon === undefined ? "N/A" : lon,
          }
          // setLocationCheckVisited(true)

          var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res?.coords?.latitude},${res?.coords?.longitude}
              &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`

          fetch(url).then(response => response.json()).then(json => {


            if (json.status == "OK") {
              const formattedAddress = json?.results[0]?.formatted_address

              locationJson["address"] = formattedAddress === undefined ? "N/A" : formattedAddress
              const addressComponent = json?.results[0]?.address_components

            
            for (let i = 0; i <= addressComponent?.length; i++) {
              if (i === addressComponent?.length) {
                console.log("location json after iteration", locationJson)
                try{
                  dispatch(setLocationCheckVisited(true))
                  dispatch(setLocationPermissionStatus(true))
                  dispatch(setLocation(locationJson))

                }
                catch(e)
                {
                  console.log("error in dispatching location data")
                }
                setLocationCheckVisited(true)

                }
                else {
                  if (addressComponent[i].types.includes("postal_code")) {

                    locationJson["postcode"] = addressComponent[i]?.long_name
                  }
                  else if (addressComponent[i]?.types.includes("country")) {

                    locationJson["country"] = addressComponent[i]?.long_name
                  }
                  else if (addressComponent[i]?.types.includes("administrative_area_level_1")) {

                    locationJson["state"] = addressComponent[i]?.long_name
                  }
                  else if (addressComponent[i]?.types.includes("administrative_area_level_3")) {

                    locationJson["district"] = addressComponent[i]?.long_name
                  }
                  else if (addressComponent[i]?.types.includes("locality")) {

                    locationJson["city"] = addressComponent[i]?.long_name
                  }
                }

              }
            }



          })
        }, (error) => {
          console.log("location enabled error splash", error)
          setLocationCheckVisited(false)
          if (error.code === 1) {
            // Permission Denied
            // Geolocation.requestAuthorization()
            setLocationCheckVisited(true)
            try{

              dispatch(setLocationPermissionStatus(false))
            }
            catch(e)
            {
              console.log("error in dispatching location permission status")
            }

          } else if (error.code === 2) {
            // Position Unavailable
            // if (!locationBoxEnabled)
              getLocationPermission()
              

          } else {
            // Other errors
            Alert.alert(
              "Error",
              "An error occurred while fetching your location.",
              [
                { text: "OK", onPress: () => console.log("OK Pressed") }
              ],
              { cancelable: false }
            );
          }
        })

      }
      catch (e) {

      }

  }, [navigation,fetchLocation])

  useEffect(() => {
    getUsers();
    getAppTheme("Tibcon")
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        try{

          dispatch(setFcmToken(fcmToken))
        }
        catch(e)
        {
          console.log("error in dispatching fcm token")
        }
      }
    }
    checkToken()
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === "android") {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Geolocation Permission',
              message: 'Can we access your location?',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === 'granted') {
            return true;
          } else {
            return false;
          }
        }
        else {
          Geolocation.requestAuthorization()
        }

      } catch (err) {
        return false;
      }
    };
    requestLocationPermission()
    try{

      dispatch({ type: 'NETWORK_REQUEST' });
    }
    catch(e)
    {
      console.log("error in dispatching network request")
    }
  }, [])


  useEffect(() => {
    if (getMinVersionSupportData) {
      console.log("getMinVersionSupportData", getMinVersionSupportData)
      if (getMinVersionSupportData.success) {
        setMinVersionSupport(getMinVersionSupportData?.body?.data)
        if (!getMinVersionSupportData?.body?.data) {
          Alert.alert('Kindly update the app to the latest version', 'Your version of app is not supported anymore, kindly update', [
            
            {text: 'Update', onPress: () => Linking.openURL("https://play.google.com/store/apps/details?id=com.Tibcon")},
          ]);
        }
      }
      else{
        if(Object.keys(getMinVersionSupportData?.body)?.length==0)
        {
          Alert.alert('Kindly update the app to the latest version', 'Your version of app is not supported anymore, kindly update', [
            
            {text: 'Update', onPress: () => Linking.openURL("https://play.google.com/store/apps/details?id=com.Tibcon")},
          ]);
        }
      }
    }
    else if (getMinVersionSupportError) {
      // console.log("getMinVersionSupportError", getMinVersionSupportError)
    }
  }, [getMinVersionSupportData, getMinVersionSupportError])

  useEffect(() => {
      console.log("internet status", isConnected)
      setConnected(isConnected.isConnected)
      // setIsSlowInternet(isConnected.isInternetReachable)
      getUsers();
      try{

        dispatch(setAppVersion(currentVersion))
      }
      catch(e)
      {
        console.log("error in dispatching app version")
      }

       currentVersion && getMinVersionSupportFunc(String(currentVersion))
        getAppTheme("Tibcon")
        getData()
  },[isConnected,locationStatusChecked,minVersionSupport])
  
  useEffect(() => {
    if (getUsersData) {
      // console.log("getUsersData", getUsersData?.body);
      setUserList(getUsersData?.body)
      const appUsers = getUsersData?.body.map((item, index) => {
        return item.name
      })
      const appUsersData = getUsersData?.body.map((item, index) => {
        return {
          "name": item.name,
          "id": item.user_type_id
        }
      })
      try{

        dispatch(setAppUsers(appUsers))
        dispatch(setAppUsersData(appUsersData))
      }
      catch(e)
      {
        console.log("error in dispatching app user type")
      }

    } else if (getUsersError) {
      // console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);




  const getData = async () => {

    const jsonValue = await AsyncStorage.getItem('loginData');

    const parsedJsonValues = JSON.parse(jsonValue)

    const value = await AsyncStorage.getItem('isAlreadyIntroduced');

    if (value != null && jsonValue != null) {
      // value previously stored
      try {
        // console.log("parsedJsonValues",parsedJsonValues)
        setParsedJsonValue(parsedJsonValues)
        parsedJsonValues && getBannerFunc(parsedJsonValues?.token)
      }
      catch (e) {
        // console.log("Error in dispatch", e)
      }

      // console.log("isAlreadyIntroduced",isAlreadyIntroduced)
    }
    else {
      console.error("locationStatusChecked and min version support",locationStatusChecked, minVersionSupport)
      setShowLoading(false)
      if (value === "Yes") 
      {   
       __DEV__ && setLocationCheckVisited(true)
       setTimeout(() => {
       minVersionSupport  && navigation.navigate('OtpLogin',{ needsApproval: manualApproval.includes(userList?.[0].user_type),userType:userList?.[0]?.user_type,userId:userList?.[0]?.user_type_id, registrationRequired:registrationRequired}) 
        
       }, 1000);
      }
      else 
      {
       minVersionSupport  && navigation.navigate('Introduction') 
      }
      // console.log("isAlreadyIntroduced",isAlreadyIntroduced,gotLoginData)

    }

  };






  // calling API to fetch themes for the app


  // fetching data and checking for errors from the API-----------------------
  useEffect(() => {
    if (getAppThemeData) {
      // console.log("getAppThemeData", JSON.stringify(getAppThemeData?.body))
      try{
        dispatch(setPrimaryThemeColor(getAppThemeData?.body?.theme?.color_shades["600"]))
        dispatch(setSecondaryThemeColor(getAppThemeData?.body?.theme?.color_shades["400"]))
        dispatch(setTernaryThemeColor(getAppThemeData?.body?.theme?.color_shades["700"]))
        dispatch(setIcon(getAppThemeData?.body?.logo[0]))
        dispatch(setIconDrawer(getAppThemeData?.body?.logo[0]))
        dispatch(setOptLogin(getAppThemeData?.body?.login_options?.Otp.users))
        dispatch(setPasswordLogin(getAppThemeData?.body?.login_options?.Password.users))
        dispatch(setButtonThemeColor(getAppThemeData?.body?.theme?.color_shades["700"]))
        dispatch(setManualApproval(getAppThemeData?.body?.approval_flow_options?.Manual.users))
        dispatch(setAutoApproval(getAppThemeData?.body?.approval_flow_options?.AutoApproval.users))
        dispatch(setRegistrationRequired(getAppThemeData?.body?.registration_options?.Registration?.users))
        dispatch(setColorShades(getAppThemeData?.body?.theme.color_shades))
        dispatch(setKycOptions(getAppThemeData?.body?.kyc_options))
        dispatch(setPointSharing(getAppThemeData?.body?.points_sharing))
        dispatch(setSocials(getAppThemeData?.body?.socials))
        dispatch(setWebsite(getAppThemeData?.body?.website))
        dispatch(setCustomerSupportMail(getAppThemeData?.body?.customer_support_email))
        dispatch(setCustomerSupportMobile(getAppThemeData?.body?.customer_support_mobile))
        dispatch(setExtraFeatures(getAppThemeData?.body?.addon_features))
        if (getAppThemeData?.body?.addon_features?.kyc_online_verification !== undefined) {
          if (getAppThemeData?.body?.addon_features?.kyc_online_verification) {
            dispatch(setIsOnlineVeriification())
          }
        }
        getData()
      }
      catch(e)
      {
        console.log("error in dispatch getappThemeData",e)
      }
    
    }
    else if (getAppThemeError) {
      // console.log("getAppThemeError", getAppThemeError)
    }
   
  }, [getAppThemeData,getAppThemeError,locationStatusChecked,connected])

  // in app update code 

  // useEffect(()=>{
  //   if(!checkedForInAppUpdate)
  //   {
  //     const inAppUpdates = new SpInAppUpdates(
  //       false // isDebug
  //     );
  //     // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
  //   inAppUpdates.checkNeedsUpdate({ curVersion: '0.0.8' }).then((result) => {
  //     if (result.shouldUpdate) {
  //       let updateOptions = {};
  //       if (Platform.OS === 'android') {
  //         // android only, on iOS the user will be promped to go to your app store page
  //         updateOptions = {
  //           updateType: IAUUpdateKind.IMMEDIATE,
  //         };
  //       }
  //       inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
  //     }
  //   });
  //   setCheckedForInAppUpdate(true)
  //   }
    
  // },[])

  //------------------------------------------------------------------

  // checking response time from google api

  useEffect(()=>{
    console.log("responseTime" ,responseTime)
    if(responseTime>2000)
    {
      setIsSlowInternet(true)
    }
    if(responseTime<2000)
    {
      setIsSlowInternet(false)
    }
  },[responseTime,connected])

//---------------------------------------

  const modalClose = () => {
    setError(false);
  };
  const NoInternetComp = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '90%',zIndex:1 }}>
        <Text style={{ color: 'black' }}>No Internet Connection</Text>
        <Text style={{ color: 'black' }}>Please check your internet connection and try again.</Text>
      </View>
    )
  }
  const SlowInternetComp = () => {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '90%' }}>
        <Text style={{ color: 'black' }}>Slow Internet Connection Detected</Text>
        <Text style={{ color: 'black' }}>Please check your internet connection. </Text>
      </View>
    )
  }


  // console.log("internet connection status",connected)
  return (
    
      <ImageBackground resizeMode='stretch' style={{  height: '100%', width: '100%', alignItems:'center',justifyContent:'center' }} source={require('../../../assets/images/splash3.png')}> 
      {/* <InternetModal visible={!connected} comp = {NoInternetComp} /> */}
      {/* {isSlowInternet && <InternetModal visible={isSlowInternet} comp = {SlowInternetComp} /> } */}

     
      {error &&  <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      }
      {/* <Image  style={{ width: 200, height: 200,  }}  source={require('../../../assets/gif/Tibcongif.gif')} /> */}
        {
      
       
      <View style={{position:'absolute',bottom:30,height:40}}> 
      <View>
      {/* {loading ? (
        <Text>Loading...</Text>
      ) : (
        
        <Text>Response Time: {responseTime} ms</Text>
      )} */}
    </View>
      <ActivityIndicator size={'medium'} animating={true} color={MD2Colors.yellow800} />
      <PoppinsTextMedium style={{color:'white',marginTop:4}} content="Please Wait"></PoppinsTextMedium>

      </View>
        }
       </ImageBackground> 

   


  );
}

const styles = StyleSheet.create({})

export default Splash;