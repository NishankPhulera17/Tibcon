import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import CongratulationActionBox from "../../components/atoms/CongratulationActionBox";
import Win from "../../components/molecules/Win";
import ButtonSquare from "../../components/atoms/buttons/ButtonSquare";
import { useGetCouponOnCategoryMutation } from "../../apiServices/workflow/rewards/GetCouponApi";
import {
  useUserPointsEntryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import {
  useGetallWheelsByUserIdMutation,
  useCreateWheelHistoryMutation,
} from "../../apiServices/workflow/rewards/GetWheelApi";
import {
  useCheckQrCodeAlreadyRedeemedMutation,
  useAddCashbackEnteriesMutation,
} from "../../apiServices/workflow/rewards/GetCashbackApi";
import * as Keychain from "react-native-keychain";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import { slug } from "../../utils/Slug";
import { useAddRegistrationBonusMutation, useExtraPointEnteriesMutation } from "../../apiServices/pointSharing/pointSharingApi";
import { useAddBulkPointOnProductMutation } from "../../apiServices/bulkScan/BulkScanApi";
import { setQrIdList } from "../../../redux/slices/qrCodeDataSlice";
import  Celebrate  from "react-native-vector-icons/MaterialIcons";
import Error from "react-native-vector-icons/MaterialIcons"
import { useGetActiveMembershipMutation, useGetMembershipMutation, useGetTibconActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import ErrorModal from "../../components/modals/ErrorModal";
import FastImage from "react-native-fast-image";
import { useGetMappingDetailsByAppUserIdMutation } from "../../apiServices/userMapping/userMappingApi";
import { setFirstScan } from "../../../redux/slices/scanningSlice";
import MessageModal from "../../components/modals/MessageModal";
import { setShowCampaign } from "../../../redux/slices/campaignSlice";


const CongratulateOnScan = ({ navigation, route }) => {
  const [showBulkScanPoints, setShowBulkScanPoints] = useState();
  const [totalPoints, setTotalPoints] = useState(0)
  const [error,setError] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false);
  const buttonThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#ef6110";

  //  data from scanning qr code
  const dispatch = useDispatch();
  // product data recieved from scanned product
  const productData = useSelector((state) => state.productData.productData);
  const firstScan = useSelector((state) => state.scanning.firstScan)
  const registration_bonus = useSelector((state)=> state.scanning.registrationBonus)
  const pointSharingData = useSelector(
    (state) => state.pointSharing.pointSharing
  );
  const qrIdList = useSelector((state) => state.qrData.qrIdList);
  const qrData = useSelector((state) => state.qrData.qrData)[0];

  const userData = useSelector((state) => state.appusersdata.userData);
  // console.log("userData", `${userData.user_type}_points`, JSON.stringify(pointSharingData));
  
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  
  // getting location from redux state
  const location = useSelector((state) => state.userLocation.location);
 
  const height = Dimensions.get("window").height;
  // workflow for the given user
  const workflowProgram = route.params.workflowProgram;
  const rewardType = route.params.rewardType;
 
  const platform = Platform.OS === "ios" ? "1" : "2";

    const [
      addRegistrationBonusFunc,
      {
        data: addRegistrationBonusData,
        isLoading: addRegistrationBonusIsLoading,
        error: addRegistrationBonusError ,
        isError: addRegistrationBonusIsError,
      },
    ] = useAddRegistrationBonusMutation();

  const [
    getCouponOnCategoryFunc,
    {
      data: getCouponOnCategoryData,
      error: getCouponOnCategoryError,
      isLoading: getCouponOnCategoryIsLoading,
      isError: getCouponOnCategoryIsError,
    },
  ] = useGetCouponOnCategoryMutation();
  const [
    addBulkPointOnProductFunc,
    {
      data: addBulkPointOnProductData,
      error: addBulkPointOnProductError,
      isLoading: addBulkPointOnProductIsLoading,
      isError: addBulkPointOnProductIsError,
    },
  ] = useAddBulkPointOnProductMutation();

  const [
    getAllWheelsByUserIdFunc,
    {
      data: getAllWheelsByUserIdData,
      error: getAllWheelsByUserIdError,
      isLoading: getAllWheelsByUserIdIsLoading,
      isError: getAllWheelsByUserIdIsError,
    },
  ] = useGetallWheelsByUserIdMutation();

  const [
    createWheelHistoryFunc,
    {
      data: createWheelHistoryData,
      error: createWheelHistoryError,
      isLoading: createWheelHistoryIsLoading,
      isError: createWheelHistoryIsError,
    },
  ] = useCreateWheelHistoryMutation();

  const [
    checkQrCodeAlreadyRedeemedFunc,
    {
      data: checkQrCodeAlreadyRedeemedData,
      error: checkQrCodeAlreadyRedeemedError,
      isLoading: checkQrCodeAlreadyRedeemedIsLoading,
      isError: checkQrCodeAlreadyRedeemedIsError,
    },
  ] = useCheckQrCodeAlreadyRedeemedMutation();

  const [
    addCashbackEnteriesFunc,
    {
      data: addCashbackEnteriesData,
      error: addCashbackEnteriesError,
      isLoading: addCashbackEnteriesIsLoading,
      isError: addCashbackEnteriesIsError,
    },
  ] = useAddCashbackEnteriesMutation();


  useEffect(()=>{
    fetchRewardsAccToWorkflow()
  },[])


useEffect(() => {
  if (addRegistrationBonusData) {
    // console.log("addRegistrationBonusData", addRegistrationBonusData)
    if(addRegistrationBonusData?.success)
    {
      setSuccess(true)
      setMessage(addRegistrationBonusData?.message)
      dispatch(setFirstScan(false))
    }
  }
  else if (addRegistrationBonusError) {
    setError(true)
    setMessage("There was a problem in adding registration bonus")
    // console.log("addRegistrationBonusError", addRegistrationBonusError)
  }
}, [addRegistrationBonusData, addRegistrationBonusError])

  

const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;


  const fetchRewardsAccToWorkflow = async () => {
    // console.log("fetchRewardsAccToWorkflow",rewardType)
    let token;
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // console.log(
      //   "Credentials successfully loaded for user " + credentials.username
      // );

       token = credentials.username;
      }
      if (rewardType === "Static Coupon") {
        const params = {
          token: token,
          catId: productData.category_id,
          qr_code: qrData.unique_code,
        };
        getCouponOnCategoryFunc(params);
      } else if (rewardType === "Points On Product") {      
          const params = {
            data: {
              qrs: qrIdList,
              point_sharing: pointSharingData,
              platform_id: Number(platform),
              pincode:
                location.postcode === undefined ? "N/A" : location.postcode,
              platform: "mobile",
              state: location.state === undefined ? "N/A" : location.state,
              district:
                location.district === undefined ? "N/A" : location.district,
              city: location.city === undefined ? "N/A" : location.city,
              area: location.district === undefined ? "N/A" : location.district,
              known_name: location.city === undefined ? "N/A" : location.city,
              lat: location.lat === undefined ? "N/A" : String(location.lat),
              log: location.lon === undefined ? "N/A" : String(location.lon),
              method_id: 1,
              method: "Bulk Scan",
              token: token,
            },
            token: token,
          };
          console.log("addBulkPointOnProductFunc",JSON.stringify(params))
          addBulkPointOnProductFunc(params);
        
      } else if (rewardType === "Wheel") {
        const params = {
          token: token,
          id: userData.id.toString(),
        };
        getAllWheelsByUserIdFunc(params);
      } else if (rewardType === "Cashback") {
        const params = {
          token: token,
          qrId: qrData.id,
        };
        checkQrCodeAlreadyRedeemedFunc(params);
      }
   
  };

  // useEffect(() => {
  //  console.log("this use effect is being called")
  //  if(!calledOnce)
  //  {
  //   setCalledOnce(true)
  //  }
      
     
   
  // }, [membershipPercent]);

  useEffect(() => {
    if (addBulkPointOnProductData) {
      console.log(
        "addBulkPointOnProductData",
        JSON.stringify(addBulkPointOnProductData)
      );
      if (addBulkPointOnProductData.success) {
        let tp =0
        dispatch(setQrIdList([]));
        const bulkPoints = addBulkPointOnProductData.body.body.map((item, index) => {
          return item["points_on_product"];

        });
       
        setTotalPoints(addBulkPointOnProductData.body.total_points)
        setShowBulkScanPoints(bulkPoints);
        
        const checkFirstScan=async()=>{

   
          const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // console.log(
          //   'Credentials successfully loaded for user ' + credentials.username
          // );
          // console.log("First scan")
          const token = credentials.username
          const body = {
            tenant_id:slug,
            token: token,
            data: {
                    point_earned_through_type: "registration_bonus",
                    points: registration_bonus,
                    platform_id: Number(platform),
                    pincode: location?.postcode===undefined ? "N/A" :location?.postcode,
                    platform: 'mobile',
                    state: location?.state===undefined ? "N/A" :location?.state,
                    district: location?.district===undefined ? "N/A" : location?.district,
                    city: location?.city===undefined ? "N/A" :location?.city,
                    area: location?.district===undefined ? "N/A" :location?.district,
                    known_name: location?.city===undefined ? "N/A" :location?.city,
                    lat: location?.lat===undefined ? "N/A" :(String(location?.lat)).substring(0,10),
                    log: location?.lon===undefined ? "N/A" :(String(location?.lon)).substring(0,10),
                    method_id: "1",
                    method: "registration bonus",
            },
            
          }
          // console.log("Registration Bouns",body)
            if(!userData?.is_scanned)
            {
            //  addRegistrationBonusFunc(body)
            }
          } 
       
      }
     firstScan && checkFirstScan()
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 5000);
      }
    } else if (addBulkPointOnProductError) {
      console.log("addBulkPointOnProductError", addBulkPointOnProductError);
    }
  }, [addBulkPointOnProductData, addBulkPointOnProductError]);


  useEffect(() => {
    if (addCashbackEnteriesData) {
      // console.log("addCashbackEnteriesData", addCashbackEnteriesData);
      if (addCashbackEnteriesData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 1000);
      }
    } else if (addCashbackEnteriesError) {
      // console.log("addCashbackEnteriesError", addCashbackEnteriesError);
    }
  }, [addCashbackEnteriesData, addCashbackEnteriesError]);

  useEffect(() => {
    if (getAllWheelsByUserIdData) {
      
      createWheelHistory(getAllWheelsByUserIdData.body.data);
    } else if (getAllWheelsByUserIdError) {
      // console.log("getAllWheelsByUserIdError", getAllWheelsByUserIdError);
    }
  }, [getAllWheelsByUserIdData, getAllWheelsByUserIdError]);

  
  const createWheelHistory = async (data) => {
    // console.log("wheel history data", data);
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      token: token,
      body: {
        wc_id: data[0].wc_id,
        w_id: data[0].id,
        qr_id: qrData.id,
      },
    };
    createWheelHistoryFunc(params);
  };

  useEffect(() => {
    if (createWheelHistoryData) {
      // console.log("createWheelHistoryData", createWheelHistoryData);
      // if(createWheelHistoryData.success)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    } else if (createWheelHistoryError) {
      // console.log("createWheelHistoryError", createWheelHistoryError);
      // if(createWheelHistoryError.status===409)
      // {
      //   setTimeout(() => {
      //     handleWorkflowNavigation();
      //   }, 1000);
      // }
    }
  }, [createWheelHistoryData, createWheelHistoryError]);

  useEffect(() => {
    if (checkQrCodeAlreadyRedeemedData) {
      if (!checkQrCodeAlreadyRedeemedData.body) {
        addCashbackEnteries();
      } else if (checkQrCodeAlreadyRedeemedError) {
        // console.log(checkQrCodeAlreadyRedeemedError);
      }
    }
  }, [checkQrCodeAlreadyRedeemedData, checkQrCodeAlreadyRedeemedError]);

  const addCashbackEnteries = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      body: {
        app_user_id: userData.id.toString(),
        user_type_id: userData.user_type_id,
        user_type: userData.user_type,
        product_id: productData.product_id,
        product_code: productData.product_code,
        platform_id: Number(platform),
        pincode: location.postcode,
        platform: "mobile",
        state: location.state,
        district: location.district,
        city: location.city,
        area: location.state,
        known_name: location.city,
        lat: String(location.lat),
        log: String(location.lon),
        method_id: 1,
        method: "Cashback",
        cashback: "10",
      },

      token: token,
      qrId: qrData.id,
    };
    addCashbackEnteriesFunc(params);
  };

  useEffect(() => {
    if (getCouponOnCategoryData) {
      // console.log("getCouponOnCategoryData", getCouponOnCategoryData);
      if (getCouponOnCategoryData.success) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 3000);
      }
    } else if (getCouponOnCategoryError) {
      // console.log("getCouponOnCategoryError", getCouponOnCategoryError);
      if (getCouponOnCategoryError.status === 409) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 4000);
      } else if (
        getCouponOnCategoryError.data.message === "No Active Coupons Exist"
      ) {
        setTimeout(() => {
          handleWorkflowNavigation();
        }, 4000);
      }
    }
  }, [getCouponOnCategoryData, getCouponOnCategoryError]);


  const handleWorkflowNavigation = () => {

    if (workflowProgram[0] === "Static Coupon") {
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Warranty") {
      navigation.navigate("ActivateWarranty", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Points On Product") {
      // console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Cashback") {
      // console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Wheel") {
      // console.log(workflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity") {
      // console.log(workflowProgram.slice(1));
      navigation.navigate("Genuinity", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } else if (workflowProgram[0] === "Genuinity+") {
      // console.log(workflowProgram.slice(1));
      navigation.navigate("GenuinityScratch", {
        workflowProgram: workflowProgram.slice(1),
        rewardType: workflowProgram[0],
      });
    } 
  };
  const navigateDashboard = () => {
    dispatch(setShowCampaign(false))

    navigation.reset({ index: '0', routes: [{ name: 'Dashboard' }] })
  };
  const navigateQrScanner = () => {
    // navigation.navigate('EnableCameraScreen')
    handleWorkflowNavigation();
  };
  const modalClose = () => {
    setError(false);
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: buttonThemeColor,
      }}
    >
    {
    success && (
      <MessageModal
              modalClose={modalClose}
              title="Success"
              message={message}
              openModal={success}></MessageModal>
    )
  }
      <View
        style={{
          height: "8%",
          flexDirection: "row",
          position: "absolute",
          top: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              position: "absolute",
              left: 20,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{ color: "white", fontSize: 18, right: 10 }}
          content="Congratulations"
        ></PoppinsTextMedium>
      </View>

      {/* main view */}

      <View
        style={{
          height: "92%",
          width: "100%",
          backgroundColor: "white",
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          position: "absolute",
          bottom: 0,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <ScrollView
          style={{
            width: "100%",
            height: "100%",
            marginTop: 10,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <View
            style={{
              width: "100%",
              height: height - 100,
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 10,
              backgroundColor: "white",
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
            }}
          >
            {/* actions pperformed container----------------------------------- */}
            <View
              style={{
                padding: 20,
                width: "90%",
                backgroundColor: "white",
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#DDDDDD",
                marginTop: 50,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
              }}
            >
              <Image
                style={{
                  height: 70,
                  width: 70,
                  resizeMode: "contain",
                  margin: 10,
                }}
                source={require("../../../assets/images/gold.png")}
              ></Image>
              <PoppinsTextMedium
                style={{ color: "#7BC143", fontSize: 24, fontWeight: "700" }}
                content="Congratulations"
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{
                  color: "#333333",
                  fontSize: 20,
                  fontWeight: "500",
                  width: "60%",
                  marginTop: 6,
                }}
                content="You have successfully performed the action"
              ></PoppinsTextMedium>
              {/* action box ---------------------------------------------- */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {getCouponOnCategoryData && (
                  <CongratulationActionBox
                    title="Product Scanned"
                    data={[qrData].length}
                    primaryColor={buttonThemeColor}
                    secondaryColor={buttonThemeColor}
                  ></CongratulationActionBox>
                )}
                {/* {getCouponOnCategoryData &&<CongratulationActionBox title="Points Earned" data={productData.consumer_points} primaryColor={buttonThemeColor} secondaryColor={buttonThemeColor}></CongratulationActionBox>} */}
              </View>
              {/* -------------------------------------------------------- */}
            </View>
            {/* -------------------------------------------------------- */}
            {/* rewards container---------------------------------------------- */}
           {error &&  <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>}
            <View
              style={{
                padding: 10,
                width: "90%",
                backgroundColor: "#DDDDDD",
                borderRadius: 4,
                marginTop: 50,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <View
                style={{
                  height: 48,
                  width: 160,
                  backgroundColor: buttonThemeColor,
                  borderWidth: 1,
                  borderStyle: "dotted",
                  borderColor: "white",
                  borderRadius: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  bottom: 30,
                }}
              >
                <PoppinsTextMedium
                  style={{ fontSize: 16, fontWeight: "800", color: "white" }}
                  content="You Have Won"
                ></PoppinsTextMedium>
              </View>

              {/* reward user according to the workflow ------------------------*/}
              {showBulkScanPoints && (
                <Win data="Number of items scanned" title={showBulkScanPoints.length}></Win>

              )}
              {showBulkScanPoints && (
                <Win data="Total Points Earned" title={totalPoints}></Win>

                // <View
                //   style={{
                //     height: "90%",
                //     width: "90%",
                //     alignItems: "center",
                //     justifyContent: "center",
                //   }}
                // >
                //   <ScrollView
                //     style={{ height: "100%", width: "100%" }}
                //     horizontal={true}
                //   >
                //     {showBulkScanPoints.map((item, index) => {
                //       return (
                //         <View
                //           key={index}
                //           style={{
                //             height: 200,
                //             width: "30%",
                //             alignItems: "center",
                //             justifyContent: "center",
                //             borderWidth:1,
                //             borderRadius:8,
                //             marginRight:30,
                //             backgroundColor:"white",
                //             padding:10
                //           }}
                //         >
                //           {item !== null ? (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'

                //               }}
                //             >
                //               <Celebrate name="celebration" size={40} color={ternaryThemeColor}></Celebrate>
                //               <PoppinsTextMedium
                //                 content={`${String(item.points).substring(0,6)} Points have been added `}
                //                 style={{ color: "black", fontSize: 14,marginTop:20}}
                //               ></PoppinsTextMedium>
                //             </View>
                //           ) : (
                //             <View
                //               style={{
                //                 alignItems: "center",
                //                 justifyContent: "flex-start",
                //                 height:'80%'
                //               }}
                //             >
                //               <Error name="error" size={40} color={ternaryThemeColor}></Error>
                               
                //             <PoppinsTextMedium
                //               content="There was some problem with this scanned QR"
                //               style={{ color: "black", fontSize: 16,marginTop:20 }}
                //             ></PoppinsTextMedium>
                //             </View>

                //           )}
                //         </View>
                //       );
                //     })}
                //   </ScrollView>
                // </View>
              )}
              {getCouponOnCategoryData && (
                <Win
                  data="Coupons Earned"
                  title={getCouponOnCategoryData.body.brand}
                ></Win>
              )}
             
            
              {createWheelHistoryData && (
                <Win data="Wheel" title="You have got a spin wheel"></Win>
              )}
              {addCashbackEnteriesData && (
                <Win
                  data="Cashback"
                  title={addCashbackEnteriesData.body.cashback}
                ></Win>
              )}
             {( addBulkPointOnProductIsLoading) && <FastImage
                   style={{ width: 40, height: 40, alignSelf: 'center',justifyContent:'center' }}
                   source={{
                       uri: gifUri, // Update the path to your GIF
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />}

            </View>
          </View>
        </ScrollView>
        <View style={{ width: "100%", height: 80, backgroundColor: "white" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          ></View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ButtonSquare
              style={{ color: "white" }}
              content="Cancel"
              handleOperation={navigateDashboard}
            ></ButtonSquare>
            <ButtonSquare
              style={{ color: "white" }}
              content="Okay"
              handleOperation={navigateQrScanner}
            ></ButtonSquare>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CongratulateOnScan;
