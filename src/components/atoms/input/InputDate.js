import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker'
import DateIcon from 'react-native-vector-icons/MaterialIcons'
import PoppinsText from '../../electrons/customFonts/PoppinsText';
import moment from 'moment';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';

const InputDate = (props) => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(false)
    console.log(moment(date).format('YYYY-MM-DD'))
    const data =props.data
    const title = props.title
    
    const handleInputEnd=(date,title)=>{
      
      console.log(date,title)
      let tempJsonData ={...props.jsonData,"value":moment(date).format("YYYY-MM-DD")}
      props.handleData(tempJsonData)
  }

    return (
        <TouchableOpacity onPress={()=>{
            setOpen(true)
        }} style={{height:54,width:'86%',backgroundColor:'#0000000D',borderRadius:2,borderColor:'#DDDDDD',alignItems:'center',justifyContent:"center",flexDirection:'row',margin:20}}>
           
           {selected ? (<PoppinsTextMedium style={{position:'absolute',left:20,color:'black'}} content={moment(date).format('DD/MM/YYYY')}></PoppinsTextMedium>) : (<PoppinsTextMedium style={{position:'absolute',left:20,color:'black'}} content={data===null ? "Please select date":data}></PoppinsTextMedium>)
            
           }
            <View style={{position:"absolute",right:10}}>
            <DateIcon name="date-range" color="#DDDDDD" size={30}></DateIcon>
            </View>
            <DatePicker
        modal
        open={open}
        date={date}
        mode='date'
        maximumDate={new Date()}
        onConfirm={(date) => {
          setSelected(true)
          setOpen(false)
          setDate(date)
          handleInputEnd(date,title)
        }}
        onCancel={() => {
          setOpen(false)
          setSelected(false)
        }}
      />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default InputDate;
