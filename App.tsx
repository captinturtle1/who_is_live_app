import React from 'react';

import { SafeAreaView, Text, View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { styled } from "nativewind";
import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AddRemove from './components/AddRemove';
import StreamerCard from './components/StreamerCard';
import SliderToggle from './components/SliderToggle';

let apiURL = 'https://api.isanyone.live';

const SView = styled(View);
const SText = styled(Text);
const SScrollView = styled(ScrollView);
const SPressable = styled(Pressable);

function App(): JSX.Element {
  const [twitchList, setTwitchList] = useState<string[]>([]);
  const [youtubeList, setYoutubeList] = useState<string[]>([]);
  const [kickList, setKickList] = useState<string[]>([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);

  const [allLive, setAllLive] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);

  const [fetching, setFetching] = useState(false);

  const [displayOffline, setDisplayOffline] = useState(true);
  const [displayThumbnails, setDisplayThumbnails] = useState(true);

  useEffect(() => {
    getData().then((response:any) => {
      if (response.listData.length != 0) {
        setTwitchList([...response.listData.twitchData]);
        setYoutubeList([...response.listData.youtubeData]);
        setKickList([...response.listData.kickData]);
        
        retrieveStreamData(response.listData.twitchData, response.listData.youtubeData, response.listData.kickData);
      }
      if (response.settingsData.length != 0) {
        setDisplayOffline(response.settingsData.displayOffline);
        setDisplayThumbnails(response.settingsData.displayThumbnails);
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
      displayOffline: !displayOffline,
      displayThumbnails: displayThumbnails
    };

    setDisplayOffline(!displayOffline);
    const jsonValue = JSON.stringify(optionsObject);
    await AsyncStorage.setItem('user-settings', jsonValue);
  }

  const handleThumbnailToggle = async () => {
    let optionsObject = {
      displayOffline: displayOffline,
      displayThumbnails: !displayThumbnails
    };

    setDisplayThumbnails(!displayThumbnails);
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
        data = data.body;
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
        data = data.body;
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
        data = data.body;
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
                    displayThumbnails={displayThumbnails}
                  />
                )}
              </>
            ):(
              <>
                {allLive.map((dataObject:any) =>
                  <StreamerCard
                    key={dataObject.name + dataObject.platform}
                    dataObject={dataObject}
                    displayThumbnails={displayThumbnails}
                  />
                )}
              </>
            )}
            <SliderToggle
              functionToCall={handleToggleViewOffline}
              state={displayOffline}
              displayText={'Display Offline'}
            />
            <SliderToggle
              functionToCall={handleThumbnailToggle}
              state={displayThumbnails}
              displayText={'Display Thumbnails'}
            />
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
