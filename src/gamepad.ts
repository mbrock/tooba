import { useEffect, useRef } from 'react';

interface GamepadListenerProps {
  onButtonPress: (gamepad: Gamepad, button: number) => void;
}

const GamepadListener: React.FC<GamepadListenerProps> = ({ onButtonPress }) => {
  const prevButtonStates = useRef<boolean[]>([]);
  const exitFlag = useRef(false);

  useEffect(() => {
    const checkGamepadButtons = () => {
      if (exitFlag.current) return;
      const gamepad = navigator.getGamepads()[0];
      if (gamepad) {
        gamepad.buttons.forEach((button, index) => {
          const isPressed = button.pressed;
          const wasPressed = prevButtonStates.current[index] || false;

          if (isPressed && !wasPressed) {
            onButtonPress(gamepad, index)
          }

          prevButtonStates.current[index] = isPressed;
        });
      }

      requestAnimationFrame(checkGamepadButtons);
    };

    // Initialize polling loop
    checkGamepadButtons();

    return () => {
      // Set exit flag for cleanup
      // exitFlag.current = true;
      console.log('exitFlag.current');
    };
  }, [onButtonPress]);

  return null;
};

export default GamepadListener;
