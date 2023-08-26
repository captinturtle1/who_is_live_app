import React from 'react';

import {
  SafeAreaView,
} from 'react-native';

import { Text, View, Image, ScrollView, TextInput, Button } from 'react-native';
import { styled } from "nativewind";

import {useState, useEffect} from 'react';

const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);

function App(): JSX.Element {
  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  return (
    <SafeAreaView>
      <SView className="flex h-full bg-slate-800 p-8">
        <SView className='w-16 mx-auto flex'>
          <Button
            onPress={() => setIsAddRemoveOpen(true)}
            title='Edit'
            color='#3b82f6'
            accessibilityLabel='Open edit panel'
          />
        </SView>
      </SView>
    </SafeAreaView>
  );
}

export default App;
