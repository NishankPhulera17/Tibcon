import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { useGetAppUsersDataMutation } from '../../apiServices/appUsers/AppUsersApi';
import SelectUserBox from '../../components/molecules/SelectUserBox';
import { setAppUsers } from '../../../redux/slices/appUserSlice';
import { setAppUserType, setAppUserName, setAppUserId, setUserData, setId } from '../../../redux/slices/appUserDataSlice';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorModal from '../../components/modals/ErrorModal';
import { t } from 'i18next';

const SelectUser = ({ navigation }) => {
  const [listUsers, setListUsers] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    getData();
    getUsers();
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (getUsersData) {
      console.log("type of users", getUsersData?.body);
      dispatch(setAppUsers(getUsersData?.body));
      setListUsers(getUsersData?.body);
    } else if (getUsersError) {
      setError(true);
      setMessage("Error in getting profile data, kindly retry after sometime");
      console.log("getUsersError", getUsersError);
    }
  }, [getUsersData, getUsersError]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('loginData');
      if (jsonValue != null) {
        saveUserDetails(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log("Error is reading loginData", e);
    }
  };

  const saveUserDetails = (data) => {
    try {
      dispatch(setAppUserId(data?.user_type_id));
      dispatch(setAppUserName(data?.name));
      dispatch(setAppUserType(data?.user_type));
      dispatch(setUserData(data));
      dispatch(setId(data?.id));
      handleNavigation();
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleNavigation = () => {
    setTimeout(() => {
      navigation.navigate('Dashboard');
    }, 5000);
  };

  const primaryThemeColor = useSelector(state => state.apptheme.primaryThemeColor) || '#FF9B00';
  const secondaryThemeColor = useSelector(state => state.apptheme.secondaryThemeColor) || '#FFB533';
  const ternaryThemeColor = useSelector(state => state.apptheme.ternaryThemeColor) || '#FFB533';

  const otpLogin = useSelector(state => state.apptheme.otpLogin);
  const passwordLogin = useSelector(state => state.apptheme.passwordLogin);
  const manualApproval = useSelector(state => state.appusers.manualApproval);
  const autoApproval = useSelector(state => state.appusers.autoApproval);
  const registrationRequired = useSelector(state => state.appusers.registrationRequired);

  const width = Dimensions.get('window').width;

  return (
    <LinearGradient colors={["white", "white"]} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/Logo.png')}
          />
          <View style={[styles.headerTextContainer, { borderColor: ternaryThemeColor }]}>
            <PoppinsTextMedium style={styles.headerText} content={t('choose profile')} />
          </View>
        </View>
        <View style={styles.userListContainer}>
          {listUsers.map((item, index) => (
            <SelectUserBox
              key={index}
              navigation={navigation}
              otpLogin={otpLogin}
              passwordLogin={passwordLogin}
              autoApproval={autoApproval}
              manualApproval={manualApproval}
              registrationRequired={registrationRequired}
              color={ternaryThemeColor}
              image={item.user_type_logo}
              content={item.user_type}
              id={item.user_type_id}
            />
          ))}
        </View>
        <PoppinsTextMedium style={styles.footerText} content="Designed and developed by Genefied" />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  header: {
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 200,
    width: 240,
    resizeMode: 'contain',
    top: 60,
  },
  headerTextContainer: {
    width: '80%',
    alignItems: "center",
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    height: 60,
    marginTop: 40,
  },
  headerText: {
    color: '#171717',
    fontSize: 20,
    fontWeight: '700',
  },
  userListContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  footerText: {
    color: 'black',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default SelectUser;
