import React from 'react';

import { SafeAreaView, Text, View, Image, ScrollView, TextInput, Pressable, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { styled } from "nativewind";

const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);
const SPressable = styled(Pressable);

import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MIIcon from 'react-native-vector-icons/MaterialIcons';
import EIcon from 'react-native-vector-icons/EvilIcons';

const SFAIcon = styled(FAIcon);
const SFA5Icon = styled(FA5Icon);
const SFIcon = styled(FIcon);
const SMIIcon = styled(MIIcon);
const SEIcon = styled(EIcon);

const calculateTime = (startedAt:number) => {
    let now = Date.now() / 1000;
    let elapsedTime = Math.round(now - startedAt);
    let date = new Date();
    date.setSeconds(elapsedTime);
    return date.toISOString().slice(11, 19);
  }

export default function StreamerCard({dataObject, displayThumbnails}:any) {
    const loadInBrowser = (url: string) => {
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };
  
    return(
      <SPressable 
        onPress={() => loadInBrowser(dataObject.streamURL)}
        className="bg-blue-500 rounded p-2 mb-3"
      >
        <SView className='flex flex-row'>
          <SImage
            source={{ uri: dataObject.profileImageURL}}
            className="w-16 h-16 rounded-full mr-2"
          />
          <SView>
            <SView className='flex flex-row'>
              <SText className="font-bold text-lg text-white">{dataObject.displayName}</SText>
              <SView className='w-1'/>
              <SText className='my-auto'>
                {dataObject.verified ? 
                  <SMIIcon 
                    name="verified" size={15}
                    color="#FFFFFF"
                  /> : <></>
                }
                <SView className='w-1'/>
                {dataObject.platform == 0 ? 
                  <SFA5Icon 
                    name="twitch" size={15}
                    color="#FFFFFF"
                  /> : dataObject.platform == 1 ? 
                  <SFAIcon 
                    name="youtube-play"
                    size={15}
                    color="#FFFFFF"
                  /> : 
                  <SFA5Icon
                    name="kickstarter"
                    size={15}
                    color="#FFFFFF"
                  />
                }
              </SText>
              </SView>
              {dataObject.live ? 
                <>
                  <SView className="flex flex-row">
                    <SView className="my-auto w-3 h-3 bg-red-500 rounded-full mr-1"/>
                    <SText className='text-white font-bold'>{dataObject.viewers}{dataObject.catagory ? (<SText> • {dataObject.catagory}</SText>):(<SView></SView>)}</SText>
                  </SView>
                  {dataObject.platform != 1 ? <SText className='text-white'>{calculateTime(dataObject.streamStartTime)}</SText>:<></>}
                </>
              :
                <>
                  <SText className='text-white'>Offline</SText>
                </>
              }
          </SView>
        </SView>
        {dataObject.live ? 
        <>
          <SText className="text-white flex-1 flex-wrap my-1">{dataObject.streamTitle}</SText>
          {displayThumbnails ? 
            <SImage
              source={{ uri: dataObject.streamThumbnail}}
              resizeMode='cover'
              className='aspect-[16/9] rounded'
            />
          : <></>}
        </> : <></>}
      </SPressable>
    )
  }