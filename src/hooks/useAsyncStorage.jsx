import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

export default function useAsyncStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = AsyncStorage.getItem(key);
      console.log('useAsyncStorage.jsx: item: ', item);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
    setStoredValue(value);
  };

  return [storedValue, setValue];
}
