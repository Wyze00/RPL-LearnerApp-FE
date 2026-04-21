import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../types/user.type";

const initialState: User = {
    username: '',
    roles: [],
};

type UserSliceAction = {
    type: string,
    payload: User | undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setState: (_, action: UserSliceAction) => {
            return action.payload;
        },
        resetState: () => {
            return {
                username: '',
                roles: []
            };
        },
    },
    selectors: {
        getRole: (state: User) => {
            return state.roles;
        }
    }
})