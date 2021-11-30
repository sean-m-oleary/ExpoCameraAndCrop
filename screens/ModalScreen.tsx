import {StatusBar} from 'expo-status-bar';
import * as React from 'react';
import {Alert, ImageBackground, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';

import {Text, View} from '../components/Themed';
import {Camera} from "expo-camera";
import {FlashMode} from "expo-camera/build/Camera.types";
import BarcodeMask from "react-native-barcode-mask";
import {MaterialIcons} from "@expo/vector-icons";

let camera: Camera
export default function ModalScreen() {

  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState(FlashMode.off)
    const [actionsDisabled, setActionsDisabled] = React.useState(false)

  //work out dimensions for mask
    const windowHeight = useWindowDimensions().height;
    const windowWidth = useWindowDimensions().width;
  const desiredAspectRatio = 700/275;
  const maskHeight = windowHeight*0.75
  const maskWidth = maskHeight/desiredAspectRatio

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __cancelCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(false)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
      setActionsDisabled(true)
    const photo: any = await camera.takePictureAsync()
      console.log('RAW', photo)
    setPreviewVisible(true)
      //TODO play sound
      //TODO show alert
      Alert.alert('Photo Taken', 'Please see the preview and retake or keep the photo...', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

    //setStartCamera(false)

      /*//crop it!
      const screenToPhotoRatio = photo.height / windowHeight
      const croppedPhoto = await manipulateAsync(
          photo.uri,
          [
              { crop: {height:maskHeight*screenToPhotoRatio, width:maskWidth*screenToPhotoRatio, originX:maskWidth*screenToPhotoRatio, originY:300} },
              //{ flip: FlipType.Vertical },
          ],
          { compress: 1, format: SaveFormat.PNG }
      );

      console.log('CROPPED', croppedPhoto)*/

    setCapturedImage(photo)
      setActionsDisabled(false)
  }
  const __savePhoto = () => {
      setStartCamera(false)
      setPreviewVisible(false)
      //save before setting null below...
      setCapturedImage(null)
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.off)
    } else if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.on)
    } else {
      setFlashMode(FlashMode.auto)
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType(Camera.Constants.Type.front)
    } else {
      setCameraType(Camera.Constants.Type.back)
    }
  }
  // @ts-ignore
  return (
      <View style={styles.container}>
        {startCamera ? (
            <View
                style={{
                  flex: 1,
                  width: '100%'
                }}
            >
              {previewVisible && capturedImage ? (
                  <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} maskWidth={maskWidth} maskHeight={maskHeight}/>
                  /*<CameraPreviewSmallAndRotated photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} maskWidth={maskWidth} maskHeight={maskHeight}/>*/
              ) : (
                  <>
                    {/*The Camera*/}
                    <Camera
                        type={cameraType}
                        flashMode={flashMode}
                        style={{flex: 1}}
                        ref={(r) => {
                          // @ts-ignore
                          camera = r
                        }}
                    />

                    {/*Mask*/}
                      <CameraMask maskWidth={maskWidth} maskHeight={maskHeight}/>

                    {/*Buttons*/}
                    <View style={
                      {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                        backgroundColor: '#FFFFFF',
                        flexDirection: 'row'
                      }
                    }>

                      <TouchableOpacity key={"bolt"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__handleFlashMode} disabled={actionsDisabled}>
                        <MaterialIcons name={flashMode === 'off' ? 'no-flash' : 'flash-on'} style={{fontSize: 30, color: 'purple', transform: [{ rotate: '90deg' }]}}/>
                      </TouchableOpacity>
                      <TouchableOpacity key={"photo-camera"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__takePicture} disabled={actionsDisabled}>
                        <MaterialIcons name={"photo-camera"} style={{fontSize: 50, color: 'purple', transform: [{ rotate: '90deg' }]}}/>
                      </TouchableOpacity>
                      <TouchableOpacity key={"cancel"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__cancelCamera} disabled={actionsDisabled}>
                        <MaterialIcons name={"cancel"} style={{fontSize: 30, color: 'purple', transform: [{ rotate: '90deg' }]}}/>
                      </TouchableOpacity>
                    </View>
                  </>
              )}
            </View>
        ) : (
            <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
            >
              <TouchableOpacity
                  onPress={__startCamera}
                  style={{
                    width: 130,
                    borderRadius: 4,
                    backgroundColor: '#14274e',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 80
                  }}
              >
                <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                >
                  Take picture
                </Text>
              </TouchableOpacity>
            </View>
        )}

        <StatusBar style="auto"/>
      </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const CameraMask = ({maskWidth, maskHeight} : any) =>{
    return (
        <BarcodeMask
            width={maskWidth}
            height={maskHeight}
            showAnimatedLine={false}
            outerMaskOpacity={0.8}
            edgeColor={'purple'}
            edgeWidth={60}
            edgeHeight={60} />
    );
}

const CameraPreviewSmallAndRotated = ({photo, retakePicture, savePhoto, maskWidth, maskHeight}: any) => {
    console.log('sdsfds', photo)
    return (
        <View
            style={{
                //flex: 1,
            }}
        >

                {/*<Image
                    source={{uri:photo && photo.uri}}
                    style={
                        {
                            flex:1,
                            borderWidth:2,
                            borderColor:'purple',
                            transform: [{ rotate: '-90deg' }],
                            margin:50
                        }
                    }
                    height={600}
                />*/}


            {/*Buttons*/}
            <View style={
                {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    backgroundColor: '#FFFFFF',
                    flexDirection: 'row'
                }
            }>

                <TouchableOpacity key={"photo-camera"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={retakePicture}>
                    <MaterialIcons name={"photo-camera"} style={{fontSize: 50, color: 'purple'}}/>
                    <Text style={{color:'purple'}}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity key={"check-circle"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={savePhoto}>
                    <MaterialIcons name={"check-circle"} style={{fontSize: 50, color: 'purple'}}/>
                    <Text style={{color:'purple'}}>Keep</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const CameraPreview = ({photo, retakePicture, savePhoto, maskWidth, maskHeight}: any) => {
  console.log('sdsfds', photo)
  return (
      <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%'
          }}
      >
        <ImageBackground
            source={{uri: photo && photo.uri}}
            style={{
              flex: 1
            }}
        />
          {/*Mask*/}
          <CameraMask maskWidth={maskWidth} maskHeight={maskHeight}/>

          {/*Buttons*/}
          <View style={
              {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 80,
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row'
              }
          }>

              <TouchableOpacity key={"photo-camera"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={retakePicture}>
                  <MaterialIcons name={"photo-camera"} style={{fontSize: 50, color: 'purple'}}/>
                  <Text style={{color:'purple'}}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity key={"check-circle"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={savePhoto}>
                  <MaterialIcons name={"check-circle"} style={{fontSize: 50, color: 'purple'}}/>
                  <Text style={{color:'purple'}}>Keep</Text>
              </TouchableOpacity>
          </View>

      </View>
  )
}
