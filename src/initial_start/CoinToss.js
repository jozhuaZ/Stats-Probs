import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

export const CoinToss = () => {
    const navigation = useNavigation();

    const playCoinToss = (side) => {
        const sides = ['Heads', 'Tails'];
        const coinResult = sides[Math.floor(Math.random() * 2)];
        
        const didPlayerWon = side === coinResult;
        const outcome = didPlayerWon ? 'You' : 'AI';

        console.log(didPlayerWon, " ", outcome);

        Alert.alert(
            'Coin Toss Result',
            `You picked ${side}.\nIt was ${coinResult}.\n${outcome} go first!`
        );

        setTimeout(() => {
            navigation.navigate('Game', { firstPlayer: outcome });
        }, 1000);
    }

    return (
        <View>
            <Text style={styles.title}>COIN TOSS</Text>
            <Text style={styles.title}>Select Your Pick!</Text>
            <TouchableOpacity onPress={() => playCoinToss('Heads')} style={styles.button}>
                <Image style={styles.image} source={require('../images/head.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playCoinToss('Tails')} style={styles.button}>
                <Image style={styles.image} source={require('../images/tail.png')} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#f8c146',
        padding: 8,
        borderRadius: 5,
        marginBottom: 20,
    },
    image: {
        height: 120,
        width: 120,
        marginHorizontal: 'auto'
    }
});