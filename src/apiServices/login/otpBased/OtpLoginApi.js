import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";

export const OtpLoginApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppLogin : builder.mutation({
            query({mobile,name,user_type_id,user_type,otp,fcm_token,app_version,language}){
                console.log("verifyOtpMutation", fcm_token,name)
                
                return {
                    url:`/api/app/userOtp/add`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "mobile" : mobile,
                        "name":name,
                        "otp" : otp,
                        "user_type_id" : user_type_id,
                        "user_type" : user_type,
                        "fcm_token":fcm_token,
                        "app_version": app_version,
                        "language" : language
                        
                    }
                    
                   
                }
            }
        })
    })
});


export const {useGetAppLoginMutation} = OtpLoginApi

