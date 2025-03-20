import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';

const ScannedListItem = (props) => {
  const index = props.index;
  const serialNo = props.serialNo;
  const productName = props.productName;
  const productCode = props.productCode;
  const batchCode = props.batchCode;
  const unique_code = props.unique_code;

  // Animation value for shaking effect
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startShaking();
  }, []);

  // Function to trigger shaking animation
  const startShaking = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }), // Reset position
    ]).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnim }] }]}>
      <View style={{ width: '10%' }}>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PoppinsTextMedium style={{ color: 'white', fontSize: 16 }} content={index}></PoppinsTextMedium>
        </View>
      </View>
      <View style={{ width: '76%' }}>
        <PoppinsTextMedium
          style={{ color: 'black', fontSize: 14, fontWeight: '600' }}
          content={`Serial No : ${serialNo}, Product Name : ${productName}, Product Code : ${productCode}`}
        ></PoppinsTextMedium>
      </View>
      <View style={{ width: '10%', marginLeft: 4 }}>
        <TouchableOpacity
          onPress={() => {
            props.handleDelete(unique_code);
          }}
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{ height: 30, width: 30, resizeMode: 'contain' }}
            source={require('../../../assets/images/delete.png')}
          ></Image>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '94%',
    minHeight: 80,
    maxHeight: 140,
    borderRadius: 8,
    marginTop: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    shadowColor: '#76758a',
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default ScannedListItem;
