import React from 'react';

import { SafeAreaView, Text, View, Image, ScrollView, TextInput, Button } from 'react-native';
import { styled } from "nativewind";
import { useState, useEffect } from 'react';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
const SFAIcon = styled(FAIcon);
const SFA5Icon = styled(FA5Icon);
const SFIcon = styled(FIcon);


const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);

const ChannelList = ({id, list, handleRemove}:any) => {
  return (
    <SView className="w-32 flex flex-col gap-2">
      <SView>{id === 0 ? 'Twitch' : id === 1 ? 'Youtube' : 'Kick'}</SView>
      {list.map((value:string, index:number) => 
        <SView key={value} className="flex bg-blue-500 px-2 rounded">
          <SView className="mr-auto my-auto overflow-hidden text-sm">{value}</SView>
          <SFIcon name="x" size={30} onPress={() => handleRemove(id, index)} className="m-1 text-red-500 hover:text-red-600 transition-all font-black cursor-pointer"/>
        </SView>
      )}
    </SView>
  )
}

export default function AddRemove({setIsAddRemoveOpen, setLists, currentLists}:any) {
  // twitch 1, youtube 2, kick 3
  const [platformSelected, setPlatformSelected] = useState(0);
  const [userInput, setUserInput] = useState('');

  const [addedTwitch, setAddedTwitch] = useState<string[]>([]);
  const [addedYoutube, setAddedYoutube] = useState<string[]>([]);
  const [addedKick, setAddedKick] = useState<string[]>([]);

  const [validInput, setValidInput] = useState(false);

  useEffect(() => {
    setAddedTwitch([...currentLists[0]]);
    setAddedYoutube([...currentLists[1]]);
    setAddedKick([...currentLists[2]]);
  }, [])

  const handleUserInput = (e:any) => {
    setUserInput(e);
    if (e) {
      if (e.match(/^[a-zA-Z0-9_]+$/i)) {
        setValidInput(true);
      } else {
        setValidInput(false);
      }
    }
  }

  const addChannel = () => {
    setUserInput('');
    let newChannels = [];
    if (platformSelected === 0) {
      newChannels = addedTwitch;
      newChannels.push(userInput);
      setAddedTwitch([...newChannels]);
    } else if (platformSelected === 1) {
      newChannels = addedYoutube
      newChannels.push(userInput);
      setAddedYoutube([...newChannels]);
    } else if (platformSelected === 2) {
      newChannels = addedKick;
      newChannels.push(userInput);
      setAddedKick([...newChannels]);
    }
  }

  const handleRemove = (platform:number, index:number) => {
    if (platform === 0) {
      let newArray = addedTwitch;
      newArray.splice(index, 1);
      setAddedTwitch([...newArray]);
    } else if (platform === 1) {
      let newArray = addedYoutube;
      newArray.splice(index, 1);
      setAddedYoutube([...newArray]);
    } else if (platform === 2) {
      let newArray = addedKick;
      newArray.splice(index, 1);
      setAddedKick([...newArray]);
    }
  }

  const handleCancel = () => {
    setIsAddRemoveOpen(false)
  }

  const handleSave = () => {
    setLists([addedTwitch, addedYoutube, addedKick]);
    setIsAddRemoveOpen(false);
  }
  
  return(
      <SView className="flex h-full bg-slate-800 p-2">
        <SView className='flex-grow gap-2'>
          <SView className='bg-slate-500'>
            <TextInput
              onChangeText={handleUserInput}
              value={userInput}
            />
          </SView>
          <SView className='flex mx-auto flex-row'>
            <SFA5Icon 
              onPress={() => setPlatformSelected(0)}
              name="twitch" size={30}
              color="#FFFFFF"
              className='bg-[#9146FF] text-center flex-1 mr-1 rounded py-1'
            />
            <SFAIcon 
              onPress={() => setPlatformSelected(1)} 
              name="youtube-play"
              size={30}
              color="#FFFFFF"
              className='bg-[#FF0000] text-center flex-1 mx-1 rounded py-1'
            />
            <SFA5Icon
              onPress={() => setPlatformSelected(2)}
              name="kickstarter"
              size={30}
              color="#FFFFFF"
              className='bg-[#53FC18] text-center flex-1 ml-1 rounded py-1'
            />
          </SView>
          <SView className='flex'>
            <Button
              onPress={() => null}
              title='Add'
              color='#3b82f6'
              accessibilityLabel='Add provided channel to the list'
            />
          </SView>
        </SView>
        <SView className='flex flex-row gap-2'>
          <SView className='flex-1'>
            <Button
              onPress={() => setIsAddRemoveOpen(false)}
              title='Cancel'
              color='#3b82f6'
              accessibilityLabel='Open edit panel button'
            />
          </SView>
          <SView className='flex-1'>
            <Button
              onPress={() => setIsAddRemoveOpen(false)}
              title='Save'
              color='#3b82f6'
              accessibilityLabel='Refresh list button'
            />
          </SView>
        </SView>
      </SView>
  )
}