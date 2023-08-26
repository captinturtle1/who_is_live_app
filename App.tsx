import React from 'react';

import { SafeAreaView, Text, View, Image, ScrollView, TextInput, Button } from 'react-native';
import { styled } from "nativewind";
import { useState, useEffect } from 'react';

import AddRemove from './components/AddRemove';

const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);

function App(): JSX.Element {
  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  return (
    <SafeAreaView>
      {isAddRemoveOpen ? 
        <AddRemove setIsAddRemoveOpen={setIsAddRemoveOpen}/> 
      :
        <SView className="flex h-full bg-slate-800 p-2">
          <SView className='flex-grow'/>
          <SView className='flex flex-row gap-2'>
            <SView className='flex-1'>
              <Button
                onPress={() => setIsAddRemoveOpen(true)}
                title='Edit'
                color='#3b82f6'
                accessibilityLabel='Open edit panel button'
              />
            </SView>
            <SView className='flex-1'>
              <Button
                onPress={() => setIsAddRemoveOpen(true)}
                title='Refresh'
                color='#3b82f6'
                accessibilityLabel='Refresh list button'
              />
            </SView>
            <SView className='flex-1'>
              <Button
                onPress={() => setIsAddRemoveOpen(true)}
                title='Help'
                color='#3b82f6'
                accessibilityLabel='View help'
              />
            </SView>
          </SView>
        </SView>
      }
    </SafeAreaView>
  );
}

export default App;
