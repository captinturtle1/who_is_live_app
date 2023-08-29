import React from 'react';

import { SafeAreaView, Text, View, Image, ScrollView, TextInput, Pressable } from 'react-native';
import { styled } from "nativewind";
import { useState, useEffect } from 'react';

import AddRemove from './components/AddRemove';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MIIcon from 'react-native-vector-icons/MaterialIcons';

const SFAIcon = styled(FAIcon);
const SFA5Icon = styled(FA5Icon);
const SFIcon = styled(FIcon);
const SMIIcon = styled(MIIcon);

let apiURL = 'https://api.isanyone.live';

const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);
const SPressable = styled(Pressable);

// some scuffed styling in this component, lots of weird padding issues i couldn't figure out :/
const StreamerCard = ({dataObject}:any) => {
  return(
    <SView className="flex flex-row bg-blue-500 rounded mb-2 p-2">
      <SImage source={{ uri: dataObject.profileImageURL}} className={dataObject.live ? "w-16 h-16 rounded-full" : "w-16 h-16 rounded-full grayscale"}/>
      {/* scuffed padding */}
      <SView className='w-1'/>
      <SView>
        <SView className='flex flex-row'>
          <SText className="font-bold text-lg text-white mr-1">{dataObject.displayName}</SText>
            <SText className='my-auto'>
              {dataObject.verified ? 
                <SMIIcon 
                  name="verified" size={15}
                  color="#FFFFFF"
                /> : <></>
              }
              {/*scuffed padding*/}
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
                <SView className="my-auto mr-1 w-3 h-3 bg-red-500 rounded-full"/>
                <SText className='text-white'>{dataObject.viewers}</SText>
              </SView>
              {/*scuffed padding*/}
              <SText className="text-white max-w-[78vw]">{dataObject.streamTitle}</SText>
            </>
          :
            <>
              <SText className='text-white'>Offline</SText>
            </>
          }
      </SView>
    </SView>
  )
}

function App(): JSX.Element {
  const [twitchList, setTwitchList] = useState<string[]>([]);
  const [youtubeList, setYoutubeList] = useState<string[]>([]);
  const [kickList, setKickList] = useState<string[]>([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [allLive, setAllLive] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  const [fetching, setFetching] = useState(false);

  const [displayOffline, setDisplayOffline] = useState(true);

  const setLists = (newData:any) => {
    setTwitchList([...newData[0]]);
    setYoutubeList([...newData[1]]);
    setKickList([...newData[2]]);
  }

  const retrieveStreamData = (twitchData:string[], youtubeData:string[], kickData:string[]) => {
    let fetchingTwitch = false;
    let fetchingYoutube = false;
    let fetchingKick = false;

    let newAllLive:any = [];
    let newAllData:any = [];

    // getting twitch data
    if (twitchData.length > 0) {
      setFetching(true);
      fetchingTwitch = true;
      fetch(`${apiURL}/twitch`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(twitchData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 0;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a:any, b:any) => b.viewers - a.viewers);
        newAllLive.sort((a:any, b:any) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingTwitch = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingTwitch = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
    }

    // getting youtube data
    if (youtubeData.length > 0) {
      setFetching(true);
      fetchingYoutube = true;
      fetch(`${apiURL}/youtube`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(youtubeData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 1;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a:any, b:any) => b.viewers - a.viewers);
        newAllLive.sort((a:any, b:any) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingYoutube = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingYoutube = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
    }

    // getting kick data
    if (kickData.length > 0) {
      setFetching(true);
      fetchingKick = true;
      fetch(`${apiURL}/kick`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(kickData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 2;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a:any, b:any) => b.viewers - a.viewers);
        newAllLive.sort((a:any, b:any) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingKick = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingKick = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
    }
  }

  return (
    <SafeAreaView>
      {isAddRemoveOpen ? 
        <AddRemove
          setIsAddRemoveOpen={setIsAddRemoveOpen}
          setLists={setLists}
          currentLists={[twitchList, youtubeList, kickList]}
        />
      :
        <SView className="flex h-full bg-slate-800 p-2">
          <SScrollView className='flex-grow'>
            {allData.map((dataObject:any) =>
              <StreamerCard
                key={dataObject.name + dataObject.platform}
                dataObject={dataObject}
              />
            )}
          </SScrollView>
          <SView className='flex flex-row gap-2 mt-1'>
            <SPressable className='flex-1 bg-blue-500 p-2 flex rounded' onPress={() => setIsAddRemoveOpen(true)}>
              <SText className='text-white font-bold text-lg m-auto'>Edit</SText>
            </SPressable>
            <SPressable className='flex-1 bg-blue-500 p-2 flex rounded' onPress={() => retrieveStreamData(twitchList, youtubeList, kickList)}>
              <SText className='text-white font-bold text-lg m-auto'>Refresh</SText>
            </SPressable>
            <SPressable className='flex-1 bg-blue-500 p-2 flex rounded' onPress={() => setIsHelpOpen(true)}>
              <SText className='text-white font-bold text-lg m-auto'>Help</SText>
            </SPressable>
          </SView>
        </SView>
      }
    </SafeAreaView>
  );
}

export default App;
