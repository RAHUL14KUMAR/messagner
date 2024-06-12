export const initialState={
    user:null,
    socket:null
}

const reducer=(state,action) => {
    console.log("action>>>>",action); 

    switch(action.type){
        case "SET_USER":
            return {
                ...state,
                user: action.user,
            };

        case "SET_SOCKET":
            return {
                ...state,
                 socket: action.socket,
             };

        default:
            return state
    }    
}
export default reducer;