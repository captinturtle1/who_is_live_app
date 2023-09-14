import React from 'react';

import { SafeAreaView, Text, View, Image, ScrollView, TextInput, Pressable, ActivityIndicator, Linking, RefreshControl } from 'react-native';
import { styled } from "nativewind";
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AddRemove from './components/AddRemove';

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

let apiURL = 'https://api.isanyone.live';

const SView = styled(View);
const SText = styled(Text);
const SImage = styled(Image);
const SScrollView = styled(ScrollView);
const STextInput = styled(TextInput);
const SPressable = styled(Pressable);

// some scuffed styling in this component, lots of weird padding issues i couldn't figure out :/
const StreamerCard = ({dataObject}:any) => {
  const loadInBrowser = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  return(
    <SPressable 
      onPress={() => loadInBrowser(dataObject.streamURL)}
      className="flex flex-row bg-blue-500 rounded mb-2 p-2"
    >
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
                <SText className='text-white'>{dataObject.viewers}{dataObject.catagory ? (<SText> • {dataObject.catagory}</SText>):(<SView></SView>)}</SText>
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
    </SPressable>
  )
}

function App(): JSX.Element {
  const [twitchList, setTwitchList] = useState<string[]>([]);
  const [youtubeList, setYoutubeList] = useState<string[]>([]);
  const [kickList, setKickList] = useState<string[]>([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);

  const [allLive, setAllLive] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  const [fetching, setFetching] = useState(false);

  const [displayOffline, setDisplayOffline] = useState(true);

  useEffect(() => {
    getData().then((response:any) => {
      if (response.listData.length != 0) {
        setTwitchList([...response.listData.twitchData]);
        setYoutubeList([...response.listData.youtubeData]);
        setKickList([...response.listData.kickData]);
        
        retrieveStreamData(response.listData.twitchData, response.listData.youtubeData, response.listData.kickData);
      }
      if (response.settingsData.length != 0) {
        setDisplayOffline(response.settingsData.displayOffline)
      }

    }).catch(console.log);
  }, [])

  const storeData = async (value:any) => {
    return new Promise(async (res, rej) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('user-data', jsonValue);
        res({status: 'Success'});
      } catch (err) {
        rej(err);
      }
    })
  };
  
  const getData = async () => {
    return new Promise(async (res, rej) => {
      try {
        let returnObject = {
          listData: {},
          settingsData: {}
        }

        let listData = await AsyncStorage.getItem('user-data');
        let settingsData = await AsyncStorage.getItem('user-settings');
        if (listData) {
          returnObject.listData = JSON.parse(listData)
        }
        if (settingsData) {
          returnObject.settingsData = JSON.parse(settingsData)
        }
        res(returnObject);
      } catch (err) {
        rej(err);
      }
    })
  };

  const handleToggleViewOffline = async () => {
    let optionsObject = {
      displayOffline: !displayOffline
    };

    setDisplayOffline(!displayOffline);
    const jsonValue = JSON.stringify(optionsObject);
    await AsyncStorage.setItem('user-settings', jsonValue);
  }

  const setLists = (newData:any) => {
    setTwitchList([...newData[0]]);
    setYoutubeList([...newData[1]]);
    setKickList([...newData[2]]);

    let data = {
      twitchData: newData[0],
      youtubeData: newData[1],
      kickData: newData[2],
      number: 1
    }
    storeData(data);
    retrieveStreamData(newData[0], newData[1], newData[2]);
  }

  const retrieveStreamData = (twitchData:string[], youtubeData:string[], kickData:string[]) => {
    let fetchingTwitch = false;
    let fetchingYoutube = false;
    let fetchingKick = false;

    let newAllLive:any = [];
    let newAllData:any = [];

    setAllData([...newAllData]);
    setAllLive([...newAllLive]);
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
          <SScrollView 
            className='flex-grow' 
            refreshControl={
              <RefreshControl 
                colors={['#ffffff']}
                progressBackgroundColor={'#1e293b'}
                refreshing={fetching} 
                onRefresh={() => retrieveStreamData(twitchList, youtubeList, kickList)}
              />
            }>
            {displayOffline ? (
              <>
                {allData.map((dataObject:any) =>
                  <StreamerCard
                    key={dataObject.name + dataObject.platform}
                    dataObject={dataObject}
                  />
                )}
              </>
            ):(
              <>
                {allLive.map((dataObject:any) =>
                  <StreamerCard
                    key={dataObject.name + dataObject.platform}
                    dataObject={dataObject}
                  />
                )}
              </>
            )}
            <SText className="mx-auto text-white font-bold mt-1">Display Offline</SText>
            <SPressable onPress={handleToggleViewOffline} className={displayOffline ? 
              "w-12 h-6 bg-blue-500 flex flex-row mx-auto mt-2 rounded-full cursor-pointer" : 
              "w-12 h-6 bg-red-400 flex flex-row mx-auto mt-2 rounded-full cursor-pointer"}
            >
              <SView className={displayOffline ? "flex-grow" : ""}/>
              <SView className="text-white bg-white rounded-full w-6 h-6"/>
            </SPressable>
          </SScrollView>
          <SPressable className='bg-blue-500 p-2 mt-2 flex rounded' onPress={() => setIsAddRemoveOpen(true)}>
            <SText className='text-white font-bold text-lg m-auto'>Edit</SText>
          </SPressable>
        </SView>
      }
    </SafeAreaView>
  );
}

export default App;
