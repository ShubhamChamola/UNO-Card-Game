import lobbyObject from "./lobby";
import "./lobby.scss";
import store from "../Store/store";

lobbyObject;

store.subscribe(lobbyObject.initiateLobby.bind(lobbyObject));

export default "";
