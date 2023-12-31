import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS, isValidElement } from 'react';

import { Text, View, ScrollView, TextInput, Pressable } from 'react-native';
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
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);
const SPressable = styled(Pressable);

const ChannelList = ({id, list, handleRemove}:any) => {
  return (
      <SScrollView className='mx-8 flex-1'>
        {list.map((value:string, index:number) => 
          <SView key={value} className="mt-1 flex flex-row bg-blue-500 px-2 rounded">
            <SText className="mr-auto my-auto text-white">{value}</SText>
            <SFIcon name="x" size={30} onPress={() => handleRemove(id, index)} className="text-red-400 m-1"/>
          </SView>
        )}
      </SScrollView>
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

  const valdiateInput = (input: string, platform: number) => {
    if (input) {
      if (input.match(/^[a-zA-Z0-9_]+$/i)) {
        if (platform == 0) {
          if (!addedTwitch.includes(input)) {
            return true;
          }
        } else if (platform == 1) {
          if (!addedYoutube.includes(input)) {
            return true;
          }
        } else {
          if (!addedKick.includes(input)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  const handleSetPlatform = (platform: number) => {
    setPlatformSelected(platform);
    if (valdiateInput(userInput, platform)) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }

  const handleUserInput = (e:any) => {
    setUserInput(e);
    if (valdiateInput(e, platformSelected)) {
      setValidInput(true);
    } else {
      setValidInput(false)
    }
  }

  const addChannel = () => {
    setUserInput('');
    setValidInput(false);
    let newChannels = [];
    if (valdiateInput(userInput, platformSelected)) {
      if (platformSelected == 0) {
        newChannels = addedTwitch;
        newChannels.push(userInput);
        setAddedTwitch([...newChannels]);
      } else if (platformSelected == 1) {
        newChannels = addedYoutube
        newChannels.push(userInput);
        setAddedYoutube([...newChannels]);
      } else if (platformSelected == 2) {
        newChannels = addedKick;
        newChannels.push(userInput);
        setAddedKick([...newChannels]);
      }
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
          <SText className='text-white font-bold text-xl'>Select Platform:</SText>
          <SView className='flex mx-auto flex-row'>
            <SFA5Icon 
              onPress={() => handleSetPlatform(0)}
              name="twitch" size={30}
              color="#FFFFFF"
              className={platformSelected == 0 ? 
                'bg-purple-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-purple-500 text-center flex-1 mr-1 rounded py-1'}
            />
            <SFAIcon 
              onPress={() => handleSetPlatform(1)} 
              name="youtube-play"
              size={30}
              color="#FFFFFF"
              className={platformSelected == 1 ? 
                'bg-red-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-red-500 text-center flex-1 mr-1 rounded py-1'}
            />
            <SFA5Icon
              onPress={() => handleSetPlatform(2)}
              name="kickstarter"
              size={30}
              color="#FFFFFF"
              className={platformSelected == 2 ? 
                'bg-green-400 -translate-y-1 text-center flex-1 mr-1 rounded py-1' : 
                'bg-green-500 text-center flex-1 mr-1 rounded py-1'}
            />
          </SView>
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
            <SPressable onPress={validInput ? addChannel : null} className={validInput ? 'bg-blue-500 rounded flex w-16' : 'bg-gray-500 text-gray-300 rounded flex w-16'}>
              <SText className='text-white m-auto font-bold'>Add</SText>
            </SPressable>
          </SView>
          <SView>
            <SText className='text-white font-bold text-xl mb-2 mx-auto'>{platformSelected === 0 ? 'Twitch List:' : platformSelected === 1 ? 'Youtube List:' : 'Kick List:'}</SText>
          </SView>
          <ChannelList id={platformSelected} list={platformSelected == 0 ? addedTwitch : platformSelected == 1 ? addedYoutube : addedKick} handleRemove={handleRemove}/>
        </SView>
        <SView className='flex flex-row gap-2 mt-[1px]'>
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