import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    floors: [],
    rooms: [],
    objects: [],
    shown3d: false,
    businessName: ""
}
export const commonSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        addFloor: (state,action)=>{
            state.floors.push({...action.payload, objectId: (state.floors.sort((a,b)=>b.id-a.id)[0]?.id+1) || 0})
        },
        addRoom: (state,action)=>{
            const id = (state.rooms.sort((a,b)=>b.id-a.id)[0]?.id+1) || 0;
            state.rooms.push({...action.payload, id})
        },
        addObject: (state,action)=>{
            const id = (state.objects.sort((a,b)=>b.id-a.id)[0]?.id+1)
            state.objects.push({...action.payload, id: id || 0})
        },
        removeFloor: (state,action)=>{
            state.floors = state.floors.filter(el=>el.id!==action.payload);
        },
        removeRoom: (state,action)=>{
            state.rooms = state.rooms.filter(el=>el.id!==action.payload);
        },
        removeObject: (state,action)=>{
            state.objects = state.objects.filter(el=>el.id!==action.payload);
        },
        changeObject: (state,action)=>{
            state.objects = state.objects.map(el=>{
                if (el.id===action.payload.id){
                    return action.payload
                }
                else return el
            });
        },
        change3dShown: (state,action)=>{
            state.shown3d = !state.shown3d
        },
        changeRoom: (state,action)=>{
            state.rooms = state.rooms.map(el=>{
                if (el.id===action.payload.id){
                    return action.payload
                }
                else return el
            });
        },
        setBusinessName: (state,action)=>{
            state.businessName = action.payload;
        }
    }
})
export const {
    addFloors,
    addRoom,
    addObject,
    removeFloor,
    removeRoom,
    changeObject,
    changeRoom,
    change3dShown,
    removeObject,
    setBusinessName
} = commonSlice.actions;

export const selectFloors = (state)=>state.floors
export const selectRooms = (state)=>state.rooms
export const selectObjects = (state)=>state.objects
export const selectBusinessName = (state)=>state.businessName
export const select3dShown = (state)=>state.shown3d
export default commonSlice.reducer