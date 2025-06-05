import { PermissionsAndroid, Platform } from "react-native"
import Geolocation from "react-native-geolocation-service"

export const locationPermission =  ()=> new Promise(async (resolve, reject) =>{
    if(Platform.OS  === "ios"){
        try{
            const permissionsStatus = await Geolocation.requestAuthorization("whenInUse");
            if(permissionsStatus  === 'granted'){
                return resolve("granted")
            }
            reject("permission not granted")
        }catch(error){
            return reject(error)
        }
    }

    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
    ).then((granted) =>{
        if(granted  === PermissionsAndroid.RESULTS.GRANTED){
            resolve("granted");
        }
        return reject('Location Permission denied');
    }).catch((error)=>{
        console.log('Ask Location permission error: ', error);
        return reject(error)
    })
})