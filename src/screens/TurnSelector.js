import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { CoinToss } from '../initial_start/CoinToss';
import { RPS } from '../initial_start/RPS';

export default function TurnSelectorScreen({ navigation }) {
    const [game, setGame] = useState('');

    return (
        <ImageBackground
            source={require('../images/bg_turn.jpg')} 
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
            {(() => {
                switch (game) {
                    case  '':
                        return (
                            <>
                                <Text style={styles.title}>Choose How to Decide First Turn</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setGame('CoinToss')}>
                                    <Text style={styles.buttonText}>Coin Toss</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => setGame('RPS')}>
                                    <Text style={styles.buttonText}>Rock Paper Scissor</Text>
                                </TouchableOpacity>
                            </>
                        );
                    case 'CoinToss':
                        return (
                            <>
                                <CoinToss />
                            </>
                        );
                        case 'RPS':
                            return (
                                <RPS />
                            );
                        }
                    }
                )()}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        color: 'white',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#f8c146',
        borderRadius: 5,
        padding: 8,
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center'
    }
});
