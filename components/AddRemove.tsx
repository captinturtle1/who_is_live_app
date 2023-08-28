import React from 'react';

import { Text, View, Image, ScrollView, TextInput, Pressable } from 'react-native';
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
const SPressable = styled(Pressable);

const ChannelList = ({id, list, handleRemove}:any) => {
  return (
    <SView className='mt-2'>
      <SText className='text-white font-bold text-xl mb-2 mx-auto'>{id === 0 ? 'Twitch' : id === 1 ? 'Youtube' : 'Kick'}</SText>
      <SScrollView className='flex gap-1 h-[150px] mx-8'>
        {list.map((value:string, index:number) => 
          <SView key={value} className="flex flex-row bg-blue-500 px-2 rounded">
            <SText className="mr-auto my-auto text-white">{value}</SText>
            <SFIcon name="x" size={30} onPress={() => handleRemove(id, index)} className="text-red-500 m-1"/>
          </SView>
        )}
      </SScrollView>
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

  const handleSave = () => {
    setLists([addedTwitch, addedYoutube, addedKick]);
    setIsAddRemoveOpen(false);
  }
  
  return(
      <SView className="flex h-full bg-slate-800 p-2">
        <SView className='flex-grow gap-2'>
          <SText className='text-white font-bold text-xl'>Channel Name:</SText>
          <SView className='flex flex-row'>
            <SView className='bg-slate-500 flex-grow mr-2 rounded'>
              <STextInput
                onChangeText={handleUserInput}
                value={userInput}
                onSubmitEditing={addChannel}
                placeholder="Enter Channel Name"
                placeholderTextColor="#94a3b8"
                className='p-2 text-white text-lg'
              />
            </SView>
            <SPressable onPress={addChannel} className='bg-blue-500 rounded flex w-16'>
              <SText className='text-white m-auto font-bold'>Add</SText>
            </SPressable>
          </SView>
          <SText className='text-white font-bold text-xl'>Channel Platform:</SText>
          <SView className='flex mx-auto flex-row'>
            <SFA5Icon 
              onPress={() => setPlatformSelected(0)}
              name="twitch" size={30}
              color="#FFFFFF"
              className={platformSelected == 0 ? 
                'bg-purple-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-purple-500 text-center flex-1 mr-1 rounded py-1'}
            />
            <SFAIcon 
              onPress={() => setPlatformSelected(1)} 
              name="youtube-play"
              size={30}
              color="#FFFFFF"
              className={platformSelected == 1 ? 
                'bg-red-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-red-500 text-center flex-1 mr-1 rounded py-1'}
            />
            <SFA5Icon
              onPress={() => setPlatformSelected(2)}
              name="kickstarter"
              size={30}
              color="#FFFFFF"
              className={platformSelected == 2 ? 
                'bg-green-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-green-500 text-center flex-1 mr-1 rounded py-1'}
            />
          </SView>
          <SView>
            <ChannelList id={0} list={addedTwitch} handleRemove={handleRemove}/>
            <ChannelList id={1} list={addedYoutube} handleRemove={handleRemove}/>
            <ChannelList id={2} list={addedKick} handleRemove={handleRemove}/>
          </SView>
        </SView>
        <SView className='flex flex-row gap-2'>
            <SPressable className='flex-1 bg-blue-500 p-2 flex rounded' onPress={() => setIsAddRemoveOpen(false)}>
              <SText className='text-white font-bold text-lg m-auto'>Cancel</SText>
            </SPressable>
            <SPressable className='flex-1 bg-blue-500 p-2 flex rounded' onPress={handleSave}>
              <SText className='text-white font-bold text-lg m-auto'>Save</SText>
            </SPressable>
        </SView>
      </SView>
  )
}