import { mount } from "svelte";
import "./lib/tokens.css";
import "./lib/base.css";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app") });
