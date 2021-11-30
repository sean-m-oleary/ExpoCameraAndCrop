import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native'
import {Camera} from 'expo-camera'
import {FlashMode} from "expo-camera/build/Camera.types";
import BarcodeMask from 'react-native-barcode-mask';
import {MaterialIcons} from '@expo/vector-icons';

let camera: Camera
export default function TabTwoScreen() {

    const windowHeight = useWindowDimensions().height;

    const [startCamera, setStartCamera] = React.useState(false)
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [capturedImage, setCapturedImage] = React.useState<any>(null)
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = React.useState(FlashMode.off)

    //work out dimensions for mask
    const desiredAspectRatio = 700/275;
    const heightToUse = windowHeight*0.75
    const widthToUse = heightToUse/desiredAspectRatio

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
        const photo: any = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        //setStartCamera(false)
        setCapturedImage(photo)
    }
    const __savePhoto = () => {
    }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode(FlashMode.off)
        } else if (flashMode === 'off') {
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
                        <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture}/>
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
                            <BarcodeMask width={widthToUse} height={heightToUse} showAnimatedLine={false} outerMaskOpacity={0.8}
                                         lineAnimationDuration={5000}/>

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

                                <TouchableOpacity key={"bolt"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__handleFlashMode}>
                                    <MaterialIcons name={flashMode === 'off' ? 'no-flash' : 'flash-on'} style={{fontSize: 30, color: 'purple', transform: [{ rotate: '90deg' }]}}/>
                                </TouchableOpacity>
                                <TouchableOpacity key={"photo-camera"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__takePicture}>
                                    <MaterialIcons name={"photo-camera"} style={{fontSize: 50, color: 'purple', transform: [{ rotate: '90deg' }]}}/>
                                </TouchableOpacity>
                                <TouchableOpacity key={"cancel"} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} onPress={__cancelCamera}>
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

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    console.log('sdsfds', photo)
    return (
        <View
            style={{
                backgroundColor: 'transparent',
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
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                            onPress={retakePicture}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                Re-take
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={savePhoto}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                Keep
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
