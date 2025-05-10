import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const generateHand = () => {
  const cards = ['Catcher', 'Catcher', 'King', 'NPC', 'NPC', 'NPC', 'NPC'];
  return shuffle([...cards]);
};

const shuffle = (arr) => {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

const updateHand = (hand, index) => {
  const updated = [...hand];
  updated[index] = null;
  return updated;
};

export default function GameScreen({ route, navigation }) {
  const { firstPlayer } = route.params;
  const [playerHand, setPlayerHand] = useState([]);
  const [aiHand, setAiHand] = useState([]);
  const [playerCatchers, setPlayerCatchers] = useState(2);
  const [aiCatchers, setAiCatchers] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [showTurnMessage, setShowTurnMessage] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const [selectedCard, setSelectedCard] = useState(null);
  const [showWindow, setShowWindow] = useState(false);
  const [winProbability, setWinProbability] = useState({
    kingCapture: 0,
    npcCapture: 0,
    catcherCapture: 0,
  });

  useEffect(() => {
    // Initialize hands
    const pHand = generateHand();
    const aHand = generateHand();

    setPlayerHand(pHand);
    setAiHand(aHand);
    setCurrentTurn(firstPlayer);
    setShowTurnMessage(true);

    // Delay to show turn message
    setTimeout(() => {
      setShowTurnMessage(false);

      if (firstPlayer === 'AI') {
        setTimeout(() => {
          aiTurn(pHand); // Pass hand explicitly if needed
        }, 500); // small delay for better UX
      }
    }, 1000);
  }, [firstPlayer]); // Added firstPlayer to dependency array to handle potential re-renders

  useEffect(() => {
    if (aiCatchers <= 0 && !gameOver) {
      setGameOver(true);
      Alert.alert(`You Won!\nOpponent ran out of Catchers.`, '', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    } else if (playerCatchers <= 0 && !gameOver) {
      setGameOver(true);
      Alert.alert(`You Lose!\nYou ran out of Catchers.`, '', [
        { text: 'OK', onPress: () => navigation.navigate('Home') },
      ]);
    }
  }, [aiCatchers, playerCatchers, gameOver, navigation]);

  // Animated selected card to center and enlarge
  const animateCard = (onFinish) => {
    animationValue.setValue(0);
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setTimeout(() => onFinish(), 300);
    });
  };

  const attemptCapture = (index) => {
    if (currentTurn !== 'You' || playerCatchers <= 0 || gameOver) return;

    const card = aiHand[index];

    // Set selected card for animation display
    setSelectedCard(card);

    animateCard(() => {
      setSelectedCard(null); // Hide animated card after it's done

      if (card === 'King') {
        Alert.alert('You Win!', 'You captured the King!', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
        setGameOver(true);
      } else {
        if (card === 'Catcher') {
          setAiCatchers((prev) => prev - 1);
        }
        setAiHand((prev) => updateHand(prev, index));

        Alert.alert('Missed!', `You picked ${card}.`, [
          {
            text: 'Continue',
            onPress: () => {
              setCurrentTurn('AI');
              setTimeout(() => aiTurn(), 500);
            },
          },
        ]);
      }
    });
  };

  const aiTurn = (hand = playerHand) => {
    if (aiCatchers <= 0 || gameOver) return;

    setIsThinking(true); // Show "AI is thinking..."

    const validIndexes = hand
      .map((card, i) => (card !== null ? i : null))
      .filter((i) => i !== null);

    if (validIndexes.length === 0) {
      setIsThinking(false);
      return;
    }

    setTimeout(() => {
      const randomIndex = validIndexes[Math.floor(Math.random() * validIndexes.length)];
      const card = hand[randomIndex];

      setIsThinking(false); // Hide the message after AI makes a choice

      if (!card) return; // Defensive check

      if (card === 'King') {
        Alert.alert('You Lose!', 'The AI captured your King.', [
          { text: 'OK', onPress: () => navigation.navigate('Home') },
        ]);
        setGameOver(true);
      } else {
        Alert.alert('AI Turn', `AI picked your ${card}.`, [
          {
            text: 'Your Turn',
            onPress: () => {
              if (card === 'Catcher') {
                setPlayerCatchers((prev) => prev - 1);
              }
              setPlayerHand((prev) => updateHand(prev, randomIndex));
              setCurrentTurn('You');
            },
          },
        ]);
      }
    }, 800); // Adjust delay as needed
  };

  const cardStyle = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height * 0.2], // Adjusted for screen height
        }),
      },
      {
        scale: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.6],
        }),
      },
    ],
  };
  const calculateWinProbability = () => {
    if (!aiHand) {
      setWinProbability({ kingCapture: 0, npcCapture: 0, catcherCapture: 0 });
      return;
    }

    const totalAICards = aiHand.filter(card => card !== null).length;
    const kingCount = aiHand.filter(card => card === 'King').length;
    const NPCCount = aiHand.filter(card => card === 'NPC').length;
    const catcherCount = aiHand.filter(card => card === 'Catcher').length;

    const kingCaptureProbability = totalAICards > 0 ? (kingCount / totalAICards) * 100 : 0;
    const NPCCaptureProbability = totalAICards > 0 ? (NPCCount / totalAICards) * 100 : 0;
    const catcherCaptureProbability = totalAICards > 0 ? (catcherCount / totalAICards) * 100 : 0;

    setWinProbability({
      kingCapture: parseFloat(kingCaptureProbability.toFixed(2)),
      npcCapture: parseFloat(NPCCaptureProbability.toFixed(2)),
      catcherCapture: parseFloat(catcherCaptureProbability.toFixed(2)),
    });
  };
  const toggleWindow = () => {
    calculateWinProbability();
    setShowWindow(!showWindow);
  };

  return (
    <ImageBackground
      style={styles.bg}
      source={require('../images/battlefield.jpg')}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎯 Capture the King</Text>

        {showTurnMessage && (
          <Text style={styles.turnInfo}>{firstPlayer} goes first!</Text>
        )}

        {isThinking && <Text style={styles.thinking}>AI is thinking...</Text>}

        <Text style={styles.subtext}>Tap a card to try capturing the King!</Text>

        {/* AI Cards */}
        <View style={styles.cardContainer}>
          {aiHand.map((card, index) =>
            card !== null ? (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => attemptCapture(index)}
                disabled={gameOver || playerCatchers <= 0 || currentTurn !== 'You'}
              >
                <Text style={styles.cardText}>🎴</Text>
              </TouchableOpacity>
            ) : null
          )}
        </View>

        {/* Player Cards */}
        <Text style={styles.subtext}>Your Hand</Text>
        <View style={styles.cardContainer}>
          {playerHand.map((card, index) =>
            card !== null ? (
              <View key={index} style={styles.card}>
                <Text style={styles.cardText}>
                  {card === 'King' ? '👑 King' : card === 'Catcher' ? '🧲 Catcher' : '🧍 NPC'}
                </Text>
              </View>
            ) : null
          )}
        </View>

        {/* Animated Selected Card */}
        {selectedCard && (
          <Animated.View style={[styles.selectedCard, cardStyle]}>
            <Text style={styles.cardText}>🎴 {selectedCard}</Text>
          </Animated.View>
        )}

        <Text style={styles.info}>Your Catchers Left: {playerCatchers}</Text>
        <Text style={styles.info}>AI Catchers Left: {aiCatchers}</Text>

        <TouchableOpacity
          style={styles.probabilityButton}
          onPress={() => toggleWindow()}
        >
          <Text style={styles.backButtonText}>* Show Probability *</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
        {showWindow && (
          <View style={styles.window}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowWindow(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.windowTitle}>Your Chances</Text>
            <Text style={styles.windowText}>
              Probability of capturing the King:{' '}
              <Text style={{ fontWeight: 'bold' }}>{winProbability.kingCapture}%</Text>
            </Text>
            <Text style={styles.windowText}>
              Probability of opponent's NPC being caught:{' '}
              <Text style={{ fontWeight: 'bold' }}>{winProbability.npcCapture}%</Text>
            </Text>
            <Text style={styles.windowText}>
              Probability of opponent's Catcher being caught:{' '}
              <Text style={{ fontWeight: 'bold' }}>{winProbability.catcherCapture}%</Text>
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.08, // Adjusted for screen height
    paddingHorizontal: width * 0.05, // Adjusted for screen width
  },
  title: {
    fontSize: width * 0.08, // Responsive font size
    fontWeight: 'bold',
    color: '#f8c146',
    marginBottom: height * 0.01, // Responsive margin
  },
  turnInfo: {
    color: '#f8c146',
    fontSize: width * 0.05, // Responsive font size
    marginBottom: height * 0.01, // Responsive margin
  },
  thinking: {
    color: '#ccc',
    fontSize: width * 0.045, // Responsive font size
    marginBottom: height * 0.01, // Responsive margin
  },
  subtext: {
    color: '#ccc',
    fontSize: width * 0.04, // Responsive font size
    marginBottom: height * 0.01, // Responsive margin
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: width * 0.02, // Responsive gap
    marginBottom: height * 0.02, // Responsive margin
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: width * 0.03, // Responsive padding
    margin: width * 0.01, // Responsive margin
    elevation: 5,
    minWidth: width * 0.15, // Ensure cards have a minimum width
    alignItems: 'center'
  },
  cardText: {
    fontSize: width * 0.04, // Responsive font size
    textAlign: 'center',
  },
  selectedCard: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    backgroundColor: '#fff',
    padding: width * 0.05, // Responsive padding
    borderRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  info: {
    fontSize: width * 0.035, // Responsive font size
    marginTop: height * 0.01, // Responsive margin
  },
  probabilityButton: {
    marginTop: height * 0.03, // Responsive margin
    backgroundColor: '#f8c146',
    padding: width * 0.03, // Responsive padding
    borderRadius: 10,
    width: '80%',
  },
  backButton: {
    marginTop: height * 0.03, // Responsive margin
    backgroundColor: '#f8c146',
    padding: width * 0.03, // Responsive padding
    borderRadius: 10,
    width: '80%',
  },
  backButtonText: {
    textAlign: 'center',
    color: '#1b1b1b',
    fontSize: width * 0.04, // Responsive font size
  },
  window: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: width * 0.05, // Responsive padding
    elevation: 5,
    alignItems: 'center',
  },
  windowTitle: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.01, // Responsive margin
  },
  windowText: {
    fontSize: width * 0.04, // Responsive font size
    marginBottom: height * 0.005, // Responsive margin
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.05,  // Responsive width
    height: width * 0.05, // Responsive height
  },
  closeButtonText: {
    color: 'black',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
});