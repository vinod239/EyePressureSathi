import { ScrollView, StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, useWindowDimensions, TextInput, ActivityIndicator, Modal } from 'react-native'
import React, { useState } from 'react'
import Input from '../components/Input'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../components/Loader'
import CustomButton from '../components/CustomButton'


const NextAppointmentReminder = ({navigation}) => {
    const { width } = useWindowDimensions()

    const [appointmentTitle, setAppointmentTitle] = useState('')
    const [isDateVisible, setIsDateVisible] = useState(false)
    const [dateTime, setDateTime] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDateConfirm = date => {
        setDateTime(date)
        return handleHideDate()
    }

    const handleHideDate = () => {
        return setIsDateVisible(false)
    }

    const fetchNextAppointment = async () => {
        try {
            setLoading(true)
            const auth = await AsyncStorage.getItem('auth')
            const userProfile = JSON.parse(auth)

            const myHeaders = new Headers();
            myHeaders.append("Cookie", "PHPSESSID=1f7e5ea942425a2648dae890699bae59");

            const yearMonth = dateTime.toJSON().substring(0,7)
            const date = (+dateTime.toJSON().substring(0, 10).split('-')[2] + 1)

            const formdata = new FormData();
            formdata.append("appointment_title", appointmentTitle);
            // formdata.append("appointment_date", `${yearMonth}-${date} ${dateTime.toString().split(' ')[4]}`);
            formdata.append("appointment_date", `${dateTime.toJSON().split('T')[0]} ${dateTime?.toString().split(' ')[4]}`);
            formdata.append("email", userProfile?.user_email);
            formdata.append("reminder1", "");
            formdata.append("reminder2", "");
            
            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch("https://meduptodate.in/saathi/appointment_reminder.php", requestOptions)
                .then(response => response.json())
                .then(result => {
                    setLoading(false)
                    console.log('appointment',result)
                    if (result?.status === true) {
                        setDateTime('')
                        setAppointmentTitle('')
                        return alert(result?.message)
                    }
                    return alert(result?.message)
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/images/Background.png')} style={{ flex: 1, width: width, position: 'relative' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <View style={{ width: width, flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                        <Image source={require('../assets/images/eyepressurelogo.png')} style={{ width: 120, height: 120, }} resizeMode='cover' />
                    </View>
                    <View style={{ width: width, flex: 4, justifyContent: 'flex-start', paddingVertical: 10, alignItems: 'center' }}  >
                        <View style={{ width: width, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, }}  >
                            <Image source={require('../assets/images/Prescription.png')} style={{ width: 45, height: 45, }} resizeMode='cover' />
                            <Text style={{ color: "#253d95", fontSize: width / 17, paddingVertical: 4, }}>Next Appointment Reminder</Text>
                            <View style={{ borderBottomColor: '#253d95', borderBottomWidth: 3, width: width - 30, height: 4 }} />
                        </View>
                        <Input placeholder="Appointment Title" value={appointmentTitle} onChangeText={text => setAppointmentTitle(text)} />
                        <TouchableOpacity activeOpacity={0.8} style={[styles.input, { width: width - 30 }]} onPress={() => setIsDateVisible(true)}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#253d95', textAlign: 'center', }}>{dateTime === "" ? 'Appointment Date' : `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} style={{ width: width - 40, borderRadius: 30, backgroundColor: "#253d95", marginTop: 15 }} onPress={fetchNextAppointment}>
                            <Text style={{ fontSize: 24, fontWeight: '600', color: '#fff', textAlign: 'center', paddingVertical: 12, }}>ADD</Text>
                        </TouchableOpacity>
                        <CustomButton buttonText="BACK" length={40} marginTop={10} onPress={() => navigation.goBack(-1)}  backgroundColor="transparent" borderColor="#fff" color="#253d95" />
                    </View>
                </View>
            </ImageBackground>
            <DateTimePickerModal isVisible={isDateVisible}
                mode="datetime"
                minimumDate={new Date(new Date().toJSON().split('T')[0])}
                onConfirm={handleDateConfirm}
                onCancel={handleHideDate}
                isDarkModeEnabled={true}
            />
            <Loader loading={loading} />
        </View>

    )
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 6,
        paddingVertical: 16,
        overflow: 'hidden',
        textAlign: 'center',
        color: "#253d95",
        fontSize: 20,
        fontWeight: '600',
    },
})


export default NextAppointmentReminder