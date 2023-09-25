import { Text, View, Pressable } from 'react-native';
import { styled } from "nativewind";

const SView = styled(View);
const SText = styled(Text);
const SPressable = styled(Pressable);

export default function SliderToggle({functionToCall, state, displayText}:any) {
    return (
        <SView>
            <SText className="mx-auto text-white font-bold mt-1">{displayText}</SText>
            <SPressable onPress={functionToCall} className={state ? 
              "w-12 h-6 bg-blue-500 flex flex-row mx-auto mt-2 rounded-full cursor-pointer" : 
              "w-12 h-6 bg-red-400 flex flex-row mx-auto mt-2 rounded-full cursor-pointer"}
            >
              <SView className={state ? "flex-grow" : ""}/>
              <SView className="text-white bg-white rounded-full w-6 h-6"/>
            </SPressable>
        </SView>
    )
}