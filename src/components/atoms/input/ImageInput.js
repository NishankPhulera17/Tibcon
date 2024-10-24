import React, { useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ImageInput = (props) => {
    const [image,setImage] = useState()
    const data=props.data
    const action = props.action

    const handleOpenImageGallery = async () => {
        const result = await launchImageLibrary();
        console.log(result.assets[0].uri)
        setImage(result.assets[0])
        let tempJsonData ={...props.jsonData,"value":result.assets[0].uri}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
      };
    return (
        <View style={{width:'100%',alignItems:"center",justifyContent:"center",marginBottom:20}}>
            {image && <Image style={{width:200,height:200,resizeMode:"center"}} source={{uri:image.uri}}></Image>}
        <TouchableOpacity onPress={()=>{
            handleOpenImageGallery()
        }} style={{flexDirection:'row',width:'86%',alignItems:"center",justifyContent:"center",borderWidth:1,height:50,borderColor:'#DDDDDD',marginTop:20}}>
            <View style={{width:'60%',height:50,alignItems:'center',justifyContent:"center"}}>
               {image ? <PoppinsTextMedium style={{color:'black'}} content ={image.fileName.slice(0,20)}></PoppinsTextMedium> : <PoppinsTextMedium style={{color:'black'}} content ={data}></PoppinsTextMedium>}
            </View>
            <View style={{width:'40%',height:50,backgroundColor:'#D6D6D6',alignItems:"center",justifyContent:"center"}}>
                <PoppinsTextMedium style={{color:'black'}} content ={action}></PoppinsTextMedium>
            </View>
        </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({})

export default ImageInput;
