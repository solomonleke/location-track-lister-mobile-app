import { Platform, StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9",

    },
    image:{
        color:'red',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: "#eee",
        opacity: 0.94,

    },
    modalText: {
        color: "#000",
        fontSize: 25,
        fontWeight: "700",
        marginTop: 20
    },

    modalView: {
        margin: 20,
        width: "80%",
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    body: {
        backgroundColor: "#fff",
        flex: 1
    },
    button: {
        backgroundColor: "#622cfc",
        color: "#fff",
        marginTop: 2,
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        zIndex: 1
    },
    btn: {
        backgroundColor: "#622cfc",
        color: "#fff",
        marginTop: 10,
        paddingVertical: Platform.OS  === "ios" ? 15: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "100%",
        alignSelf: "center",
        // marginTop: 22,
        marginBottom: 11
    },
    whiteText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },
    header: {
        position: "relative",
        left: 58,
        top: -75
    },

    wrapper: {
        paddingHorizontal: 20,
        marginTop: Platform.OS  === "ios" ? -160: -200,
        marginBottom: 32
    },
    text: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000000"
    },
    textCenter: {
        fontSize: 20,
        fontWeight: "700",
        color: "#000000",
        textAlign: "center"
    },
    textCenterTin: {
        fontSize: 16,
        fontWeight: "400",
        color: "#000000",
        textAlign: "center",
        marginTop: 10
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000000",
    },
    card: {
        // borderColor: "#622cfc",
        borderRadius: 10,
        borderWidth: 0,
        padding: 10,
        marginTop: 32

    },
    formBody: {
        marginTop: 5

    },
    input: {
        borderWidth: 1.5,
        borderColor:'#eee',
        borderRadius: 8,
        paddingVertical: Platform.OS  === "ios" ? 12: 8 ,
        paddingHorizontal: 10,
        fontSize: 17
    },
    show: {
        backgroundColor: "#622cfc",
        color: "#fff",
        marginTop: 2,
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: "25%",
        alignSelf: "flex-end",
        marginTop: Platform.OS  === "ios" ? -45: -47

    },
    showText: {
        color: "#fff",
        alignSelf: "center",
        fontWeight: "700",
        fontSize: 16



    },
    forgetPass: {
        color: "#622cfc",
        alignSelf: "flex-end",
        marginTop: 5,
        fontSize: 15,
        fontWeight: "700"

    },
    checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    checkbox: {
        alignSelf: 'center',
    },
    label: {
        margin: 8,
    },
    border: {
        borderTopColor: "#000",
        padding: 20,
        borderTopWidth: 2,
        marginTop: 32

    },
    or: {
        backgroundColor: "#fff",
        color: "#000",
        fontSize: 20,
        width: "20%",
        alignSelf: "center",
        textAlign: "center",
        marginTop: -36,
        fontWeight: "400"



    },
    centerText: {
        marginTop: 13,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "400"
    },
    baseColor: {
        color: "#622cfc",
    },
    verifyImg: {
        alignSelf: "center",
        marginTop: 32
    },
    emailText: {

        textAlign: "center",
        marginTop: 32,
        fontSize: 20,
        fontWeight: "400",
        marginBottom: 32

    },
    codeSent: {
        textAlign: "center",
        marginTop: 32,
        fontSize: 20,
        fontWeight: "800",
        color: "#622cfc"
    },
    resendText: {
        textAlign: "center",
        marginTop: 32,
        fontSize: 20,
        fontWeight: "700",
        color: "#622cfc"
    },
    gps: { 
        marginTop: 62,
        fontWeight: "bold"
    }
});
