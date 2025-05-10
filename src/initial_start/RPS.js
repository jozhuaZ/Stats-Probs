import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

export const RPS = () => {
    const navigation = useNavigation();

    const playRPS = (playerChoice) => {
        const choices = ['Rock', 'Paper', 'Scissors'];
        const aiChoice = choices[Math.floor(Math.random() * 3)];
        let winner = 'Draw';
    
        if (
          (playerChoice === 'Rock' && aiChoice === 'Scissors') ||
          (playerChoice === 'Scissors' && aiChoice === 'Paper') ||
          (playerChoice === 'Paper' && aiChoice === 'Rock')
        ) {
          winner = 'You';
        } else if (playerChoice !== aiChoice) {
          winner = 'AI';
        }
        
        if (winner === 'Draw') {
            Alert.alert(`It's a Draw!`);
            return;
        }

        Alert.alert(`You picked ${playerChoice}AI picked ${aiChoice}. ${winner} go first!`);
        setTimeout(() => {
          navigation.navigate('Game', { firstPlayer: winner });
        }, 2500);
    }

    return (
        <View>
            <Text style={styles.title}>ROCK PAPER SCISSOR</Text>
            <Text style={styles.title}>Select Your Pick!</Text>
            <TouchableOpacity onPress={() => playRPS('Rock')} style={styles.button}>
                <Image style={styles.image} source={require('../images/rock.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playRPS('Paper')} style={styles.button}>
                <Image style={styles.image} source={require('../images/paper.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => playRPS('Scissors')} style={styles.button}>
                <Image style={styles.image} source={require('../images/scissors.png')} />
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
        marginHorizontal: 'auto',
        width: '50%'
    },
    image: {
        height: 120,
        width: 120,
        marginHorizontal: 'auto'
    }
}); 