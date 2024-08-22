import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseUrl } from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import CustomTextInput from '../../components/organisms/CustomTextInput';
import CustomTextInputNumeric from '../../components/organisms/CustomTextInputNumeric';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import { useGetLoginOtpMutation } from '../../apiServices/login/otpBased/SendOtpApi';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import ErrorModal from '../../components/modals/ErrorModal';
import { useGetNameMutation } from '../../apiServices/login/GetNameByMobile';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import { useIsFocused } from '@react-navigation/native';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Checkbox from '../../components/atoms/checkbox/Checkbox';
import { useFetchLegalsMutation } from '../../apiServices/fetchLegal/FetchLegalApi';
import * as Keychain from 'react-native-keychain';



const OtpLogin = ({ navigation, route }) => {
  const [mobile, setMobile] = useState("")
  const [name, setName] = useState("")
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState()
  const [error, setError] = useState(false)
  const [isChecked, setIsChecked] = useState(false);

  // fetching theme for the screen-----------------------

  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    
  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    
  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
   

  const icon = useSelector(state => state.apptheme.icon)
   

  // ------------------------------------------------
  const focused = useIsFocused()
  // send otp for login--------------------------------
  const [sendOtpFunc, {
    data: sendOtpData,
    error: sendOtpError,
    isLoading: sendOtpIsLoading,
    isError: sendOtpIsError
  }] = useGetLoginOtpMutation()

  const [getTermsAndCondition, {
    data: getTermsData,
    error: getTermsError,
    isLoading: termsLoading,
    isError: termsIsError
  }] = useFetchLegalsMutation()



  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError
    }
  ] = useGetNameMutation()

  const needsApproval = route.params.needsApproval;
  const user_type_id = route.params.userId;
  const user_type = route.params.userType;
  const registrationRequired = route.params.registrationRequired
  console.log("registrationRequired", registrationRequired, user_type)
  const width = Dimensions.get('window').width;
  const navigationParams = { "needsApproval": needsApproval, "user_type_id": user_type_id, "user_type": user_type, "mobile": mobile, "name": name }

  useEffect(() => {
    fetchTerms();
  }, [])

  useEffect(()=>{
    setMobile("")
  },[focused])

  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
    }
    else if (getTermsError) {
      console.log("gettermserror", getTermsError)
    }
  }, [getTermsData, getTermsError])



  useEffect(() => {
    if (sendOtpData) {
      console.log("data", sendOtpData)
      if (sendOtpData.success === true && mobile.length === 10) {
        navigation.navigate('VerifyOtp', { navigationParams })
      }
      else {
        console.log("Trying to open error modal")
      }
    }
    else if (sendOtpError) {
      console.log("err", sendOtpError)
      setError(true)
      setMessage(sendOtpError.data.message)
    }



  }, [sendOtpData, sendOtpError])

  useEffect(() => {
    if (getNameData) {
      console.log("getNameData", getNameData)
      if (getNameData.success) {
        setName(getNameData.body.name)
      }
    }
    else if (getNameError) {
      console.log("getNameError", getNameError)
    }
  }, [getNameData, getNameError])

  useEffect(() => {
    console.log("Name in use effect--------->>>>>>>>>>>>>>>",name)
  }, [name])

  useEffect(()=>{
    setName("")
    setMobile("")
  },[focused])

  const getMobile = data => {
    // console.log(data)
    setMobile(data)
    if (data !== undefined) {
      if (data.length === 10) {
        getNameFunc({ mobile: data })
        Keyboard.dismiss();
      }
    }

    

  };

  const fetchTerms = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      type: "term-and-condition"
    }
    getTermsAndCondition(params)
  }




  const getName = data => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    console.log("Data getting function", data)
    if (data !== undefined) {
   
        setName(data)
      
    
    }
  };

  const getCheckBoxData = (data) => {
    setIsChecked(data)
    console.log("Checkbox data", data)
  }

  const navigateToOtp = () => {
    sendOtpFunc({ mobile, name, user_type, user_type_id })
    // navigation.navigate('VerifyOtp',{navigationParams})
  }
  const handleButtonPress = () => {
    // console.log("first",getNameData.message)
    // console.log("mobile",mobile,name.length,name,isChecked,getNameData)
    if (isChecked) {
      if (getNameData && isChecked && name !== undefined && mobile !== undefined && name != "" && mobile.length !== 0 && name.length !== 0) {
        // console.log("mobile",mobile,name.length)
        if (getNameData.message === "Not Found") {
          console.log("registrationRequired", registrationRequired)
          if (mobile?.length == 10) {
            // registrationRequired ? navigation.navigate('BasicInfo', { needsApproval: needsApproval, userType: user_type, userId: user_type_id, name: name, mobile: mobile, navigatingFrom: "OtpLogin" }) : navigateToOtp()
            setError(true)
            setMessage("Please register before login")
          }
          else{
            setError(true)
            setMessage("Please enter your 10 digit mobile number")
          }
      
          
          // setName('')
          // setMobile('')
        }
        else {
          sendOtpFunc({ mobile, name, user_type, user_type_id })
          // navigation.navigate('VerifyOtp',{navigationParams})
        }

      }

      else {
        if (mobile?.length != 10) {
          setError(true)
          setMessage("Please enter your 10 digit mobile number")
        }

        else if (name == undefined || name == "") {

          setError(true)
          setMessage("Please enter name")
        }
      }
    }
    else{
      setError(true)
      setMessage("Please Accept Terms and condition")
    }

  }

  const modalClose = () => {
    setError(false)
  }
  return (
    <LinearGradient
      colors={["white", "white"]}
      style={styles.container}>


      <View style={{
        width: '100%', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
      }}>
        <View
          style={{
            height: 120,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: "ternaryThemeColor",
            flexDirection: 'row',
           

          }}>

          {/* <TouchableOpacity
            style={{ height: 50, alignItems: "center", justifyContent: 'center', position: "absolute", left: 10, top: 20 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{ height: 30, width: 25, resizeMode: 'contain' }}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity> */}
          <Image
            style={{
              height: 100,
              width: 150,
              resizeMode: 'contain',
              top: 0,
              position: "absolute",
              left: 20,
            }}
            source={require('../../../assets/images/Logo.png')}></Image>
            {/* <PoppinsTextMedium style={{fontSize:14,color:'white'}} content ="Don't have an account ?"></PoppinsTextMedium> */}
       
            
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
            width: '90%'
          }}>
          <PoppinsText
            style={{ color: 'black', fontSize: 28 }}
            content="Tell us your mobile number"></PoppinsText>

        </View>
        
            
          
      </View>


      <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: '100%' }}>
        <KeyboardAvoidingView>


          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}>
                <TextInputRectangularWithPlaceholder
              placeHolder="Mobile No"
              handleData={getMobile}
              maxLength={10}
              KeyboardType="numeric"
              specialCharValidation={true}
              validationType = "numeric"
            ></TextInputRectangularWithPlaceholder>

            <TextInputRectangularWithPlaceholder
              placeHolder="Name"
              handleData={getName}
              value={name}
              specialCharValidation={true}
            ></TextInputRectangularWithPlaceholder>
          </View>
          
        </KeyboardAvoidingView>
       
        

        <View
          style={{
            width: '100%',
            // marginTop: 20,
            marginBottom: 30,
            marginLeft: 10
          }}>
          <View style={{ flexDirection: 'row', marginHorizontal: 24, }}>
            <Checkbox CheckBoxData={getCheckBoxData} />
            <TouchableOpacity onPress={() => {
              navigation.navigate('PdfComponent', { pdf: getTermsData.body.data?.[0]?.files[0] })
            }}>
              <PoppinsTextLeftMedium content={"I agree to the Terms & Conditions"} style={{ color: '#808080', marginHorizontal: 30, marginBottom: 20, fontSize: 15, marginLeft: 8, marginTop: 16 }}></PoppinsTextLeftMedium>
            </TouchableOpacity>
          </View>


          {<ButtonNavigateArrow
            success={success}
            handleOperation={handleButtonPress}
            backgroundColor={buttonThemeColor}
            style={{ color: 'white', fontSize: 16 }}
            content="Login"
            navigateTo="VerifyOtp"
            navigationParams={navigationParams}
            mobileLength={mobile}
            isChecked={isChecked && mobile?.length == 10 && name != ""}
          ></ButtonNavigateArrow>}
  
          
  <View style={{alignItems:"center",justifyContent:'center',marginTop:40}}>
              
              <ButtonNavigate
              handleOperation={()=>{navigation.navigate("BasicInfo",{needsApproval: needsApproval, userType: user_type, userId: user_type_id, name: name, mobile: mobile, navigatingFrom: "OtpLogin" })}}
              backgroundColor="#353535"
              style={{ color: 'white', fontSize: 16, }}
              content="New Registration"
              navigateTo="BasicInfo"
              properties = {{needsApproval: needsApproval, userType: user_type, userId: user_type_id, name: name, mobile: mobile, navigatingFrom: "OtpLogin" }}
            >
            </ButtonNavigate>
           
      
         </View>

        </View>
        {error && <ErrorModal modalClose={modalClose} title="" message={message} openModal={error}></ErrorModal>}

        {/* {registrationRequired && <View style={{width:"100%",alignItems:'center',justifyContent:"center",marginTop:20}}>
        <PoppinsTextMedium style={{fontSize:18}} content ="Don't have an account ?"></PoppinsTextMedium>
        <ButtonNavigate
              handleOperation={handleNavigationToRegister}
              backgroundColor={buttonThemeColor}
              style={{color: 'white', fontSize: 16}}
              content="Register"
              >
        </ButtonNavigate>

        </View>} */}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  semicircle: {

    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  banner: {
    height: 184,
    width: '90%',
    borderRadius: 10,
  },
  userListContainer: {
    width: '100%',
    height: 600,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default OtpLogin;