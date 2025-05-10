import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function RulesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📜 Objective</Text>
        <Text style={styles.text}>
          - The goal is to capture the King card from your opponent. Use your Catchers wisely to make the right choice!
          {'\n'} - Capture all Catcher card to win! The King does not stand a chance when he does not have his own Catchers!
        </Text>

        <Text style={styles.title}>📏 Rules</Text>
        <Text style={styles.text}>
          • Each player has 7 cards:
          {'\n'}  - 2 Catchers: allow you to guess and pick one of the opponent's cards.
          {'\n'}  - 1 King: avoid losing this — if it's picked, you lose.
          {'\n'}  - 4 NPCs: filler cards with no special role.
        </Text>

        <Text style={styles.text}>
          • You can only attempt to capture the King if you still have a Catcher.
          {'\n'}• You only get 1 attempt per turn.
          {'\n'}• If you pick the opponent's King, you win!
          {'\n'}• If your King is captured, you lose.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#f8c146',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#f0f0f0',
    marginBottom: 20,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#f8c146',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#1b1b1b',
  },
});
